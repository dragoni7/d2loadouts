import React, { useEffect } from 'react';
import './ArmorCustomization.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { db } from '../store/db';
import { ManifestPlug, ManifestSubclass } from '../types';
import { PLUG_CATEGORY_HASH } from '../lib/bungie_api/SubclassConstants';
import { setMods } from '../store/ModSlice';
import ArmorMods from './ArmorMods';
import ModCategory from './ModCategory';

interface ArmorCustomizationProps {
  onBackClick: () => void;
  screenshot: string;
  subclass: ManifestSubclass;
}

const getCategoryHashes = (subclass: ManifestSubclass): { [key: string]: number[] } => {
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
      categoryHashes[key].push(...(Object.values(enumObj) as number[]));
    }
  };

  if ((PLUG_CATEGORY_HASH[classType as keyof typeof PLUG_CATEGORY_HASH] as any)[subclassType]) {
    const classAndSubclass = (
      PLUG_CATEGORY_HASH[classType as keyof typeof PLUG_CATEGORY_HASH] as any
    )[subclassType];

    addValuesFromEnum('SUPERS', classAndSubclass.SUPERS);
    addValuesFromEnum('CLASS_ABILITIES', classAndSubclass.CLASS_ABILITIES);
    addValuesFromEnum('MELEE_ABILITIES', classAndSubclass.MELEE_ABILITIES);
    addValuesFromEnum('MOVEMENT_ABILITIES', classAndSubclass.MOVEMENT_ABILITIES);
    addValuesFromEnum('ASPECTS', classAndSubclass.ASPECTS);
    addValuesFromEnum('GRENADES', classAndSubclass.GRENADES);
    addValuesFromEnum('FRAGMENTS', classAndSubclass.FRAGMENTS);
  }

  return categoryHashes;
};

const fetchMods = async (subclass: ManifestSubclass, dispatch: AppDispatch) => {
  const categoryHashes = getCategoryHashes(subclass);

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

    // Use a Set to filter out duplicates
    const uniqueMods = Array.from(new Set(mods.map((mod) => mod.itemHash))).map((itemHash) =>
      mods.find((mod) => mod.itemHash === itemHash)
    ) as ManifestPlug[];

    modsData[key] = uniqueMods;
  });

  await Promise.all(modsDataPromises);
  dispatch(setMods(modsData));
};

const ArmorCustomization: React.FC<ArmorCustomizationProps> = ({
  onBackClick,
  screenshot,
  subclass,
}) => {
  const dispatch = useDispatch();
  const mods = useSelector((state: RootState) => state.mods.mods);

  useEffect(() => {
    if (subclass) {
      fetchMods(subclass, dispatch);
    }
  }, [subclass, dispatch]);

  return (
    <div className="armor-customization-wrapper" style={{ backgroundImage: `url(${screenshot})` }}>
      <div className="left-panel">
        <ArmorMods />
      </div>
      <div className="right-panel">
        <button className="back-button" onClick={onBackClick}>
          ← Back
        </button>
        <ModCategory categoryName="SUPERS" slotCount={1} />
        <ModCategory categoryName="ASPECTS" slotCount={2} />
        <ModCategory categoryName="FRAGMENTS" slotCount={5} />
        <div className="other-slots">
          {['CLASS_ABILITIES', 'MELEE_ABILITIES', 'MOVEMENT_ABILITIES', 'GRENADES'].map(
            (category) => (
              <ModCategory key={category} categoryName={category} slotCount={1} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ArmorCustomization;
