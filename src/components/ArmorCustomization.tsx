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

const getCategoryHashes = (subclass: ManifestSubclass): number[] => {
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

  const categoryHashes: number[] = [];

  const addValuesFromEnum = (enumObj: any) => {
    if (enumObj) {
      console.log('Adding values from enum:', enumObj);
      categoryHashes.push(...(Object.values(enumObj) as number[]));
    }
  };

  if ((PLUG_CATEGORY_HASH[classType as keyof typeof PLUG_CATEGORY_HASH] as any)[subclassType]) {
    const classAndSubclass = (
      PLUG_CATEGORY_HASH[classType as keyof typeof PLUG_CATEGORY_HASH] as any
    )[subclassType];
    console.log('Class and subclass found:', classAndSubclass);

    addValuesFromEnum(classAndSubclass.SUPERS);
    addValuesFromEnum(classAndSubclass.CLASS_ABILITIES);
    addValuesFromEnum(classAndSubclass.MELEE_ABILITIES);
    addValuesFromEnum(classAndSubclass.MOVEMENT_ABILITIES);
    addValuesFromEnum(classAndSubclass.ASPECTS);
    addValuesFromEnum(classAndSubclass.GRENADES);
    addValuesFromEnum(classAndSubclass.FRAGMENTS);
  } else {
    console.error('Class and subclass not found for:', { classType, subclassType });
  }

  console.log('Category hashes:', categoryHashes);
  return categoryHashes;
};

const fetchMods = async (subclass: ManifestSubclass): Promise<ManifestPlug[]> => {
  const categoryHashes = getCategoryHashes(subclass);
  console.log('Category hashes:', categoryHashes);

  if (!categoryHashes || categoryHashes.length === 0) {
    console.error('No category hashes found for subclass:', subclass);
    return [];
  }

  const modsDataPromises = categoryHashes.map((hash) =>
    db.manifestSubclassModDef.where('category').equals(hash).toArray()
  );

  const modsData = (await Promise.all(modsDataPromises)).flat();
  console.log('Fetched mods data:', modsData);
  return modsData;
};

const ArmorCustomization: React.FC<ArmorCustomizationProps> = ({
  onBackClick,
  screenshot,
  subclass,
}) => {
  const [mods, setMods] = useState<ManifestPlug[]>([]);

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
            {['Helmet', 'Arms', 'Chest', 'Leg', 'Class Item'].map((armorType) => (
              <div key={armorType} className="armor-slot">
                <div className="armor-header">{armorType}</div>
                <div className="mod-grid">
                  {['slot1', 'slot2', 'slot3', 'slot4', 'slot5'].map((slot) => (
                    <div key={slot} className="mod">
                      {slot}
                      <div className="submenu-grid">
                        <div className="submenu-item">Option 1</div>
                        <div className="submenu-item">Option 2</div>
                        <div className="submenu-item">Option 3</div>
                        <div className="submenu-item">Option 4</div>
                        <div className="submenu-item">Option 5</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="subclass-mods-container">
          {mods.map((mod) => (
            <button key={mod.itemHash} className="mod-button">
              {mod.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArmorCustomization;
