import React, { useEffect, useState } from 'react';
import './ArmorCustomization.css';
import { db } from '../store/db';
import { ManifestPlug, ManifestSubclass } from '../types';
import { PLUG_CATEGORY_HASH } from '../lib/bungie_api/SubclassConstants';

interface ArmorCustomizationProps {
  onBackClick: () => void;
  screenshot: string;
  subclass: ManifestSubclass;
}

type CharacterClass = 'titan' | 'hunter' | 'warlock';

const getCategoryHashes = (subclass: ManifestSubclass): { [key: string]: number[] } => {
  console.log('getCategoryHashes input subclass:', subclass);

  const subclassTypeMap: { [key: number]: string } = {
    1: 'PRISMATIC',
    2: 'ARC',
    3: 'SOLAR',
    4: 'VOID',
    6: 'STASIS',
    7: 'STRAND',
  };

  const subclassType = subclassTypeMap[
    subclass.damageType
  ] as keyof typeof PLUG_CATEGORY_HASH.TITAN.ARC;
  const classType = subclass.class.toUpperCase() as 'TITAN' | 'HUNTER' | 'WARLOCK';

  console.log('Class type:', classType);
  console.log('Subclass type:', subclassType);

  const categoryHashes: { [key: string]: number[] } = {
    SUPERS: [],
    CLASS_ABILITIES: [],
    MELEE_ABILITIES: [],
    MOVEMENT_ABILITIES: [],
    ASPECTS: [],
    GRENADES: [],
    FRAGMENTS: [],
  };

  const addValuesFromEnum = (key: string, enumObj: any) => {
    if (enumObj) {
      console.log(`Adding values from enum ${key}:`, enumObj);
      categoryHashes[key].push(...(Object.values(enumObj) as number[]));
    }
  };

  if ((PLUG_CATEGORY_HASH[classType as keyof typeof PLUG_CATEGORY_HASH] as any)[subclassType]) {
    const classAndSubclass = (
      PLUG_CATEGORY_HASH[classType as keyof typeof PLUG_CATEGORY_HASH] as any
    )[subclassType];
    console.log('Class and subclass found:', classAndSubclass);

    addValuesFromEnum('SUPERS', classAndSubclass.SUPERS);
    addValuesFromEnum('CLASS_ABILITIES', classAndSubclass.CLASS_ABILITIES);
    addValuesFromEnum('MELEE_ABILITIES', classAndSubclass.MELEE_ABILITIES);
    addValuesFromEnum('MOVEMENT_ABILITIES', classAndSubclass.MOVEMENT_ABILITIES);
    addValuesFromEnum('ASPECTS', classAndSubclass.ASPECTS);
    addValuesFromEnum('GRENADES', classAndSubclass.GRENADES);
    addValuesFromEnum('FRAGMENTS', classAndSubclass.FRAGMENTS);
  } else {
    console.error('Class and subclass not found for:', { classType, subclassType });
  }

  console.log('Category hashes:', categoryHashes);
  return categoryHashes;
};

const fetchMods = async (
  subclass: ManifestSubclass
): Promise<{ [key: string]: ManifestPlug[] }> => {
  const categoryHashes = getCategoryHashes(subclass);
  console.log('Category hashes:', categoryHashes);

  const modsData: { [key: string]: ManifestPlug[] } = {
    SUPERS: [],
    CLASS_ABILITIES: [],
    MELEE_ABILITIES: [],
    MOVEMENT_ABILITIES: [],
    ASPECTS: [],
    GRENADES: [],
    FRAGMENTS: [],
  };

  const modsDataPromises = Object.keys(categoryHashes).map(async (key) => {
    const hashes = categoryHashes[key];
    const mods = await db.manifestSubclassModDef.where('category').anyOf(hashes).toArray();
    modsData[key] = mods;
  });

  await Promise.all(modsDataPromises);
  console.log('Fetched mods data:', modsData);
  return modsData;
};

interface ModCategoryProps {
  categoryName: string;
  mods: ManifestPlug[];
}

const ModCategory: React.FC<ModCategoryProps> = ({ categoryName, mods }) => (
  <div className="mod-category">
    <div className="mod-category-header">{categoryName}</div>
    <div className="mod-category-content">
      {mods.map((mod) => (
        <button
          key={mod.itemHash}
          className="mod-item"
          style={{ backgroundImage: `url(${mod.icon})` }}
        >
          {mod.name}
        </button>
      ))}
    </div>
  </div>
);

const ArmorCustomization: React.FC<ArmorCustomizationProps> = ({
  onBackClick,
  screenshot,
  subclass,
}) => {
  const [mods, setMods] = useState<{ [key: string]: ManifestPlug[] }>({
    SUPERS: [],
    CLASS_ABILITIES: [],
    MELEE_ABILITIES: [],
    MOVEMENT_ABILITIES: [],
    ASPECTS: [],
    GRENADES: [],
    FRAGMENTS: [],
  });

  useEffect(() => {
    if (subclass) {
      console.log('Fetching mods for subclass:', subclass);
      fetchMods(subclass)
        .then((modsData) => {
          console.log('Fetched mods:', modsData);
          setMods(modsData);
        })
        .catch((error) => {
          console.error('Error fetching mods:', error);
        });
    }
  }, [subclass]);

  return (
    <div className="armor-customization-wrapper" style={{ backgroundImage: `url(${screenshot})` }}>
      <div className="customization-content">
        <div className="customization-panel">
          <button className="back-button" onClick={onBackClick}>
            ← Back
          </button>
          <div className="armor-slots">
            {['Helmet', 'Arms', 'Chest', 'Leg', 'Class Item'].map((armorType, index) => (
              <div key={armorType} className="armor-slot">
                <div className="armor-header">{armorType}</div>
                <div className="mod-grid">
                  {['slot1', 'slot2', 'slot3', 'slot4', 'slot5'].map((slot, slotIndex) => (
                    <div key={slot} className={`mod icon${slotIndex + 1}`}></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="subclass-mods-container">
          {Object.keys(mods).map((category) => (
            <ModCategory key={category} categoryName={category} mods={mods[category]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArmorCustomization;
