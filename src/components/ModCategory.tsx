import React, { useEffect, useState } from 'react';
import { ManifestPlug } from '../types';
import { updateSubclassMods } from '../store/LoadoutReducer';
import { useDispatch } from 'react-redux';

interface ModCategoryProps {
  mods: ManifestPlug[];
  categoryName: string;
  slotCount: number;
}

const ModCategory: React.FC<ModCategoryProps> = ({ mods, categoryName, slotCount }) => {
  const [selectedMods, setSelectedMods] = useState<ManifestPlug[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize selected mods based on available mods and slot count
    setSelectedMods(mods.slice(0, slotCount));
  }, [mods, slotCount]);

  useEffect(() => {
    // Update the Redux store when selectedMods change
    dispatch(updateSubclassMods({ category: categoryName, mods: selectedMods }));
  }, [selectedMods, categoryName, dispatch]);

  const handleModClick = (mod: ManifestPlug, slotIndex: number) => {
    // Prevent selecting a mod that is already selected
    if (selectedMods.find((selectedMod) => selectedMod?.itemHash === mod.itemHash)) {
      return;
    }
    const newSelectedMods = [...selectedMods];
    newSelectedMods[slotIndex] = mod;
    setSelectedMods(newSelectedMods);
  };

  return (
    <div className="mod-category">
      {/* Handle the SUPERS category */}
      {categoryName === 'SUPERS' && (
        <div className="super-container">
          {selectedMods[0] && (
            <div
              className="selected-super"
              style={{ backgroundImage: `url(${selectedMods[0]?.icon})` }}
            >
              <div className="super-name">{selectedMods[0]?.name}</div>
              <div className="submenu-grid">
                {mods
                  .filter((mod) => !selectedMods.includes(mod))
                  .map((mod) => (
                    <div
                      key={mod.itemHash}
                      className="submenu-item"
                      style={{ backgroundImage: `url(${mod.icon})` }}
                      onClick={() => handleModClick(mod, 0)}
                    >
                      <div className="submenu-item-name">{mod.name}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Handle the ASPECTS category below SUPERS */}
      {categoryName === 'ASPECTS' && (
        <div className="aspect-slots">
          {selectedMods.map((selectedMod, index) => (
            <div
              key={index}
              className="aspect-slot"
              style={{ backgroundImage: `url(${selectedMod?.icon})` }}
            >
              <div className="slot-name">
                Slot {index + 1}: {selectedMod?.name}
              </div>
              <div className="submenu-grid">
                {mods
                  .filter((mod) => !selectedMods.includes(mod))
                  .map((mod) => (
                    <div
                      key={mod.itemHash}
                      className="submenu-item"
                      style={{ backgroundImage: `url(${mod.icon})` }}
                      onClick={() => handleModClick(mod, index)}
                    >
                      <div className="submenu-item-name">{mod.name}</div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Handle the FRAGMENTS category */}
      {categoryName === 'FRAGMENTS' && (
        <div className="fragment-slots">
          {selectedMods.map((selectedMod, index) => (
            <div
              key={index}
              className="fragment-slot"
              style={{ backgroundImage: `url(${selectedMod?.icon})` }}
            >
              <div className="slot-name">
                Slot {index + 1}: {selectedMod?.name}
              </div>
              <div className="submenu-grid">
                {mods
                  .filter((mod) => !selectedMods.includes(mod))
                  .map((mod) => (
                    <div
                      key={mod.itemHash}
                      className="submenu-item"
                      style={{ backgroundImage: `url(${mod.icon})` }}
                      onClick={() => handleModClick(mod, index)}
                    >
                      <div className="submenu-item-name">{mod.name}</div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Handle other categories */}
      {categoryName !== 'SUPERS' && categoryName !== 'ASPECTS' && categoryName !== 'FRAGMENTS' && (
        <div className="other-slots">
          {selectedMods.length === 0 ? (
            <div className="other-slot">
              <div className="submenu-grid">
                {mods.map((mod) => (
                  <div
                    key={mod.itemHash}
                    className="submenu-item"
                    style={{ backgroundImage: `url(${mod.icon})` }}
                    onClick={() => handleModClick(mod, 0)}
                  >
                    <div className="submenu-item-name">{mod.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            selectedMods.map((selectedMod, index) => (
              <div
                key={index}
                className="other-slot"
                style={{ backgroundImage: `url(${selectedMod?.icon})` }}
              >
                <div className="slot-name">
                  Slot {index + 1}: {selectedMod?.name}
                </div>
                <div className="submenu-grid">
                  {mods
                    .filter((mod) => !selectedMods.includes(mod))
                    .map((mod) => (
                      <div
                        key={mod.itemHash}
                        className="submenu-item"
                        style={{ backgroundImage: `url(${mod.icon})` }}
                        onClick={() => handleModClick(mod, index)}
                      >
                        <div className="submenu-item-name">{mod.name}</div>
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ModCategory;
