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
    `/Platform/Destiny2/1/Profile/${destinyMembershipId}/?components=102,201,300,205,302,304,305`,
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

    for (const key in responseData.stats.data) {
    }

    for (const key in responseData.sockets.data) {
    }

    for (const key in responseData.perks.data) {
    }
  } else {
    console.log("Could not get response");
  }
}
