import { _get } from "../../lib/bungie_api/BungieApiClient";
import { getTokens } from "../../lib/bungie_api/TokensStore";

export interface DestinyArmor {
  intellect: number;
  discipline: number;
  resilience: number;
  mobility: number;
  strength: number;
  recovery: number;
  instanceHash: string;
  itemHash: string;
  artifice: boolean;
  masterwork: boolean;
  exotic: boolean;
  class: string;
  type: string;
  socket: string;
}

const IS_ARMOR = 3897883278;

export async function getProfile(destinyMembershipId: string) {
  const accessToken = getTokens()?.accessToken.value;

  const response = await _get(
    `/Platform/Destiny2/2/Profile/${destinyMembershipId}/?components=102,201,300,205,302,304,305`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.data.Response) {
    var responseData = response.data.Response.itemComponents;

    var armorHashes = [];

    for (const key in responseData.instances.data) {
      if (
        responseData.instances.data[key].primaryStat !== undefined &&
        responseData.instances.data[key].primaryStat.statHash === IS_ARMOR
      ) {
        armorHashes.push(key);
      }
    }

    console.log(armorHashes);

    const destinyArmors= [];
    for (const hash of armorHashes) {
      if (responseData.stats.data.hasOwnProperty(hash)) {
        const stats = responseData.stats.data[hash].stats;
        const statKeys = Object.keys(stats);
        const destinyArmor= {
            intellect: stats[144602215]?.value || 0,
            discipline: stats[1735777505]?.value || 0,
            resilience: stats[392767087]?.value || 0,
            mobility: stats[2996146975]?.value || 0,
            strength: stats[4244567218]?.value || 0,
            recovery: stats[1943323491]?.value || 0,
            instanceHash: hash,
          };
          
          destinyArmors.push(destinyArmor);
      }
    }
    console.log(destinyArmors)

    for (const key in responseData.sockets.data) {
    }

    for (const key in responseData.perks.data) {
    }
  } else {
    console.log("Could not get response");
  }
}
