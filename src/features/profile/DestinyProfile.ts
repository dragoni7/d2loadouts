import {
  BUCKET_HASH,
  ITEM_LOCATIONS,
  PRIMARY_STATS,
  SOCKET_HASH,
  STAT_HASH,
} from '../../lib/bungie_api/Constants';
import { getProfileDataRequest } from '../../lib/bungie_api/Requests';
import { db } from '../../store/db';
import { Character, DestinyArmor, Emblem, ProfileData } from '../../types';
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

    // character
    for (const key in characterData) {
      const character: Character = {
        id: characterData[key].characterId,
        class: getCharacterClass(characterData[key].classHash),
      };

      for (const item of characterEquipment[key].items) {
        if (item.bucketHash === BUCKET_HASH.EMBLEM) {
          // get item instance's manifest def
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

    // armor
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
          };

          // undo armor mod stat increases
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

            // check if armor is artifice
            destinyArmor.artifice = itemComponents.sockets.data[instanceHash].sockets.some(
              (mod: any) => mod.plugHash === SOCKET_HASH.ARTIFICE_ARMOR
            );

            // get item instance's item hash
            // check profile inventory
            for (const item of profileInventory) {
              if (item.itemInstanceId && item.itemInstanceId === instanceHash) {
                destinyArmor.itemHash = item.itemHash;
                break;
              }
            }

            if (!destinyArmor.itemHash) {
              // also need to check character items
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
              // and equipped items
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

            // get item instance's manifest def
            const armorDef = await db.manifestArmorDef
              .where('hash')
              .equals(Number(destinyArmor.itemHash))
              .first();

            // determine required class
            destinyArmor.class = armorDef?.characterClass;
            // determine armor slot
            destinyArmor.type = armorDef?.slot;
            // determine if exotic
            destinyArmor.exotic = armorDef?.isExotic;

            destinyArmors.push(destinyArmor);
          }
        }
      }
    }
  } else {
    console.log('Could not get response');
  }

  const profile: ProfileData = {
    characters: characters,
    armor: destinyArmors,
  };

  return profile;
}
