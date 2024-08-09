import React, { useEffect, useState } from 'react';
import './ArmorCustomization.css';
import { db } from '../store/db';
import { ManifestPlug, ManifestSubclass } from '../types';
import { PLUG_CATEGORY_HASH } from '../lib/bungie_api/SubclassConstants';
import ArmorMods from './ArmorMods';
import ModCategory from './ModCategory';

interface ArmorCustomizationProps {
  onBackClick: () => void;
  screenshot: string;
  subclass: ManifestSubclass;
}

const subclassTypeMap: { [key: number]: string } = {
  1: 'PRISMATIC',
  2: 'ARC',
  3: 'SOLAR',
  4: 'VOID',
  6: 'STASIS',
  7: 'STRAND',
};

const getCategoryHashes = (subclass: ManifestSubclass) => {
  const subclassType = subclassTypeMap[
    subclass.damageType
  ] as keyof typeof PLUG_CATEGORY_HASH.TITAN.ARC;
  const classType = subclass.class.toUpperCase() as 'TITAN' | 'HUNTER' | 'WARLOCK';

  // Assert that we are accessing a specific class type within PLUG_CATEGORY_HASH
  const classAndSubclass =
    (PLUG_CATEGORY_HASH[classType] as Record<string, any>)[subclassType] || {};

  const categoryHashes = {
    SUPERS: Object.values(classAndSubclass.SUPERS || []),
    CLASS_ABILITIES: Object.values(classAndSubclass.CLASS_ABILITIES || []),
    MELEE_ABILITIES: Object.values(classAndSubclass.MELEE_ABILITIES || []),
    MOVEMENT_ABILITIES: Object.values(classAndSubclass.MOVEMENT_ABILITIES || []),
    ASPECTS: Object.values(classAndSubclass.ASPECTS || []),
    GRENADES: Object.values(classAndSubclass.GRENADES || []),
    FRAGMENTS: Object.values(classAndSubclass.FRAGMENTS || []),
  };

  console.log('getCategoryHashes:', categoryHashes);
  return categoryHashes;
};

const fetchMods = async (subclass: ManifestSubclass) => {
  const categoryHashes = getCategoryHashes(subclass);
  const modsData: { [key: string]: ManifestPlug[] } = {};

  await Promise.all(
    Object.entries(categoryHashes).map(async ([key, hashes]) => {
      const typedHashes = hashes as number[]; // Cast hashes to number[]
      console.log(`Fetching mods for ${key}:`, typedHashes);
      const mods = await db.manifestSubclassModDef.where('category').anyOf(typedHashes).toArray();
      modsData[key] = Array.from(new Set(mods.map((mod) => mod.itemHash))).map((itemHash) =>
        mods.find((mod) => mod.itemHash === itemHash)
      ) as ManifestPlug[];
    })
  );

  console.log('fetchMods result:', modsData);
  return modsData;
};

const ArmorCustomization: React.FC<ArmorCustomizationProps> = ({
  onBackClick,
  screenshot,
  subclass,
}) => {
  const [mods, setMods] = useState<{ [key: string]: ManifestPlug[] }>({});

  useEffect(() => {
    if (subclass) {
      console.log('Fetching mods for subclass:', subclass);
      fetchMods(subclass).then((fetchedMods) => {
        console.log('Fetched mods:', fetchedMods);
        setMods(fetchedMods);
      });
    }
  }, [subclass]);

  console.log('Current mods state:', mods);

  return (
    <div className="armor-customization-wrapper" style={{ backgroundImage: `url(${screenshot})` }}>
      <div className="left-panel">
        <ArmorMods />
      </div>
      <div className="right-panel">
        <button className="back-button" onClick={onBackClick}>
          ← Back
        </button>
        <ModCategory mods={mods.SUPERS || []} categoryName="SUPERS" slotCount={1} />
        <ModCategory mods={mods.ASPECTS || []} categoryName="ASPECTS" slotCount={2} />
        <ModCategory mods={mods.FRAGMENTS || []} categoryName="FRAGMENTS" slotCount={5} />
        <div className="other-slots">
          {['CLASS_ABILITIES', 'MELEE_ABILITIES', 'MOVEMENT_ABILITIES', 'GRENADES'].map(
            (category) => (
              <ModCategory
                key={category}
                mods={mods[category] || []}
                categoryName={category}
                slotCount={1}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ArmorCustomization;
