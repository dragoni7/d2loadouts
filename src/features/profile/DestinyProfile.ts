import { BUCKET_HASH, PRIMARY_STATS, SOCKET_HASH, STAT_HASH } from '../../lib/bungie_api/Constants';
import { getProfileDataRequest } from '../../lib/bungie_api/Requests';
import { db } from '../../store/db';
import { Character, DestinyArmor, Emblem, ProfileData, CharacterClass } from '../../types';
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
      };

      for (const item of characterEquipment[key].items) {
        if (item.bucketHash === BUCKET_HASH.EMBLEM) {
          const emblemDef = await db.manifestEmblemDef.where('hash').equals(item.itemHash).first();

          if (emblemDef) {
            console.log(`Fetched emblem data for hash ${item.itemHash}: ${JSON.stringify(emblemDef)}`);
          } else {
            console.log(`No emblem data found for hash ${item.itemHash}`);
          }

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
                    break;
                  }
                }
              }
            }

            const armorDef = await db.manifestArmorDef
              .where('hash')
              .equals(Number(destinyArmor.itemHash))
              .first();

            destinyArmor.class = armorDef?.characterClass;
            destinyArmor.type = armorDef?.slot;
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
