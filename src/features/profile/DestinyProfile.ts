import {
  PRIMARY_STATS,
  SOCKET_HASH,
  STAT_HASH,
} from "../../lib/bungie_api/Constants";
import { getProfileDataRequest } from "../../lib/bungie_api/Requests";
import { db } from "../../store/db";
import { DestinyArmor } from "../../types";
import { modReverseDict } from "./util";

export async function getProfileArmor(): Promise<DestinyArmor[]> {
  const destinyArmors: DestinyArmor[] = [];

  const response = await getProfileDataRequest();

  if (response.data.Response) {
    const itemComponents = response.data.Response.itemComponents;
    const profileInventory = response.data.Response.profileInventory.data.items;
    const characterInventories =
      response.data.Response.characterInventories.data;
    const characterEquipment = response.data.Response.characterEquipment.data;

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
            masterwork:
              currentInstance?.energy &&
              currentInstance.energy.energyCapacity === 10,
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
            destinyArmor.artifice = itemComponents.sockets.data[
              instanceHash
            ].sockets.some(
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
                    break;
                  }
                }
              }
            }

            // get item instance's manifest def
            const armorDef = await db.manifestArmorDef
              .where("hash")
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
    console.log("Could not get response");
  }

  return destinyArmors;
}
