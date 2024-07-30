import {
  BUCKET_HASH,
  PLUG_SET,
  PRIMARY_STATS,
  SOCKET_HASH,
  STAT_HASH,
  SUBCLASS_PLUG_SETS,
} from '../../lib/bungie_api/Constants';
import { getProfileDataRequest } from '../../lib/bungie_api/Requests';
import { db } from '../../store/db';
import { Character, CharacterClass, DestinyArmor, Emblem, ProfileData } from '../../types';
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
    const profilePlugSets = response.data.Response.profilePlugSets.data.plugs;
    const profileCollectibles = response.data.Response.profileCollectibles.data.collectibles;

    for (const key in characterData) {
      const characterClass = getCharacterClass(characterData[key].classHash);
      const plugSets = response.data.Response.characterPlugSets.data[key].plugs;

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
        // TODO: remove this?
        exotics: {
          helmet: [],
          arms: [],
          legs: [],
          chest: [],
          classItem: [],
        },
      };

      // iterate character's equipped items
      for (const item of characterEquipment[key].items) {
        switch (item.bucketHash) {
          case BUCKET_HASH.EMBLEM: {
            const emblemDef = await db.manifestEmblemDef
              .where('hash')
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
            await db.manifestSubclass.where('hash').equals(item.itemHash).modify({ isOwned: true });
            continue;
          }

          case BUCKET_HASH.HELMET: {
            character.armor.helmet.push(
              await buildDestinyArmor(itemComponents, item, character.class, 'helmet')
            );
            continue;
          }

          case BUCKET_HASH.GAUNTLETS: {
            character.armor.arms.push(
              await buildDestinyArmor(itemComponents, item, character.class, 'arms')
            );
            continue;
          }

          case BUCKET_HASH.CHEST_ARMOR: {
            character.armor.chest.push(
              await buildDestinyArmor(itemComponents, item, character.class, 'chest')
            );
            continue;
          }

          case BUCKET_HASH.LEG_ARMOR: {
            character.armor.legs.push(
              await buildDestinyArmor(itemComponents, item, character.class, 'legs')
            );
            continue;
          }

          case BUCKET_HASH.CLASS_ARMOR: {
            character.armor.classItem.push(
              await buildDestinyArmor(itemComponents, item, character.class, 'class')
            );
            continue;
          }
        }
      }

      // iterate character's inventory
      for (const item of characterInventories[key].items) {
        switch (item.bucketHash) {
          case BUCKET_HASH.SUBCLASS: {
            await db.manifestSubclass.where('hash').equals(item.itemHash).modify({ isOwned: true });
            continue;
          }

          case BUCKET_HASH.HELMET: {
            character.armor.helmet.push(
              await buildDestinyArmor(itemComponents, item, character.class, 'helmet')
            );
            continue;
          }

          case BUCKET_HASH.GAUNTLETS: {
            character.armor.arms.push(
              await buildDestinyArmor(itemComponents, item, character.class, 'arms')
            );
            continue;
          }

          case BUCKET_HASH.CHEST_ARMOR: {
            character.armor.chest.push(
              await buildDestinyArmor(itemComponents, item, character.class, 'chest')
            );
            continue;
          }

          case BUCKET_HASH.LEG_ARMOR: {
            character.armor.legs.push(
              await buildDestinyArmor(itemComponents, item, character.class, 'legs')
            );
            continue;
          }

          case BUCKET_HASH.CLASS_ARMOR: {
            character.armor.classItem.push(
              await buildDestinyArmor(itemComponents, item, character.class, 'class')
            );
            continue;
          }
        }
      }

      // iterate character's armor plug sets
      for (const plug of plugSets[PLUG_SET.HELMET_PLUGS]) {
        await db.manifestArmorModDef
          .where('hash')
          .equals(plug.plugItemHash)
          .modify({ isOwned: true });
      }

      for (const plug of plugSets[PLUG_SET.ARM_PLUGS]) {
        await db.manifestArmorModDef
          .where('hash')
          .equals(plug.plugItemHash)
          .modify({ isOwned: true });
      }

      for (const plug of plugSets[PLUG_SET.CHEST_PLUGS]) {
        await db.manifestArmorModDef
          .where('hash')
          .equals(plug.plugItemHash)
          .modify({ isOwned: true });
      }

      for (const plug of plugSets[PLUG_SET.LEG_PLUGS]) {
        await db.manifestArmorModDef
          .where('hash')
          .equals(plug.plugItemHash)
          .modify({ isOwned: true });
      }

      for (const plug of plugSets[PLUG_SET.CLASS_ITEM_PLUGS]) {
        await db.manifestArmorModDef
          .where('hash')
          .equals(plug.plugItemHash)
          .modify({ isOwned: true });
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
          .where('hash')
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
          if (destinyArmor.exotic) {
            switch (destinyArmor.type) {
              case 'helmet': {
                character.exotics.helmet.push(destinyArmor);
                character.armor.helmet.push(destinyArmor);
                continue;
              }
              case 'arms': {
                character.exotics.arms.push(destinyArmor);
                character.armor.arms.push(destinyArmor);
                continue;
              }
              case 'chest': {
                character.exotics.chest.push(destinyArmor);
                character.armor.chest.push(destinyArmor);
                continue;
              }
              case 'legs': {
                character.exotics.legs.push(destinyArmor);
                character.armor.legs.push(destinyArmor);
                continue;
              }
              case 'class': {
                character.exotics.classItem.push(destinyArmor);
                character.armor.classItem.push(destinyArmor);
                continue;
              }
            }
          } else {
            switch (destinyArmor.type) {
              case 'helmet': {
                character.armor.helmet.push(destinyArmor);
                continue;
              }
              case 'arms': {
                character.armor.arms.push(destinyArmor);
                continue;
              }
              case 'chest': {
                character.armor.chest.push(destinyArmor);
                continue;
              }
              case 'legs': {
                character.armor.legs.push(destinyArmor);
                continue;
              }
              case 'class': {
                character.armor.classItem.push(destinyArmor);
                continue;
              }
            }
          }
        }
      }
    }

    // iterate profile plugs
    let abilityPlugSets: number[] = [
      SUBCLASS_PLUG_SETS.FRAGMENTS.ARC,
      SUBCLASS_PLUG_SETS.FRAGMENTS.SOLAR,
      SUBCLASS_PLUG_SETS.FRAGMENTS.VOID,
      SUBCLASS_PLUG_SETS.FRAGMENTS.STASIS,
      SUBCLASS_PLUG_SETS.FRAGMENTS.STRAND,
      SUBCLASS_PLUG_SETS.FRAGMENTS.PRISMATIC,

      SUBCLASS_PLUG_SETS.GRENADES.ARC,
      SUBCLASS_PLUG_SETS.GRENADES.SOLAR,
      SUBCLASS_PLUG_SETS.GRENADES.VOID,
      SUBCLASS_PLUG_SETS.GRENADES.STASIS,
      SUBCLASS_PLUG_SETS.GRENADES.STRAND,
      SUBCLASS_PLUG_SETS.GRENADES.PRISMATIC_HUNTER,
      SUBCLASS_PLUG_SETS.GRENADES.PRISMATIC_WARLOCK,

      SUBCLASS_PLUG_SETS.ASPECTS.HUNTER.ARC,
      SUBCLASS_PLUG_SETS.ASPECTS.HUNTER.VOID,
      SUBCLASS_PLUG_SETS.ASPECTS.HUNTER.SOLAR,
      SUBCLASS_PLUG_SETS.ASPECTS.HUNTER.PRISMATIC,

      SUBCLASS_PLUG_SETS.ASPECTS.TITAN.ARC,
      SUBCLASS_PLUG_SETS.ASPECTS.TITAN.VOID,
      SUBCLASS_PLUG_SETS.ASPECTS.TITAN.SOLAR,

      SUBCLASS_PLUG_SETS.ASPECTS.WARLOCK.ARC,
      SUBCLASS_PLUG_SETS.ASPECTS.WARLOCK.VOID,
      SUBCLASS_PLUG_SETS.ASPECTS.WARLOCK.SOLAR,
      SUBCLASS_PLUG_SETS.ASPECTS.WARLOCK.STASIS,
      SUBCLASS_PLUG_SETS.ASPECTS.WARLOCK.STRAND,
      SUBCLASS_PLUG_SETS.ASPECTS.WARLOCK.PRISMATIC,

      SUBCLASS_PLUG_SETS.SUPERS.HUNTER.ARC,
      SUBCLASS_PLUG_SETS.SUPERS.HUNTER.VOID,
      SUBCLASS_PLUG_SETS.SUPERS.HUNTER.SOLAR,
      SUBCLASS_PLUG_SETS.SUPERS.HUNTER.PRISMATIC,

      SUBCLASS_PLUG_SETS.SUPERS.TITAN.ARC,
      SUBCLASS_PLUG_SETS.SUPERS.TITAN.VOID,
      SUBCLASS_PLUG_SETS.SUPERS.TITAN.SOLAR,

      SUBCLASS_PLUG_SETS.SUPERS.WARLOCK.ARC,
      SUBCLASS_PLUG_SETS.SUPERS.WARLOCK.VOID,
      SUBCLASS_PLUG_SETS.SUPERS.WARLOCK.SOLAR,
      SUBCLASS_PLUG_SETS.SUPERS.WARLOCK.STASIS,
      SUBCLASS_PLUG_SETS.SUPERS.WARLOCK.STRAND,
      SUBCLASS_PLUG_SETS.SUPERS.WARLOCK.PRISMATIC,

      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.HUNTER.ARC,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.HUNTER.VOID,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.HUNTER.SOLAR,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.HUNTER.PRISMATIC,

      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.TITAN.ARC,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.TITAN.VOID,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.TITAN.SOLAR,

      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.WARLOCK.ARC,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.WARLOCK.VOID,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.WARLOCK.SOLAR,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.WARLOCK.STASIS,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.WARLOCK.STRAND,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.WARLOCK.PRISMATIC,
    ];

    for (const key of abilityPlugSets) {
      for (const plug of profilePlugSets[key]) {
        if (plug.enabled) {
          await db.manifestSubclassModDef
            .where('hash')
            .equals(plug.plugItemHash)
            .modify({ isOwned: true });
        }
      }
    }

    // iterate character collectibles
    // use any character's collectibles since it shares
    const characterCollectibles =
      response.data.Response.characterCollectibles.data[profile.characters[0].id].collectibles;
    for (const collectible in characterCollectibles) {
      const exoticCollectable = await db.manifestExoticArmorCollection
        .where('hash')
        .equals(Number(collectible))
        .first();

      // TODO: use enums here
      if (
        (exoticCollectable && characterCollectibles[collectible].state === 80) ||
        (exoticCollectable && characterCollectibles[collectible].state === 0) ||
        (exoticCollectable && characterCollectibles[collectible].state === 64) ||
        (exoticCollectable && characterCollectibles[collectible].state === 16)
      ) {
        db.manifestExoticArmorCollection
          .where('hash')
          .equals(Number(collectible))
          .modify({ isOwned: true });
      }
    }
  } else {
    console.log('Could not get response');
  }

  return profile;
}

async function buildDestinyArmor(
  itemComponents: any,
  item: any,
  characterClass: CharacterClass,
  armorSlot: string
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
    .where('hash')
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
