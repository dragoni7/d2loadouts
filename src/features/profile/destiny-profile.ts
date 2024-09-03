import {
  ARMOR,
  BUCKET_HASH,
  COLLECTIBLE_OWNED,
  DAMAGE_TYPE,
  EMPTY_ASPECT,
  EMPTY_FRAGMENT,
  EMPTY_MANIFEST_PLUG,
  PRIMARY_STATS,
  SOCKET_HASH,
  STAT_HASH,
} from '../../lib/bungie_api/constants';
import { getProfileDataRequest } from '../../lib/bungie_api/requests';
import { db } from '../../store/db';
import {
  armor,
  Character,
  CharacterClass,
  DamageType,
  DestinyArmor,
  Emblem,
  ProfileData,
  Subclass,
} from '../../types/d2l-types';
import { getCharacterClass, modReverseDict } from './util';

export async function getProfileData(): Promise<ProfileData> {
  const profile: ProfileData = {
    characters: [],
  };

  const response = await getProfileDataRequest();

  if (response.data.Response) {
    const itemComponents = response.data.Response.itemComponents;
    const profileInventory = response.data.Response.profileInventory.data.items;
    const characterInventories = response.data.Response.characterInventories.data;
    const characterEquipment = response.data.Response.characterEquipment.data;
    const characterData = response.data.Response.characters.data;
    const profileCollectibles = response.data.Response.profileCollectibles.data.collectibles;

    for (const key in characterData) {
      const characterClass = getCharacterClass(characterData[key].classHash);

      const character: Character = {
        id: characterData[key].characterId,
        class: characterClass,
        armor: {
          helmet: [],
          arms: [],
          legs: [],
          chest: [],
          classItem: [],
        },
        subclasses: {},
        exoticClassCombos: [],
      };

      // iterate character's equipped items
      for (const item of characterEquipment[key].items) {
        switch (item.bucketHash) {
          case BUCKET_HASH.EMBLEM: {
            const emblemDef = await db.manifestEmblemDef
              .where('itemHash')
              .equals(item.itemHash)
              .first();

            if (emblemDef) {
              const emblem: Emblem = {
                secondaryOverlay: emblemDef.secondaryOverlay,
                secondarySpecial: emblemDef.secondarySpecial,
              };

              character.emblem = emblem;
            }

            continue;
          }

          case BUCKET_HASH.SUBCLASS: {
            buildSubclassConfig(item, character, itemComponents);
            continue;
          }

          case BUCKET_HASH.HELMET: {
            const helmet = await buildDestinyArmor(
              itemComponents,
              item,
              character.class,
              ARMOR.HELMET
            );
            character.armor.helmet.push(helmet);
            continue;
          }

          case BUCKET_HASH.GAUNTLETS: {
            const arms = await buildDestinyArmor(
              itemComponents,
              item,
              character.class,
              ARMOR.GAUNTLETS
            );
            character.armor.arms.push(arms);
            continue;
          }

          case BUCKET_HASH.CHEST_ARMOR: {
            const chest = await buildDestinyArmor(
              itemComponents,
              item,
              character.class,
              ARMOR.CHEST_ARMOR
            );
            character.armor.chest.push(chest);
            continue;
          }

          case BUCKET_HASH.LEG_ARMOR: {
            const legs = await buildDestinyArmor(
              itemComponents,
              item,
              character.class,
              ARMOR.LEG_ARMOR
            );
            character.armor.legs.push(legs);
            continue;
          }

          case BUCKET_HASH.CLASS_ARMOR: {
            const classItem = await buildDestinyArmor(
              itemComponents,
              item,
              character.class,
              ARMOR.CLASS_ARMOR
            );
            character.armor.classItem.push(classItem);
            // add exotic class combo
            if (classItem.exotic) {
              const sockets = itemComponents.sockets.data[classItem.instanceHash]?.sockets;

              const target = character.exoticClassCombos.findIndex(
                (combo) =>
                  combo.firstIntrinsicHash === sockets[10].plugHash &&
                  combo.secondIntrinsicHash === sockets[11].plugHash
              );

              if (target !== -1) {
                character.exoticClassCombos[target].instanceHashes.push(classItem.instanceHash);
              } else {
                character.exoticClassCombos.push({
                  instanceHashes: [classItem.instanceHash],
                  firstIntrinsicHash: sockets[10].plugHash,
                  secondIntrinsicHash: sockets[11].plugHash,
                });
              }
            }
            continue;
          }
        }
      }

      // iterate character's inventory
      for (const item of characterInventories[key].items) {
        switch (item.bucketHash) {
          case BUCKET_HASH.SUBCLASS: {
            buildSubclassConfig(item, character, itemComponents);
            continue;
          }

          case BUCKET_HASH.HELMET: {
            character.armor.helmet.push(
              await buildDestinyArmor(itemComponents, item, character.class, ARMOR.HELMET)
            );
            continue;
          }

          case BUCKET_HASH.GAUNTLETS: {
            character.armor.arms.push(
              await buildDestinyArmor(itemComponents, item, character.class, ARMOR.GAUNTLETS)
            );
            continue;
          }

          case BUCKET_HASH.CHEST_ARMOR: {
            character.armor.chest.push(
              await buildDestinyArmor(itemComponents, item, character.class, ARMOR.CHEST_ARMOR)
            );
            continue;
          }

          case BUCKET_HASH.LEG_ARMOR: {
            character.armor.legs.push(
              await buildDestinyArmor(itemComponents, item, character.class, ARMOR.LEG_ARMOR)
            );
            continue;
          }

          case BUCKET_HASH.CLASS_ARMOR: {
            const classItem = await buildDestinyArmor(
              itemComponents,
              item,
              character.class,
              ARMOR.CLASS_ARMOR
            );
            character.armor.classItem.push(classItem);
            // add exotic class combo
            if (classItem.exotic) {
              const sockets = itemComponents.sockets.data[classItem.instanceHash]?.sockets;

              const target = character.exoticClassCombos.findIndex(
                (combo) =>
                  combo.firstIntrinsicHash === sockets[10].plugHash &&
                  combo.secondIntrinsicHash === sockets[11].plugHash
              );

              if (target !== -1) {
                character.exoticClassCombos[target].instanceHashes.push(classItem.instanceHash);
              } else {
                character.exoticClassCombos.push({
                  instanceHashes: [classItem.instanceHash],
                  firstIntrinsicHash: sockets[10].plugHash,
                  secondIntrinsicHash: sockets[11].plugHash,
                });
              }
            }
            continue;
          }
        }
      }

      profile.characters.push(character);
    }

    // iterate profile inventory

    for (const item of profileInventory) {
      const itemInstance = itemComponents.instances.data[item.itemInstanceId];

      if (
        itemInstance &&
        itemInstance.primaryStat &&
        itemInstance.primaryStat.statHash === PRIMARY_STATS.DEFENSE
      ) {
        const stats = itemComponents.stats.data[item.itemInstanceId].stats;
        const sockets = itemComponents.sockets.data[item.itemInstanceId]?.sockets;

        const destinyArmor: DestinyArmor = {
          intellect: stats[STAT_HASH.INTELLECT]?.value || 0,
          discipline: stats[STAT_HASH.DISCIPLINE]?.value || 0,
          resilience: stats[STAT_HASH.RESILIENCE]?.value || 0,
          mobility: stats[STAT_HASH.MOBILITY]?.value || 0,
          strength: stats[STAT_HASH.STRENGTH]?.value || 0,
          recovery: stats[STAT_HASH.RECOVERY]?.value || 0,
          instanceHash: item.itemInstanceId,
          masterwork: itemInstance?.energy && itemInstance.energy.energyCapacity === 10,
          itemHash: item.itemHash,
          location: item.location,
          icon: '',
          name: '',
          type: '',
        };

        stripModStats(sockets, destinyArmor);
        setArtificeState(sockets, destinyArmor);

        const armorDef = await db.manifestArmorDef
          .where('itemHash')
          .equals(Number(destinyArmor.itemHash))
          .first();

        if (armorDef) {
          // determine required class
          destinyArmor.class = armorDef.class as CharacterClass;
          // determine armor slot
          destinyArmor.type = armorDef.slot;
          // determine if exotic
          destinyArmor.exotic = armorDef.isExotic;
          // get name
          destinyArmor.name = armorDef.name;
          // get icon
          destinyArmor.icon = armorDef.icon;
        }

        let target = profile.characters.filter((c) => c.class === destinyArmor.class);

        for (const character of target) {
          switch (destinyArmor.type) {
            case ARMOR.HELMET: {
              character.armor.helmet.push(destinyArmor);
              continue;
            }
            case ARMOR.GAUNTLETS: {
              character.armor.arms.push(destinyArmor);
              continue;
            }
            case ARMOR.CHEST_ARMOR: {
              character.armor.chest.push(destinyArmor);
              continue;
            }
            case ARMOR.LEG_ARMOR: {
              character.armor.legs.push(destinyArmor);
              continue;
            }
            case ARMOR.CLASS_ARMOR: {
              character.armor.classItem.push(destinyArmor);
              // add exotic class combo
              if (destinyArmor.exotic) {
                const sockets = itemComponents.sockets.data[destinyArmor.instanceHash]?.sockets;

                const target = character.exoticClassCombos.findIndex(
                  (combo) =>
                    combo.firstIntrinsicHash === sockets[10].plugHash &&
                    combo.secondIntrinsicHash === sockets[11].plugHash
                );

                if (target !== -1) {
                  character.exoticClassCombos[target].instanceHashes.push(
                    destinyArmor.instanceHash
                  );
                } else {
                  character.exoticClassCombos.push({
                    instanceHashes: [destinyArmor.instanceHash],
                    firstIntrinsicHash: sockets[10].plugHash,
                    secondIntrinsicHash: sockets[11].plugHash,
                  });
                }
              }
              continue;
            }
          }
        }
      }
    }

    // iterate profile collectibles
    for (const collectible in profileCollectibles) {
      const exoticCollectable = await db.manifestExoticArmorCollection
        .where('collectibleHash')
        .equals(Number(collectible))
        .first();

      const armorModDef = await db.manifestArmorModDef
        .where('collectibleHash')
        .equals(Number(collectible))
        .first();

      const armorStatModDef = await db.manifestArmorStatModDef
        .where('collectibleHash')
        .equals(Number(collectible))
        .first();

      if (exoticCollectable) {
        if (COLLECTIBLE_OWNED.includes(Number(profileCollectibles[collectible].state)))
          await db.manifestExoticArmorCollection
            .where('collectibleHash')
            .equals(Number(collectible))
            .modify({ isOwned: true });
      } else if (armorModDef) {
        if (!COLLECTIBLE_OWNED.includes(Number(profileCollectibles[collectible].state)))
          await db.manifestArmorModDef
            .where('collectibleHash')
            .equals(Number(collectible))
            .modify({ isOwned: false });
      } else if (armorStatModDef) {
        if (!COLLECTIBLE_OWNED.includes(Number(profileCollectibles[collectible].state)))
          await db.manifestArmorStatModDef
            .where('collectibleHash')
            .equals(Number(collectible))
            .modify({ isOwned: false });
      }
    }

    // iterate character collectibles
    // use any character's collectibles since it shares
    const characterCollectibles =
      response.data.Response.characterCollectibles.data[profile.characters[0].id].collectibles;

    for (const collectible in characterCollectibles) {
      const exoticCollectable = await db.manifestExoticArmorCollection
        .where('collectibleHash')
        .equals(Number(collectible))
        .first();

      if (
        exoticCollectable &&
        COLLECTIBLE_OWNED.includes(Number(characterCollectibles[collectible].state))
      ) {
        db.manifestExoticArmorCollection
          .where('collectibleHash')
          .equals(Number(collectible))
          .modify({ isOwned: true });
      }
    }
  } else {
    console.log('Could not get response');
  }

  return profile;
}

async function buildSubclassConfig(item: any, character: Character, itemComponents: any) {
  const subclassQuery = db.manifestSubclass.where('itemHash').equals(item.itemHash);

  await subclassQuery.modify({ isOwned: true });

  const subclass = await subclassQuery.first();

  if (subclass) {
    const s: Subclass = {
      instanceId: item.itemInstanceId,
      itemHash: subclass.itemHash,
      damageType: subclass.damageType,
      name: subclass.name,
      class: subclass.class,
      icon: subclass.icon,
      screenshot: subclass.screenshot,
      isOwned: subclass.isOwned,
    };

    character.subclasses[subclass.damageType] = {
      subclass: s,
      damageType: subclass.damageType as DamageType,
      super: EMPTY_MANIFEST_PLUG,
      aspects: [EMPTY_ASPECT, EMPTY_ASPECT],
      fragments: [EMPTY_FRAGMENT, EMPTY_FRAGMENT, EMPTY_FRAGMENT, EMPTY_FRAGMENT, EMPTY_FRAGMENT],
      classAbility: null,
      meleeAbility: null,
      movementAbility: null,
      grenade: null,
    };

    // set equipped loadout subclass config
    const subclassSockets = itemComponents.sockets.data[item.itemInstanceId]?.sockets;

    if (subclassSockets && character.subclasses[subclass.damageType] !== undefined) {
      const classAbility = await db.manifestSubclassModDef
        .where('itemHash')
        .equals(subclassSockets[0].plugHash)
        .first();

      if (classAbility) character.subclasses[subclass.damageType]!.classAbility = classAbility;

      const movementAbility = await db.manifestSubclassModDef
        .where('itemHash')
        .equals(subclassSockets[1].plugHash)
        .first();

      if (movementAbility)
        character.subclasses[subclass.damageType]!.movementAbility = movementAbility;

      const superAbility = await db.manifestSubclassModDef
        .where('itemHash')
        .equals(subclassSockets[2].plugHash)
        .first();

      if (superAbility) character.subclasses[subclass.damageType]!.super = superAbility;

      const meleeAbility = await db.manifestSubclassModDef
        .where('itemHash')
        .equals(subclassSockets[3].plugHash)
        .first();

      if (meleeAbility) character.subclasses[subclass.damageType]!.meleeAbility = meleeAbility;

      const grenade = await db.manifestSubclassModDef
        .where('itemHash')
        .equals(subclassSockets[4].plugHash)
        .first();

      if (grenade) character.subclasses[subclass.damageType]!.grenade = grenade;

      if (subclass.damageType === DAMAGE_TYPE.KINETIC) {
        const firstAspect = await db.manifestSubclassAspectsDef
          .where('itemHash')
          .equals(subclassSockets[7].plugHash)
          .first();

        if (firstAspect) character.subclasses[subclass.damageType]!.aspects[0] = firstAspect;

        const secondAspect = await db.manifestSubclassAspectsDef
          .where('itemHash')
          .equals(subclassSockets[8].plugHash)
          .first();

        if (secondAspect) character.subclasses[subclass.damageType]!.aspects[1] = secondAspect;

        const fragments = subclassSockets.slice(9, subclassSockets.length);
        for (let i = 0; i < fragments.length; i++) {
          const fragment = await db.manifestSubclassFragmentsDef
            .where('itemHash')
            .equals(fragments[i].plugHash)
            .first();

          if (fragment) character.subclasses[subclass.damageType]!.fragments[i] = fragment;
        }
      } else {
        const firstAspect = await db.manifestSubclassAspectsDef
          .where('itemHash')
          .equals(subclassSockets[5].plugHash)
          .first();

        if (firstAspect) character.subclasses[subclass.damageType]!.aspects[0] = firstAspect;

        const secondAspect = await db.manifestSubclassAspectsDef
          .where('itemHash')
          .equals(subclassSockets[6].plugHash)
          .first();

        if (secondAspect) character.subclasses[subclass.damageType]!.aspects[1] = secondAspect;

        const fragments = subclassSockets.slice(7, subclassSockets.length);
        for (let i = 0; i < fragments.length; i++) {
          const fragment = await db.manifestSubclassFragmentsDef
            .where('itemHash')
            .equals(fragments[i].plugHash)
            .first();

          if (fragment) character.subclasses[subclass.damageType]!.fragments[i] = fragment;
        }
      }
    }
  }
}

async function buildDestinyArmor(
  itemComponents: any,
  item: any,
  characterClass: CharacterClass,
  armorSlot: armor
): Promise<DestinyArmor> {
  const itemInstance = itemComponents.instances.data[item.itemInstanceId];
  const stats = itemComponents.stats.data[item.itemInstanceId].stats;
  const sockets = itemComponents.sockets.data[item.itemInstanceId]?.sockets;

  const destinyArmor: DestinyArmor = {
    intellect: stats[STAT_HASH.INTELLECT]?.value || 0,
    discipline: stats[STAT_HASH.DISCIPLINE]?.value || 0,
    resilience: stats[STAT_HASH.RESILIENCE]?.value || 0,
    mobility: stats[STAT_HASH.MOBILITY]?.value || 0,
    strength: stats[STAT_HASH.STRENGTH]?.value || 0,
    recovery: stats[STAT_HASH.RECOVERY]?.value || 0,
    instanceHash: item.itemInstanceId,
    masterwork: itemInstance?.energy && itemInstance.energy.energyCapacity === 10,
    itemHash: item.itemHash,
    location: item.location,
    type: armorSlot,
    icon: '',
    name: '',
    class: characterClass,
  };

  stripModStats(sockets, destinyArmor);
  setArtificeState(sockets, destinyArmor);

  const armorDef = await db.manifestArmorDef
    .where('itemHash')
    .equals(Number(destinyArmor.itemHash))
    .first();

  if (armorDef) {
    // determine if exotic
    destinyArmor.exotic = armorDef.isExotic;
    // get name
    destinyArmor.name = armorDef.name;
    // get icon
    destinyArmor.icon = armorDef.icon;
  }

  return destinyArmor;
}

function stripModStats(sockets: any, destinyArmor: DestinyArmor) {
  if (sockets) {
    for (const key in modReverseDict) {
      if (sockets.some((mod: any) => mod.plugHash === Number(key))) {
        modReverseDict[key](destinyArmor);
      }
    }
  }
}

function setArtificeState(sockets: any, destinyArmor: DestinyArmor) {
  if (sockets) {
    destinyArmor.artifice = sockets.some(
      (mod: any) =>
        mod.plugHash === SOCKET_HASH.ARTIFICE_ARMOR ||
        mod.plugHash === SOCKET_HASH.UNLOCKED_ARTIFICE_ARMOR
    );
  }
}
