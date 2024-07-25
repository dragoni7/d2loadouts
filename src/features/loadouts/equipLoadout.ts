import { BUCKET_HASH, ITEM_LOCATIONS } from '../../lib/bungie_api/Constants';
import {
  equipItemRequest,
  getCharacterInventoryRequest,
  insertSocketPlugFreeRequest,
  transferItemRequest,
} from '../../lib/bungie_api/Requests';
import { store } from '../../store';
import { Loadout } from '../../types';

export async function loadoutTest() {
  let loadout: Loadout = {
    armor: [],
    characterId: store.getState().profile.characters[0].id,
    subclass: {
      itemId: '6917530019218633578',
      super: {
        plugItemHash: '1869939005', // song of flame
        socketArrayType: 0,
        socketIndex: 0,
      },
      abilities: [
        {
          plugItemHash: '1444664836', // phoenix dive
          socketArrayType: 0,
          socketIndex: 1,
        },
        {
          plugItemHash: '5333292', // strafe glide
          socketArrayType: 0,
          socketIndex: 2,
        },
        {
          plugItemHash: '3644045871', // arcane needle
          socketArrayType: 0,
          socketIndex: 3,
        },
        {
          plugItemHash: '4241856103', // storm grenade
          socketArrayType: 0,
          socketIndex: 4,
        },
      ],
      aspects: [
        {
          plugItemHash: '790664814', // hellion
          socketArrayType: 0,
          socketIndex: 7,
        },
        {
          plugItemHash: '790664815', // feed the void
          socketArrayType: 0,
          socketIndex: 8,
        },
      ],
      fragments: [
        {
          plugItemHash: '2626922121', // facet of grace
          socketArrayType: 0,
          socketIndex: 9,
        },
      ],
    },
  };
  await equipLoadout(loadout);
}

export async function equipLoadout(loadout: Loadout) {
  //await handleArmor(loadout);
  await handleSubclass(loadout);
}

async function handleArmor(loadout: Loadout) {
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

async function handleSubclass(loadout: Loadout) {
  var subclassId = loadout.subclass.itemId;
  var characterId = loadout.characterId;

  // insert super
  await insertSocketPlugFreeRequest(subclassId, loadout.subclass.super, characterId);

  // insert abilities
  loadout.subclass.abilities.forEach(async (ability) => {
    await insertSocketPlugFreeRequest(subclassId, ability, characterId);
  });

  // insert fragments & aspects
  await insertSocketPlugFreeRequest(subclassId, loadout.subclass.aspects[0], characterId);
  await insertSocketPlugFreeRequest(subclassId, loadout.subclass.aspects[1], characterId);

  loadout.subclass.fragments.forEach(async (fragment) => {
    await insertSocketPlugFreeRequest(subclassId, fragment, characterId);
  });

  // equip subclass
  await equipItemRequest(subclassId, characterId);
}
