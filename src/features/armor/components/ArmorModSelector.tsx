import { Box } from '@mui/system';
import { ManifestArmorMod, ManifestArmorStatMod } from '../../../types/manifest-types';

interface ModSelectorProps {
  selected: ManifestArmorMod | ManifestArmorStatMod;
  mods: ManifestArmorMod[];
  onSelectMod: (mod: ManifestArmorMod | ManifestArmorStatMod) => void;
}

const lockedModIcon =
  'https://www.bungie.net/common/destiny2_content/icons/1426b518acd10943c31171c99222e6fd.png';

const ArmorModSelector: React.FC<ModSelectorProps> = ({ selected, mods, onSelectMod }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        cursor: 'pointer',
        '&:hover .submenu-grid': { display: 'flex' },
        width: 81,
        height: 81,
      }}
    >
      <img src={selected.icon} width={'100%'} height={'100%'} />
      <div className="submenu-grid">
        {mods.map((mod) => (
          <div
            key={mod.itemHash}
            className="submenu-item"
            style={{
              backgroundImage: `url(${mod.isOwned ? mod.icon : lockedModIcon})`,
            }}
            onClick={() => {
              if (selected.itemHash !== mod.itemHash && mod.isOwned) {
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
