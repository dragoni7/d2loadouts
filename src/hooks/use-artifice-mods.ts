import { useState, useEffect } from 'react';
import { PLUG_CATEGORY_HASH } from '../lib/bungie_api/constants';
import { db } from '../store/db';
import { ManifestArmorStatMod } from '../types/manifest-types';

export default function useArtificeMods() {
  const [artificeMods, setArtificeMods] = useState<ManifestArmorStatMod[]>([]);

  useEffect(() => {
    const gatherMods = async () => {
      const dbArtificeMods = await db.manifestArmorStatModDef
        .where('category')
        .equals(PLUG_CATEGORY_HASH.ARMOR_MODS.ARTIFICE_ARMOR_MODS)
        .toArray();

      setArtificeMods(
        dbArtificeMods.sort((a, b) =>
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

  return artificeMods;
}
