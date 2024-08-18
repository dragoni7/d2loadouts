import {
  equipItemRequest,
  insertSocketPlugFreeRequest,
  snapShotLoadoutRequest,
} from '../../lib/bungie_api/Requests';
import { store } from '../../store';
import { DestinyArmor, Loadout } from '../../types';

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

export async function equipLoadout(loadout: Loadout) {
  await handleSubclass(loadout);
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
