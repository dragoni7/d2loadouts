import { db } from '../../store/db';
import { PLUG_CATEGORY_HASH } from '../../lib/bungie_api/constants';
import { store } from '../../store';
import { ManifestArmorMod, ManifestArmorStatMod } from '../../types/manifest-types';

export async function getModsBySlot(slot: string): Promise<ManifestArmorMod[]> {
  const slotMods = await db.manifestArmorModDef
    .where('category')
    .equals(
      slot === 'helmet'
        ? PLUG_CATEGORY_HASH.ARMOR_MODS.HELMET_MODS
        : slot === 'arms'
        ? PLUG_CATEGORY_HASH.ARMOR_MODS.GAUNTLETS_MODS
        : slot === 'chest'
        ? PLUG_CATEGORY_HASH.ARMOR_MODS.CHEST_ARMOR_MODS
        : slot === 'legs'
        ? PLUG_CATEGORY_HASH.ARMOR_MODS.LEG_ARMOR_MODS
        : slot === 'class'
        ? PLUG_CATEGORY_HASH.ARMOR_MODS.CLASS_ARMOR_MODS
        : 0
    )
    .toArray();

  return slotMods;
}

export function getSelectedModsBySlot(slot: string): (ManifestArmorMod | ManifestArmorStatMod)[] {
  switch (slot) {
    case 'helmet': {
      return store.getState().loadoutConfig.loadout.helmetMods;
    }
    case 'arms': {
      return store.getState().loadoutConfig.loadout.gauntletMods;
    }
    case 'chest': {
      return store.getState().loadoutConfig.loadout.chestArmorMods;
    }
    case 'legs': {
      return store.getState().loadoutConfig.loadout.legArmorMods;
    }
    case 'class': {
      return store.getState().loadoutConfig.loadout.classArmorMods;
    }
    default: {
      return [];
    }
  }
}
