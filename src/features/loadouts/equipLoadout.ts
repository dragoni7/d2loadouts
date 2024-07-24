import axios, { AxiosError } from 'axios';
import { ERRORS, ITEM_LOCATIONS } from '../../lib/bungie_api/Constants';
import { equipItemRequest, transferItemRequest } from '../../lib/bungie_api/Requests';
import { Loadout } from '../../types';

export function equipLoadout(loadout: Loadout, fallback: boolean) {
  // armor
  loadout.armor.forEach(async (armor) => {
    try {
      await equipItemRequest(armor.instanceHash, loadout.characterId);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        // if character is not in equippable area, transfer items to character inventory.
        const equipResponse = error.response.data;
        if (fallback && equipResponse.ErrorCode === ERRORS.INVALID_EQUIP_LOCATION) {
          console.log(equipResponse.Message);
          // only transfer if item is not already in character inventory / equipped
          if (armor.location === ITEM_LOCATIONS.VAULT) {
            // transfer loadout items to character inventory
            await transferItemRequest(
              Number(armor.itemHash),
              1,
              false,
              armor.instanceHash,
              loadout.characterId
            );
          }
        }
      }
    }
  });
}
