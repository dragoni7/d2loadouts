import {
  BUCKET_HASH,
  ITEM_LOCATIONS,
  PRIMARY_STATS,
  SOCKET_HASH,
  STAT_HASH,
} from '../../lib/bungie_api/Constants';
import { getProfileDataRequest } from '../../lib/bungie_api/Requests';
import { db } from '../../store/db';
import { Character, CharacterClass, DestinyArmor, Emblem, ProfileData } from '../../types';
import { getCharacterClass, modReverseDict } from './util';

export async function getProfileData(): Promise<ProfileData> {
  const destinyArmors: DestinyArmor[] = [];
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

      if (characterClass === null) {
        console.error(`Unknown class hash: ${characterData[key].classHash}`);
        continue;
      }

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
      };

      for (const item of characterEquipment[key].items) {
        if (item.bucketHash === BUCKET_HASH.EMBLEM) {
          const emblemDef = await db.manifestEmblemDef.where('hash').equals(item.itemHash).first();

          const emblem: Emblem = {
            secondaryOverlay: emblemDef?.secondaryOverlay,
            secondarySpecial: emblemDef?.secondarySpecial,
          };

          character.emblem = emblem;
          break;
        }
      }

      characters.push(character);
    }

    for (const instanceHash in itemComponents.instances.data) {
      const currentInstance = itemComponents.instances.data[instanceHash];
      if (
        currentInstance.primaryStat &&
        currentInstance.primaryStat.statHash === PRIMARY_STATS.DEFENSE
      ) {
        if (itemComponents.stats.data.hasOwnProperty(instanceHash)) {
          const stats = itemComponents.stats.data[instanceHash].stats;

          const destinyArmor: DestinyArmor = {
            intellect: stats[STAT_HASH.INTELLECT]?.value || 0,
            discipline: stats[STAT_HASH.DISCIPLINE]?.value || 0,
            resilience: stats[STAT_HASH.RESILIENCE]?.value || 0,
            mobility: stats[STAT_HASH.MOBILITY]?.value || 0,
            strength: stats[STAT_HASH.STRENGTH]?.value || 0,
            recovery: stats[STAT_HASH.RECOVERY]?.value || 0,
            instanceHash: instanceHash,
            masterwork: currentInstance?.energy && currentInstance.energy.energyCapacity === 10,
            itemHash: '',
            location: ITEM_LOCATIONS.VAULT,
            type: '',
            icon: '',
            name: '',
          };

          if (itemComponents.sockets.data.hasOwnProperty(instanceHash)) {
            for (const key in modReverseDict) {
              if (
                itemComponents.sockets.data[instanceHash].sockets.some(
                  (mod: any) => mod.plugHash === Number(key)
                )
              ) {
                modReverseDict[key](destinyArmor);
              }
            }

            destinyArmor.artifice = itemComponents.sockets.data[instanceHash].sockets.some(
              (mod: any) => mod.plugHash === SOCKET_HASH.ARTIFICE_ARMOR
            );

            for (const item of profileInventory) {
              if (item.itemInstanceId && item.itemInstanceId === instanceHash) {
                destinyArmor.itemHash = item.itemHash;
                break;
              }
            }

            if (!destinyArmor.itemHash) {
              for (const key in characterInventories) {
                for (const item of characterInventories[key].items) {
                  if (item.itemInstanceId === instanceHash) {
                    destinyArmor.itemHash = item.itemHash;
                    destinyArmor.location = ITEM_LOCATIONS.CHARACTER_INVENTORY;
                    break;
                  }
                }
              }
            }

            if (!destinyArmor.itemHash) {
              for (const key in characterEquipment) {
                for (const item of characterEquipment[key].items) {
                  if (item.itemInstanceId === instanceHash) {
                    destinyArmor.itemHash = item.itemHash;
                    destinyArmor.location = ITEM_LOCATIONS.CHARACTER_EQUIPMENT;
                    break;
                  }
                }
              }
            }

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

            // add armor to character of same class
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

            // TODO: add plugs
          }
        }
      }
    }
  } else {
    console.log('Could not get response');
  }

  const profile: ProfileData = {
    characters: characters,
  };

  return profile;
}
