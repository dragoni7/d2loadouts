import { BUCKET_HASH, PRIMARY_STATS, SOCKET_HASH, STAT_HASH } from '../../lib/bungie_api/Constants';
import { getProfileDataRequest } from '../../lib/bungie_api/Requests';
import { db } from '../../store/db';
import {
  Character,
  CharacterClass,
  DestinyArmor,
  Emblem,
  ProfileData,
  Subclass,
} from '../../types';
import { getCharacterClass, modReverseDict } from './util';

export async function getProfileData(): Promise<ProfileData> {
  const characters: Character[] = [];

  const response = await getProfileDataRequest();

  if (response.data.Response) {
    const itemComponents = response.data.Response.itemComponents;
    const profileInventory = response.data.Response.profileInventory.data.items;
    const characterInventories = response.data.Response.characterInventories.data;
    const characterEquipment = response.data.Response.characterEquipment.data;
    const characterData = response.data.Response.characters.data;

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
        exotics: {
          helmet: [],
          arms: [],
          legs: [],
          chest: [],
          classItem: [],
        },
        subclasses: {},
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
            const subclassDef = await db.manifestSubclass
              .where('hash')
              .equals(item.itemHash)
              .first();

            if (subclassDef) {
              const subclass: Subclass = {
                instanceId: item.itemInstanceId,
                itemHash: item.itemHash,
                supers: [],
                aspects: [],
              };

              // insert subclass into character's subclasses dict

              character.subclasses[subclassDef.damageType] = subclass;
            }
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
            const subclassDef = await db.manifestSubclass
              .where('hash')
              .equals(item.itemHash)
              .first();

            if (subclassDef) {
              const subclass: Subclass = {
                instanceId: item.itemInstanceId,
                itemHash: item.itemHash,
                supers: [],
                aspects: [],
              };

              // insert subclass into character's subclasses dict

              character.subclasses[subclassDef.damageType] = subclass;
            }
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

      characters.push(character);
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
          destinyArmor.class = armorDef.characterClass as CharacterClass;
          // determine armor slot
          destinyArmor.type = armorDef.slot;
          // determine if exotic
          destinyArmor.exotic = armorDef.isExotic;
          // get name
          destinyArmor.name = armorDef.name;
          // get icon
          destinyArmor.icon = armorDef.icon;
        }

        let target = characters.filter((c) => c.class === destinyArmor.class);

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
  } else {
    console.log('Could not get response');
  }

  const profile: ProfileData = {
    characters: characters,
    unlockedArmorModPlugs: [],
  };

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
