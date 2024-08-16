import { BUCKET_HASH, ITEM_LOCATIONS } from '../../lib/bungie_api/Constants';
import {
  equipItemRequest,
  getCharacterInventoryRequest,
  insertSocketPlugFreeRequest,
  snapShotLoadoutRequest,
  transferItemRequest,
} from '../../lib/bungie_api/Requests';
import { store } from '../../store';
import { DestinyArmor, Loadout } from '../../types';
import { STATUS } from './constants';
import { EquipResult } from './types';

export async function loadoutTest() {
  let loadout: Loadout = {
    characterId: store.getState().profile.profileData.characters[0].id,
    subclass: {
      itemId: '6917530019218633578',
      damageType: 1,
      super: {
        plugItemHash: '1869939005', // song of flame
        socketArrayType: 0,
        socketIndex: 0,
      },
      classAbility: {
        plugItemHash: '1444664836', // phoenix dive
        socketArrayType: 0,
        socketIndex: 1,
      },
      movementAbility: {
        plugItemHash: '5333292', // strafe glide
        socketArrayType: 0,
        socketIndex: 2,
      },
      meleeAbility: {
        plugItemHash: '3644045871', // arcane needle
        socketArrayType: 0,
        socketIndex: 3,
      },
      grenade: {
        plugItemHash: '4241856103', // storm grenade
        socketArrayType: 0,
        socketIndex: 4,
      },
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
    helmet: store
      .getState()
      .profile.profileData.characters[0].armor.helmet.find(
        (a) => a.instanceHash === '6917530019848092198'
      ) as DestinyArmor,
    gauntlets: store
      .getState()
      .profile.profileData.characters[0].armor.arms.find(
        (a) => a.instanceHash === '6917529814662006519'
      ) as DestinyArmor,
    chestArmor: store
      .getState()
      .profile.profileData.characters[0].armor.chest.find(
        (a) => a.instanceHash === '6917529901137607811'
      ) as DestinyArmor,
    legArmor: store
      .getState()
      .profile.profileData.characters[0].armor.legs.find(
        (a) => a.instanceHash === '6917530035321702679'
      ) as DestinyArmor,
    classArmor: store
      .getState()
      .profile.profileData.characters[0].armor.classItem.find(
        (a) => a.instanceHash === '6917529546691296363'
      ) as DestinyArmor,
    helmetMods: {
      0: {
        plugItemHash: '1435557120',
        socketArrayType: 0,
        socketIndex: 0,
      },
    },
    gauntletMods: {
      0: {
        plugItemHash: '1435557120',
        socketArrayType: 0,
        socketIndex: 0,
      },
    },
    chestArmorMods: {
      0: {
        plugItemHash: '1435557120',
        socketArrayType: 0,
        socketIndex: 0,
      },
    },
    legArmorMods: {
      0: {
        plugItemHash: '1435557120',
        socketArrayType: 0,
        socketIndex: 0,
      },
    },
    classArmorMods: {
      0: {
        plugItemHash: '1435557120',
        socketArrayType: 0,
        socketIndex: 0,
      },
    },
    requiredStatMods: [],
  };
  await equipLoadout(loadout);
}

export async function equipLoadout(loadout: Loadout): Promise<EquipResult[]> {
  const result = await handleArmor(loadout);
  //await handleSubclass(loadout);

  return result;
}

export async function createInGameLoadout(
  characterId: string,
  colorHash: number,
  iconHash: number,
  loadoutIndex: number,
  nameHash: number
) {
  await snapShotLoadoutRequest(characterId, colorHash, iconHash, loadoutIndex, nameHash);
}

async function handleArmor(loadout: Loadout): Promise<EquipResult[]> {
  const results: EquipResult[] = [
    {
      status: STATUS.SUCCESS,
      errors: ['', '', '', '', 'NA'],
      subject: loadout.helmet,
      icon: loadout.helmet.icon,
    },
    {
      status: STATUS.SUCCESS,
      errors: ['', '', '', '', 'NA'],
      subject: loadout.gauntlets,
      icon: loadout.gauntlets.icon,
    },
    {
      status: STATUS.SUCCESS,
      errors: ['', '', '', '', 'NA'],
      subject: loadout.chestArmor,
      icon: loadout.chestArmor.icon,
    },
    {
      status: STATUS.SUCCESS,
      errors: ['', '', '', '', 'NA'],
      subject: loadout.legArmor,
      icon: loadout.legArmor.icon,
    },
  ];
  // determine armor inventory space
  const characterId = loadout.characterId;
  const response = await getCharacterInventoryRequest(characterId);

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

  // insert mods in armor

  for (let i = 0; i < 5; i++) {
    if (i === 4) {
      if (loadout.helmet.artifice === false) continue;

      if (loadout.gauntlets.artifice === false) continue;

      if (loadout.chestArmor.artifice === false) continue;

      if (loadout.legArmor.artifice === false) continue;
    }

    await insertSocketPlugFreeRequest(
      loadout.helmet.instanceHash,
      loadout.helmetMods[i],
      characterId
    ).catch((error) => {
      if (error.response) {
        results[0].status = STATUS.FAIL;
        results[0].errors[i] = error.response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');
      }
    });

    await insertSocketPlugFreeRequest(
      loadout.gauntlets.instanceHash,
      loadout.gauntletMods[i],
      characterId
    ).catch((error) => {
      if (error.response) {
        results[1].status = STATUS.FAIL;
        results[1].errors[i] = error.response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');
      }
    });

    await insertSocketPlugFreeRequest(
      loadout.chestArmor.instanceHash,
      loadout.chestArmorMods[i],
      characterId
    ).catch((error) => {
      if (error.response) {
        results[2].status = STATUS.FAIL;
        results[2].errors[i] = error.response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');
      }
    });

    await insertSocketPlugFreeRequest(
      loadout.legArmor.instanceHash,
      loadout.legArmorMods[i],
      characterId
    ).catch((error) => {
      if (error.response) {
        results[3].status = STATUS.FAIL;
        results[3].errors[i] = error.response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');
      }
    });
  }

  // armor
  //await equipArmor(loadout.helmet, characterId, inventorySlots);
  //await equipArmor(loadout.gauntlets, characterId, inventorySlots);
  //await equipArmor(loadout.chestArmor, characterId, inventorySlots);
  //await equipArmor(loadout.legArmor, characterId, inventorySlots);
  //await equipArmor(loadout.classArmor, characterId, inventorySlots);

  return results;
}

async function equipArmor(armor: DestinyArmor, characterId: number, inventorySlots: any) {
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
        characterId
      );
    }

    // transfer item to inventory
    await transferItemRequest(Number(armor.itemHash), 1, false, armor.instanceHash, characterId);
  }

  // equip
  await equipItemRequest(armor.instanceHash, characterId);
}

async function handleSubclass(loadout: Loadout) {
  var subclassId = loadout.subclass.itemId;
  var characterId = loadout.characterId;

  // equip subclass
  await equipItemRequest(subclassId, characterId);

  // insert super
  //await insertSocketPlugFreeRequest(subclassId, loadout.subclass.super, characterId);

  // insert abilities
  //await insertSocketPlugFreeRequest(subclassId, loadout.subclass.classAbility, characterId);
  //await insertSocketPlugFreeRequest(subclassId, loadout.subclass.movementAbility, characterId);
  await insertSocketPlugFreeRequest(subclassId, loadout.subclass.meleeAbility, characterId);
  await insertSocketPlugFreeRequest(subclassId, loadout.subclass.grenade, characterId);

  // insert fragments & aspects
  await insertSocketPlugFreeRequest(subclassId, loadout.subclass.aspects[0], characterId);
  await insertSocketPlugFreeRequest(subclassId, loadout.subclass.aspects[1], characterId);

  loadout.subclass.fragments.forEach(async (fragment) => {
    await insertSocketPlugFreeRequest(subclassId, fragment, characterId);
  });
}
