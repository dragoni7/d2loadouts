import { _get } from "../../lib/bungie_api/BungieApiClient";
import { getTokens } from "../../store/TokensStore";
import { DestinyArmor, DestinyMembership } from "../../types";

const modReverseDict: { [key: number]: (armor: DestinyArmor) => void } = {
  2724608735: (armor: DestinyArmor) => (armor.intellect = armor.intellect - 10),
  3897511453: (armor: DestinyArmor) => (armor.intellect = armor.intellect - 5),
  3160845295: (armor: DestinyArmor) => (armor.intellect = armor.intellect - 3),
  1180408010: (armor: DestinyArmor) =>
    (armor.resilience = armor.resilience - 10),
  2532323436: (armor: DestinyArmor) =>
    (armor.resilience = armor.resilience - 5),
  199176566: (armor: DestinyArmor) => (armor.resilience = armor.resilience - 3),
  1435557120: (armor: DestinyArmor) =>
    (armor.discipline = armor.discipline - 10),
  4021790309: (armor: DestinyArmor) =>
    (armor.discipline = armor.discipline - 5),
  617569843: (armor: DestinyArmor) => (armor.discipline = armor.discipline - 3),
  204488676: (armor: DestinyArmor) => (armor.recovery = armor.recovery - 10),
  1237786518: (armor: DestinyArmor) => (armor.recovery = armor.recovery - 5),
  539459624: (armor: DestinyArmor) => (armor.recovery = armor.recovery - 3),
  183296050: (armor: DestinyArmor) => (armor.mobility = armor.mobility - 10),
  1703647492: (armor: DestinyArmor) => (armor.mobility = armor.mobility - 5),
  2322202118: (armor: DestinyArmor) => (armor.mobility = armor.mobility - 3),
  287799666: (armor: DestinyArmor) => (armor.strength = armor.strength - 10),
  2639422088: (armor: DestinyArmor) => (armor.strength = armor.strength - 5),
  2507624050: (armor: DestinyArmor) => (armor.strength = armor.strength - 3),
};
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

export async function getProfileArmor(
  destinyMembership: DestinyMembership
): Promise<DestinyArmor[]> {
  const accessToken = getTokens()?.accessToken.value;

  const destinyArmors: DestinyArmor[] = [];

  const response = await _get(
    `/Platform/Destiny2/${destinyMembership.membershipType}/Profile/${destinyMembership.membershipId}/?components=102,201,300,205,302,304,305`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.data.Response) {
    var itemComponents = response.data.Response.itemComponents;

    for (const instanceHash in itemComponents.instances.data) {
      if (
        itemComponents.instances.data[instanceHash].primaryStat &&
        itemComponents.instances.data[instanceHash].primaryStat.statHash ===
          IS_ARMOR
      ) {
        if (itemComponents.stats.data.hasOwnProperty(instanceHash)) {
          const stats = itemComponents.stats.data[instanceHash].stats;

          const destinyArmor: DestinyArmor = {
            intellect: stats[144602215]?.value || 0,
            discipline: stats[1735777505]?.value || 0,
            resilience: stats[392767087]?.value || 0,
            mobility: stats[2996146975]?.value || 0,
            strength: stats[4244567218]?.value || 0,
            recovery: stats[1943323491]?.value || 0,
            instanceHash: instanceHash,
            masterwork:
              itemComponents.instances.data[instanceHash]?.energy &&
              itemComponents.instances.data[instanceHash].energy
                .energyCapacity === 10,
          };

          if (itemComponents.sockets.data.hasOwnProperty(instanceHash)) {
            for (const key in modReverseDict) {
              if (
                itemComponents.sockets.data[instanceHash].sockets.some(
                  (mod: any) => mod.plugHash === key
                )
              ) {
                modReverseDict[key](destinyArmor);
              }
            }

            destinyArmor.artifice = itemComponents.sockets.data[
              instanceHash
            ].sockets.some((mod: any) => mod.plugHash === ARTIFICE_ARMOR);

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
