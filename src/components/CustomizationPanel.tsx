import React, { useEffect, useState } from 'react';
import './CustomizationPanel.css';
import { ManifestSubclass, ManifestPlug } from '../types';
import ModCategory from './ModCategory';
import { db } from '../store/db';
import { PLUG_CATEGORY_HASH } from '../lib/bungie_api/SubclassConstants';

interface CustomizationPanelProps {
  screenshot: string;
  onBackClick: () => void;
  selectedSubclass: ManifestSubclass | null;
  setSelectedSubclass: (subclass: ManifestSubclass) => void;
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

  return categoryHashes;
};

const fetchMods = async (subclass: ManifestSubclass) => {
  const categoryHashes = getCategoryHashes(subclass);
  const modsData: { [key: string]: ManifestPlug[] } = {};

  await Promise.all(
    Object.entries(categoryHashes).map(async ([key, hashes]) => {
      const typedHashes = hashes as number[];
      const mods = await db.manifestSubclassModDef.where('category').anyOf(typedHashes).toArray();
      modsData[key] = Array.from(new Set(mods.map((mod) => mod.itemHash))).map((itemHash) =>
        mods.find((mod) => mod.itemHash === itemHash)
      ) as ManifestPlug[];
    })
  );

  return modsData;
};

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  screenshot,
  onBackClick,
  selectedSubclass,
}) => {
  const [mods, setMods] = useState<{ [key: string]: ManifestPlug[] }>({});

  useEffect(() => {
    if (selectedSubclass) {
      fetchMods(selectedSubclass).then(setMods);
    }
  }, [selectedSubclass]);

  return (
    <div className="customization-panel" style={{ backgroundImage: `url(${screenshot})` }}>
      <div className="back-arrow" onClick={onBackClick}>
        &#8592;
      </div>
      <div className="customization-content">
        <ModCategory mods={mods.SUPERS || []} categoryName="SUPERS" slotCount={1} />
        <div className="row">
          <div className="section" style={{ flexGrow: 1 }}>
            <div className="section-header">ABILITIES</div>
            <div className="items-grid four-items">
              <ModCategory
                mods={mods.CLASS_ABILITIES || []}
                categoryName="CLASS_ABILITIES"
                slotCount={1}
              />
              <ModCategory
                mods={mods.MELEE_ABILITIES || []}
                categoryName="MELEE_ABILITIES"
                slotCount={1}
              />
              <ModCategory
                mods={mods.MOVEMENT_ABILITIES || []}
                categoryName="MOVEMENT_ABILITIES"
                slotCount={1}
              />
              <ModCategory mods={mods.GRENADES || []} categoryName="GRENADES" slotCount={1} />
            </div>
          </div>
          <div className="empty-space"></div>
          <div className="section" style={{ marginLeft: '20px', marginBottom: '20px' }}>
            <ModCategory mods={mods.ASPECTS || []} categoryName="ASPECTS" slotCount={2} />
          </div>
        </div>
        <div className="section">
          <ModCategory mods={mods.FRAGMENTS || []} categoryName="FRAGMENTS" slotCount={5} />
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
