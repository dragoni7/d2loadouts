import { _get } from "../../lib/bungie_api/BungieApiClient";
import { getTokens } from "../../lib/bungie_api/TokensStore";

export interface DestinyCharacter {
  membershipId: string;
  membershipType: number;
  characterId: string;
  dateLastPlayed: string;
  classType: number;
  classHash: number;
  emblemPath: string;
  emblemHash: number;
  emblemBackgroundPath: string;
}

export function getProfile(destinyMembershipId: string) {
  const accessToken = getTokens()?.accessToken;

  _get(
    `/Platform/Destiny2/1/Profile/${destinyMembershipId}/?components=102,200`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}}`,
      },
    }
  ).then((response) => {
    if (response.data.Response) {
      var characters = response.data.Response.characters.data;
      for (const key in characters) {
        const character: DestinyCharacter = {
          membershipId: characters[key].membershipId,
          membershipType: characters[key].membershipType,
          characterId: characters[key].characterId,
          dateLastPlayed: characters[key].dateLastPlayed,
          classType: characters[key].classType,
          classHash: characters[key].classHash,
          emblemPath: characters[key].emblemPath,
          emblemHash: characters[key].emblemHash,
          emblemBackgroundPath: characters[key].emblemBackgroundPath,
        };
      }

      return true;
    } else {
      console.log("Could not get response");
      return false;
    }
  });
}
