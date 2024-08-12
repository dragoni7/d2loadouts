import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ManifestPlug, ManifestSubclass, Plug } from '../types';
import { RootState } from '../store';
import { db } from '../store/db';
import { PLUG_CATEGORY_HASH } from '../lib/bungie_api/SubclassConstants';
import { updateSubclassMods } from '../store/LoadoutReducer';
import './AbilitiesModification.css';

interface AbilitiesModificationProps {
  onBackClick: () => void;
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

  const classAndSubclass =
    (PLUG_CATEGORY_HASH[classType] as Record<string, any>)[subclassType] || {};

  const categoryHashes = {
    SUPERS: Object.values(classAndSubclass.SUPERS || []),
    CLASS_ABILITIES: Object.values(classAndSubclass.CLASS_ABILITIES || []),
    MOVEMENT_ABILITIES: Object.values(classAndSubclass.MOVEMENT_ABILITIES || []),
    MELEE_ABILITIES: Object.values(classAndSubclass.MELEE_ABILITIES || []),
    GRENADES: Object.values(classAndSubclass.GRENADES || []),
    ASPECTS: Object.values(classAndSubclass.ASPECTS || []),
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

const AbilitiesModification: React.FC<AbilitiesModificationProps> = ({ onBackClick, subclass }) => {
  const [mods, setMods] = useState<{ [key: string]: ManifestPlug[] }>({});
  const [selectedMods, setSelectedMods] = useState<{ [key: string]: ManifestPlug[] }>({});
  const loadout = useSelector((state: RootState) => state.loadoutConfig.loadout.subclass);
  const dispatch = useDispatch();

  useEffect(() => {
    if (subclass) {
      fetchMods(subclass).then((fetchedMods) => {
        setMods(fetchedMods);
        // Initialize selected mods based on loadout
        const initialSelectedMods: { [key: string]: ManifestPlug[] } = {};
        Object.keys(fetchedMods).forEach((category) => {
          initialSelectedMods[category] = [];
          if (loadout) {
            switch (category) {
              case 'SUPERS':
                initialSelectedMods[category] = [
                  fetchedMods[category].find(
                    (mod) => String(mod.itemHash) === loadout.super.plugItemHash
                  ),
                ].filter(Boolean) as ManifestPlug[];
                break;
              case 'ASPECTS':
                initialSelectedMods[category] = loadout.aspects
                  .map((aspect) =>
                    fetchedMods[category].find(
                      (mod) => String(mod.itemHash) === aspect.plugItemHash
                    )
                  )
                  .filter(Boolean) as ManifestPlug[];
                break;
              case 'FRAGMENTS':
                initialSelectedMods[category] = loadout.fragments
                  .map((fragment) =>
                    fetchedMods[category].find(
                      (mod) => String(mod.itemHash) === fragment.plugItemHash
                    )
                  )
                  .filter(Boolean) as ManifestPlug[];
                break;
              case 'CLASS_ABILITIES':
                if (loadout.classAbility) {
                  initialSelectedMods[category] = [
                    fetchedMods[category].find(
                      (mod) => String(mod.itemHash) === loadout.classAbility?.plugItemHash
                    ),
                  ].filter(Boolean) as ManifestPlug[];
                }
                break;
              case 'MOVEMENT_ABILITIES':
                if (loadout.movementAbility) {
                  initialSelectedMods[category] = [
                    fetchedMods[category].find(
                      (mod) => String(mod.itemHash) === loadout.movementAbility?.plugItemHash
                    ),
                  ].filter(Boolean) as ManifestPlug[];
                }
                break;
              case 'MELEE_ABILITIES':
                if (loadout.meleeAbility) {
                  initialSelectedMods[category] = [
                    fetchedMods[category].find(
                      (mod) => String(mod.itemHash) === loadout.meleeAbility?.plugItemHash
                    ),
                  ].filter(Boolean) as ManifestPlug[];
                }
                break;
              case 'GRENADES':
                if (loadout.grenade) {
                  initialSelectedMods[category] = [
                    fetchedMods[category].find(
                      (mod) => String(mod.itemHash) === loadout.grenade?.plugItemHash
                    ),
                  ].filter(Boolean) as ManifestPlug[];
                }
                break;
            }
          }
        });
        setSelectedMods(initialSelectedMods);
      });
    }
  }, [subclass, loadout]);

  const handleModClick = useCallback(
    (mod: ManifestPlug, category: string, slotIndex: number) => {
      setSelectedMods((prevSelected) => {
        const newSelected = { ...prevSelected };
        if (!newSelected[category]) {
          newSelected[category] = [];
        }
        const categoryMods = [...newSelected[category]];
        const slotCount = getSlotCount(category);

        // Find if the mod is already in the array
        const existingIndex = categoryMods.findIndex((m) => m?.itemHash === mod.itemHash);

        if (existingIndex !== -1) {
          // If the mod exists elsewhere, move it to the new position
          categoryMods.splice(existingIndex, 1); // Remove from old position
          categoryMods.splice(slotIndex, 0, mod); // Insert at new position
        } else {
          // If it's a new mod, insert it at the clicked position
          categoryMods.splice(slotIndex, 0, mod);
        }

        // Trim the array to the slot count, keeping the most recently added/moved mods
        newSelected[category] = categoryMods.slice(0, slotCount);

        // Dispatch the update to Redux store
        dispatch(updateSubclassMods({ category, mods: newSelected[category] }));

        return newSelected;
      });
    },
    [dispatch]
  );

  const getSlotCount = (category: string): number => {
    switch (category) {
      case 'SUPERS':
      case 'CLASS_ABILITIES':
      case 'MOVEMENT_ABILITIES':
      case 'MELEE_ABILITIES':
      case 'GRENADES':
        return 1;
      case 'ASPECTS':
        return 2;
      case 'FRAGMENTS':
        return 5;
      default:
        return 1;
    }
  };

  const [hoveredMods, setHoveredMods] = useState<{ [key: string]: string | null }>({
    SUPERS: null,
    ASPECTS: null,
    FRAGMENTS: null,
    ABILITIES: null,
  });

  const handleModHover = (category: string, modName: string | null) => {
    setHoveredMods((prev) => ({
      ...prev,
      [category]: modName,
    }));
  };

  const renderCategory = (category: string) => {
    const categoryMods = mods[category] || [];
    const selectedCategoryMods = selectedMods[category] || [];
    const slotCount = getSlotCount(category);
    const displayCategory = [
      'CLASS_ABILITIES',
      'MOVEMENT_ABILITIES',
      'MELEE_ABILITIES',
      'GRENADES',
    ].includes(category)
      ? 'ABILITIES'
      : category;

    return (
      <div className={`category ${category.toLowerCase()}`} key={category}>
        {!['CLASS_ABILITIES', 'MOVEMENT_ABILITIES', 'MELEE_ABILITIES', 'GRENADES'].includes(
          category
        ) && (
          <div className="category-header">
            <h3>{displayCategory.replace('_', ' ')}</h3>
            {hoveredMods[displayCategory] && (
              <span className="hovered-mod-name">- {hoveredMods[displayCategory]}</span>
            )}
          </div>
        )}
        <div className="selected-mods">
          {Array.from({ length: slotCount }).map((_, index) => (
            <div key={index} className="mod-slot">
              <div
                className={`mod-display ${
                  selectedCategoryMods[index] ? 'selected-mod' : 'empty-slot'
                }`}
                style={
                  selectedCategoryMods[index]
                    ? { backgroundImage: `url(${selectedCategoryMods[index].icon})` }
                    : {}
                }
                onMouseEnter={() =>
                  handleModHover(displayCategory, selectedCategoryMods[index]?.name || 'Empty Slot')
                }
                onMouseLeave={() => handleModHover(displayCategory, null)}
              />
              <div className="unselected-options">
                {categoryMods.map((mod) => (
                  <div
                    key={mod.itemHash}
                    className={`unselected-mod ${
                      selectedCategoryMods[index]?.itemHash === mod.itemHash ? 'selected' : ''
                    }`}
                    style={{ backgroundImage: `url(${mod.icon})` }}
                    onClick={() => handleModClick(mod, category, index)}
                    onMouseEnter={() => handleModHover(displayCategory, mod.name)}
                    onMouseLeave={() => handleModHover(displayCategory, null)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="abilities-modification">
      <button className="back-button" onClick={onBackClick}>
        ← Back
      </button>
      <div className="abilities-grid">
        <div className="super-section">{renderCategory('SUPERS')}</div>
        <div className="aspects-section">{renderCategory('ASPECTS')}</div>
        <div className="fragments-section">{renderCategory('FRAGMENTS')}</div>
        <div className="other-abilities-section">
          <div className="category-header">
            <h3>ABILITIES</h3>
            {hoveredMods['ABILITIES'] && (
              <span className="hovered-mod-name">- {hoveredMods['ABILITIES']}</span>
            )}
          </div>
          <div className="abilities-container">
            {renderCategory('CLASS_ABILITIES')}
            {renderCategory('MOVEMENT_ABILITIES')}
            {renderCategory('MELEE_ABILITIES')}
            {renderCategory('GRENADES')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbilitiesModification;
