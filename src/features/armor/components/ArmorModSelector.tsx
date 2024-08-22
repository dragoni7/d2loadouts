import { Box } from '@mui/system';
import { Plug } from '../../../types/d2l-types';
import { ManifestArmorMod, ManifestArmorStatMod } from '../../../types/manifest-types';

interface ModSelectorProps {
  selected: ManifestArmorMod | ManifestArmorStatMod;
  mods: ManifestArmorMod[];
  onSelectMod: (mod: ManifestArmorMod) => void;
}

const ArmorModSelector: React.FC<ModSelectorProps> = ({ selected, mods, onSelectMod }) => {
  return (
    <Box
      className="armor-mod-slot"
      style={{
        backgroundImage: `url(${
          mods.find((mod) => {
            return mod.itemHash === selected.itemHash;
          })?.icon
        })`,
      }}
    >
      <div className="submenu-grid">
        {mods.map((mod) => (
          <div
            key={mod.itemHash}
            className="submenu-item"
            style={{ backgroundImage: `url(${mod.icon})` }}
            onClick={() => {
              if (selected.itemHash !== mod.itemHash) {
                onSelectMod(mod);
              }
            }}
          >
            <div className="submenu-item-name">{mod.name}</div>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default ArmorModSelector;
