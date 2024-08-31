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
import { updateLoadoutArmorMods, updateRequiredStatMods } from '../../store/LoadoutReducer';

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

      const newRequired = [...store.getState().loadoutConfig.loadout.requiredStatMods];
      const idx = newRequired.findIndex((required) => required.mod === mod);
      newRequired[idx] = { mod: newRequired[idx].mod, equipped: true };

      dispatch(updateRequiredStatMods(newRequired));
      return true;
    }
  }

  return false;
}
