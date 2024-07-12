import { _get } from "../../lib/bungie_api/BungieApiClient";
import { getTokens } from "../../lib/bungie_api/TokensStore";

export interface DestinyArmor {
  intellect: number;
  discipline: number;
  resilience: number;
  mobility: number;
  strength: number;
  recovery: number;
  instanceHash?: string;
  itemHash?: string;
  artifice?: boolean;
  masterwork?: boolean;
  exotic?: boolean;
  class?: string;
  type?: string;
  socket?: string;
}
const modRemoveValue:{ [key: string]: (armor: DestinyArmor) => void }= {
  '2724608735': (armor:DestinyArmor) => armor.intellect = armor.intellect - 10,
  '3897511453': (armor:DestinyArmor) => armor.intellect = armor.intellect - 5,
  '3160845295': (armor:DestinyArmor) => armor.intellect = armor.intellect - 3,
  '1180408010': (armor:DestinyArmor) => armor.resilience = armor.resilience - 10,
  '2532323436': (armor:DestinyArmor) => armor.resilience = armor.resilience - 5,
  '199176566': (armor:DestinyArmor) => armor.resilience = armor.resilience - 3,
  '1435557120': (armor:DestinyArmor) => armor.discipline = armor.discipline - 10,
  '4021790309': (armor:DestinyArmor) => armor.discipline = armor.discipline - 5,
  '617569843': (armor:DestinyArmor) => armor.discipline = armor.discipline - 3,
  '204488676': (armor:DestinyArmor) => armor.recovery = armor.recovery - 10,
  '1237786518': (armor:DestinyArmor) => armor.recovery = armor.recovery - 5,
  '539459624': (armor:DestinyArmor) => armor.recovery = armor.recovery - 3,
  '183296050': (armor:DestinyArmor) => armor.mobility = armor.mobility - 10,
  '1703647492': (armor:DestinyArmor) => armor.mobility = armor.mobility - 5,
  '2322202118': (armor:DestinyArmor) => armor.mobility = armor.mobility - 3,
  '287799666': (armor:DestinyArmor) => armor.strength = armor.strength - 10,
  '2639422088': (armor:DestinyArmor) => armor.strength = armor.strength - 5,
  '2507624050': (armor:DestinyArmor) => armor.strength = armor.strength - 3,
}
const IS_ARMOR = 3897883278;
const INTELLECT = 144602215;
const RESILIENCE = 392767087;
const DISCIPLINE = 1735777505;
const RECOVERY = 1943323491;
const MOBILITY = 2996146975;
const STRENGTH = 4244567218;

const HELMET = 3448274439;
const ARMS = 3551918588;
const CHEST = 14239492;
const LEG = 20886954;
const CLASS = 1585787867;

const ARTIFICE_ARMOR = 3727270518;



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

    const destinyArmors:DestinyArmor[]= [];
    for (const hash of armorHashes) {
      if (responseData.stats.data.hasOwnProperty(hash)) {
        const stats = responseData.stats.data[hash].stats;
        const statKeys = Object.keys(stats);
        const destinyArmor:DestinyArmor= {
            intellect: stats[144602215]?.value || 0,
            discipline: stats[1735777505]?.value || 0,
            resilience: stats[392767087]?.value || 0,
            mobility: stats[2996146975]?.value || 0,
            strength: stats[4244567218]?.value || 0,
            recovery: stats[1943323491]?.value || 0,
            instanceHash: hash,
          };
        if(responseData.sockets.data[hash].sockets){
          for(const key in modRemoveValue){

            if(responseData.sockets.data[hash].sockets.some((mod:any) => mod.plugHash === parseInt(key))){
              modRemoveValue[key](destinyArmor)
            }
        }  
        if(responseData.sockets.data[hash].sockets.some((mod:any) => mod.plugHash === ARTIFICE_ARMOR)){
          destinyArmor.artifice = true;
        }
        else{
          destinyArmor.artifice = false;
        }
        destinyArmors.push(destinyArmor);
      }
      }  
    }
    console.log(destinyArmors)
  } else {
    console.log("Could not get response");
  }
}
