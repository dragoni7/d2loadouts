// src/components/ModCategory.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ManifestPlug } from '../types';

interface ModCategoryProps {
  categoryName: string;
  slotCount: number;
}

const ModCategory: React.FC<ModCategoryProps> = ({ categoryName, slotCount }) => {
  const mods = useSelector((state: RootState) => state.mods.mods[categoryName]);
  const [selectedMods, setSelectedMods] = useState<ManifestPlug[]>([]);

  useEffect(() => {
    setSelectedMods(mods.slice(0, slotCount));
  }, [mods, slotCount]);

  const handleModClick = (mod: ManifestPlug, slotIndex: number) => {
    if (selectedMods.find((selectedMod) => selectedMod?.itemHash === mod.itemHash)) {
      return; // Do not allow duplicate items
    }
    const newSelectedMods = [...selectedMods];
    newSelectedMods[slotIndex] = mod;
    setSelectedMods(newSelectedMods);
  };

  return (
    <div className="mod-category">
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

      {categoryName === 'ASPECTS' && (
        <div className="fragment-slots">
          {selectedMods.map((selectedMod, index) => (
            <div
              key={index}
              className="fragment-slot"
              style={{ backgroundImage: `url(${selectedMod?.icon})` }}
            >
              <div className="slot-name">{selectedMod?.name}</div>
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

      {categoryName === 'FRAGMENTS' && (
        <div className="fragment-slots">
          {selectedMods.map((selectedMod, index) => (
            <div
              key={index}
              className="fragment-slot"
              style={{ backgroundImage: `url(${selectedMod?.icon})` }}
            >
              <div className="slot-name">{selectedMod?.name}</div>
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
                <div className="slot-name">{selectedMod?.name}</div>
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
