import { Box } from '@mui/system';
import { ManifestArmorMod, ManifestArmorStatMod } from '../../../types/manifest-types';

interface ModSelectorProps {
  selected: ManifestArmorMod | ManifestArmorStatMod;
  mods: ManifestArmorMod[];
  onSelectMod: (mod: ManifestArmorMod | ManifestArmorStatMod) => void;
}

const ArmorModSelector: React.FC<ModSelectorProps> = ({ selected, mods, onSelectMod }) => {
  return (
    <Box
      className="armor-mod-slot"
      style={{
        backgroundImage: `url(${selected.icon})`,
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
