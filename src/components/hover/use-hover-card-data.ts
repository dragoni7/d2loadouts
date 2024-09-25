// src/hooks/useHoverCardData.ts

import { db } from '@/store/db';
import { ManifestSubclass, ManifestAspect, ManifestStatPlug, ManifestPlug, ManifestArmorMod, ManifestArmorStatMod } from '@/types/manifest-types';
import { useState, useEffect } from 'react';


type HoverCardItem =
  | ManifestSubclass
  | ManifestAspect
  | ManifestStatPlug
  | ManifestPlug
  | ManifestArmorMod
  | ManifestArmorStatMod
  | undefined
  | null;

export const useHoverCardData = (item: HoverCardItem) => {
  const [hoverData, setHoverData] = useState<any | null>(null);

  useEffect(() => {
    async function getItemData() {
      if (!item) {
        setHoverData(null);
        return;
      }

      const itemHash = item.itemHash;

      try {
        let fullData;

        fullData = await db.manifestSubclass.where('itemHash').equals(itemHash).first();
        if (fullData) {
          setHoverData({ ...fullData, type: 'subclass' });
          return;
        }

        fullData = await db.manifestSubclassAspectsDef.where('itemHash').equals(itemHash).first();
        if (fullData) {
          setHoverData({ ...fullData, type: 'aspect' });
          return;
        }

        fullData = await db.manifestSubclassFragmentsDef.where('itemHash').equals(itemHash).first();
        if (fullData) {
          const sandboxPerk = await db.manifestSandboxPerkDef
            .where('name')
            .equals(fullData.name)
            .first();
          setHoverData({
            ...fullData,
            type: 'fragment',
            description: sandboxPerk ? sandboxPerk.description : 'No description available',
          });
          return;
        }

        fullData = await db.manifestSubclassModDef.where('itemHash').equals(itemHash).first();
        if (fullData) {
          setHoverData({ ...fullData, type: 'ability' });
          return;
        }

        fullData = await db.manifestArmorModDef.where('itemHash').equals(itemHash).first();
        if (fullData) {
          const sandboxPerk =
            fullData.perks && fullData.perks.length > 0
              ? await db.manifestSandboxPerkDef.where('itemHash').equals(fullData.perks[0]).first()
              : null;
          setHoverData({
            ...fullData,
            type: 'armorMod',
            description: sandboxPerk ? sandboxPerk.description : 'No description available',
          });
          return;
        }

        fullData = await db.manifestArmorStatModDef.where('itemHash').equals(itemHash).first();
        if (fullData) {
          const sandboxPerk =
            fullData.perks && fullData.perks.length > 0
              ? await db.manifestSandboxPerkDef.where('itemHash').equals(fullData.perks[0]).first()
              : null;
          setHoverData({
            ...fullData,
            type: 'armorStatMod',
            description: sandboxPerk ? sandboxPerk.description : 'No description available',
          });
          return;
        }

        setHoverData(null);
      } catch (error) {
        console.error('Error fetching item data:', error);
        setHoverData(null);
      }
    }

    getItemData();
  }, [item]);

  return hoverData;
};