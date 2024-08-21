import { snapShotLoadoutRequest } from '../../../lib/bungie_api/requests';

export async function createInGameLoadout(
  characterId: string,
  colorHash: number,
  iconHash: number,
  loadoutIndex: number,
  nameHash: number
) {
  await snapShotLoadoutRequest(characterId, colorHash, iconHash, loadoutIndex, nameHash);
}
