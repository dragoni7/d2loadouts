import { BUCKET_HASH, ERRORS, ITEM_LOCATIONS } from '../../lib/bungie_api/Constants';
import {
  equipItemRequest,
  getCharacterInventoryRequest,
  transferItemRequest,
} from '../../lib/bungie_api/Requests';
import { Loadout } from '../../types';

export async function equipLoadout(loadout: Loadout) {
  // determine armor inventory space

  const response = await getCharacterInventoryRequest(loadout.characterId);

  let inventorySlots: { [key: string]: any[] } = {
    helmet: [],
    arms: [],
    chest: [],
    legs: [],
    class: [],
  };

  if (response.data.Response) {
    const items = response.data.Response.inventory.data.items;

    for (const item of items) {
      // get armor slot counts
      switch (item.bucketHash) {
        case BUCKET_HASH.HELMET: {
          inventorySlots['helmet'].push(item);
          continue;
        }
        case BUCKET_HASH.CHEST_ARMOR: {
          inventorySlots['chest'].push(item);
          continue;
        }
        case BUCKET_HASH.GAUNTLETS: {
          inventorySlots['arms'].push(item);
          continue;
        }
        case BUCKET_HASH.LEG_ARMOR: {
          inventorySlots['legs'].push(item);
          continue;
        }
        case BUCKET_HASH.CLASS_ARMOR: {
          inventorySlots['class'].push(item);
          continue;
        }
        default: {
          continue;
        }
      }
    }
  }

  // armor
  loadout.armor.forEach(async (armor) => {
    // if armor not in character inventory, transfer first
    if (armor.location !== ITEM_LOCATIONS.CHARACTER_INVENTORY) {
      // inventory doesn't have space, transfer last item out first
      if (inventorySlots[armor.type].length === 9) {
        let toVault = inventorySlots[armor.type].at(-1);
        await transferItemRequest(
          Number(toVault.itemHash),
          1,
          true,
          toVault.itemInstanceId,
          loadout.characterId
        );
      }

      // transfer item to inventory
      await transferItemRequest(
        Number(armor.itemHash),
        1,
        false,
        armor.instanceHash,
        loadout.characterId
      );
    }

    // equip
    await equipItemRequest(armor.instanceHash, loadout.characterId);
  });
}
