import { db } from '../../store/db';
import {
  ARMOR,
  ARMOR_ARRAY,
  EMPTY_SOCKETS,
  PLUG_CATEGORY_HASH,
} from '../../lib/bungie_api/constants';
import { store } from '../../store';
import { ManifestArmorMod, ManifestArmorStatMod } from '../../types/manifest-types';
import { armorMods } from '../../types/d2l-types';
import { Dispatch, UnknownAction } from 'redux';
import { updateLoadoutArmorMods } from '../../store/LoadoutReducer';

export async function getModsBySlot(slot: string): Promise<ManifestArmorMod[]> {
  const slotMods = await db.manifestArmorModDef
    .where('category')
    .equals(
      slot === ARMOR.HELMET
        ? PLUG_CATEGORY_HASH.ARMOR_MODS.HELMET_MODS
        : slot === ARMOR.GAUNTLETS
        ? PLUG_CATEGORY_HASH.ARMOR_MODS.GAUNTLETS_MODS
        : slot === ARMOR.CHEST_ARMOR
        ? PLUG_CATEGORY_HASH.ARMOR_MODS.CHEST_ARMOR_MODS
        : slot === ARMOR.LEG_ARMOR
        ? PLUG_CATEGORY_HASH.ARMOR_MODS.LEG_ARMOR_MODS
        : slot === ARMOR.CLASS_ARMOR
        ? PLUG_CATEGORY_HASH.ARMOR_MODS.CLASS_ARMOR_MODS
        : 0
    )
    .toArray();

  return slotMods;
}

export function getSelectedModsBySlot(slot: string): (ManifestArmorMod | ManifestArmorStatMod)[] {
  switch (slot) {
    case ARMOR.HELMET: {
      return store.getState().loadoutConfig.loadout.helmetMods;
    }
    case ARMOR.GAUNTLETS: {
      return store.getState().loadoutConfig.loadout.gauntletsMods;
    }
    case ARMOR.CHEST_ARMOR: {
      return store.getState().loadoutConfig.loadout.chestArmorMods;
    }
    case ARMOR.LEG_ARMOR: {
      return store.getState().loadoutConfig.loadout.legArmorMods;
    }
    case ARMOR.CLASS_ARMOR: {
      return store.getState().loadoutConfig.loadout.classArmorMods;
    }
    default: {
      return [];
    }
  }
}

export function autoEquipStatMod(
  mod: ManifestArmorStatMod,
  dispatch: Dispatch<UnknownAction>
): boolean {
  const slot = mod.category === PLUG_CATEGORY_HASH.ARMOR_MODS.ARTIFICE_ARMOR_MODS ? 4 : 0;

  for (const armor of ARMOR_ARRAY) {
    if (slot === 4 && store.getState().loadoutConfig.loadout[armor].artifice === false) continue;

    const armorMod = (armor + 'Mods') as armorMods;

    const mods = store.getState().loadoutConfig.loadout[armorMod];

    if (mods[slot].itemHash === EMPTY_SOCKETS.HELMET[slot].itemHash) {
      dispatch(
        updateLoadoutArmorMods({
          armorType: armor,
          slot: slot,
          plug: mod,
        })
      );
      return true;
    }
  }

  return false;
}
