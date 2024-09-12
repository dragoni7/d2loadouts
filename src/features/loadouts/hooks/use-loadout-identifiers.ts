import { useState, useEffect } from 'react';
import { db } from '../../../store/db';
import {
  ManifestLoadoutColor,
  ManifestLoadoutIcon,
  ManifestLoadoutName,
} from '../../../types/manifest-types';

export default function useLoadoutIdentifiers() {
  const [loadoutColors, setLoadoutColors] = useState<ManifestLoadoutColor[]>([]);
  const [loadoutNames, setLoadoutNames] = useState<ManifestLoadoutName[]>([]);
  const [loadoutIcons, setLoadoutIcons] = useState<ManifestLoadoutIcon[]>([]);

  useEffect(() => {
    const gatherIdentifiers = async () => {
      setLoadoutColors(await db.manifestLoadoutColorDef.toArray());
      setLoadoutIcons(await db.manifestLoadoutIconDef.toArray());
      setLoadoutNames(await db.manifestLoadoutNameDef.toArray());
    };
    gatherIdentifiers().catch(console.error);
  }, []);

  return { loadoutNames, loadoutColors, loadoutIcons };
}
