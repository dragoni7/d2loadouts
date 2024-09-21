import { PLUG_CATEGORY_HASH } from '@/lib/bungie_api/constants';
import { db } from '@/store/db';
import { ModsArray, StatModifiers } from '@/types/d2l-types';
import { ManifestArmorStatMod } from '@/types/manifest-types';

export async function getModsFromPermutation(
  modsArray: ModsArray
): Promise<{ mod: ManifestArmorStatMod; equipped: boolean }[]> {
  const dbStatMods = await db.manifestArmorStatModDef
    .where('category')
    .equals(PLUG_CATEGORY_HASH.ARMOR_MODS.STAT_ARMOR_MODS)
    .toArray();

  const dbArtificeMods = await db.manifestArmorStatModDef
    .where('category')
    .equals(PLUG_CATEGORY_HASH.ARMOR_MODS.ARTIFICE_ARMOR_MODS)
    .toArray();

  const mods = dbStatMods.concat(dbArtificeMods);

  let requiredMods: { mod: ManifestArmorStatMod; equipped: boolean }[] = [];

  for (const [stat, costs] of Object.entries(modsArray)) {
    for (const cost of costs) {
      const matchedStatMod = mods.find((mod) => mod[(stat + 'Mod') as StatModifiers] === cost);
      if (matchedStatMod !== undefined) {
        requiredMods.push({
          mod: structuredClone(matchedStatMod),
          equipped: false,
        });
      }
    }
  }

  return requiredMods;
}
