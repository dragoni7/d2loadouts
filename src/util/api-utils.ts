import { DestinyLoadout } from '../types/d2l-types';

export function getCharacterLoadoutsFromResponse(
  loadoutResponse: any,
  characterId: number
): DestinyLoadout[] {
  const loadouts: DestinyLoadout[] = [];

  for (const loadout of loadoutResponse.data.Response.characterLoadouts.data[characterId]
    .loadouts) {
    loadouts.push({
      colorHash: loadout.colorHash,
      iconHash: loadout.iconHash,
      nameHash: loadout.nameHash,
      armor: loadout.items.slice(3, 8),
      subclass: loadout.items[8],
    });
  }

  return loadouts;
}
