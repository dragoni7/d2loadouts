import { useEffect, useState } from 'react';
import { ManifestArmorStatMod } from '../../../types/manifest-types';
import { PLUG_CATEGORY_HASH } from '../../../lib/bungie_api/constants';
import { db } from '../../../store/db';

export default function useStatMods() {
  const [statMods, setStatMods] = useState<ManifestArmorStatMod[]>([]);

  useEffect(() => {
    const gatherMods = async () => {
      const dbStatMods = await db.manifestArmorStatModDef
        .where('category')
        .equals(PLUG_CATEGORY_HASH.ARMOR_MODS.STAT_ARMOR_MODS)
        .toArray();

      setStatMods(
        dbStatMods.sort((a, b) =>
          a.name.localeCompare('Empty Mod Socket') === 0
            ? -1
            : b.name.localeCompare('Empty Mod Socket') === 0
            ? 1
            : a.name.localeCompare(b.name)
        )
      );
    };
    gatherMods().catch(console.error);
  }, []);

  return statMods;
}
