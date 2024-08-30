import { Box } from '@mui/system';
import { ManifestArmorMod, ManifestArmorStatMod } from '../../../types/manifest-types';
import { useState } from 'react';
import { Tooltip } from '@mui/material';

interface ModSelectorProps {
  selected: ManifestArmorMod | ManifestArmorStatMod;
  mods: (ManifestArmorMod | ManifestArmorStatMod)[];
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
        maxWidth: '100%',
        height: 'auto',
      }}
    >
      <img
        src={selected.icon}
        style={{
          maxWidth: '91px',
          width: '58%',
          height: 'auto',
          backgroundColor: 'rgba(60, 60, 60, 0.45)',
        }}
      />
      <Box className="submenu-grid">
        {mods.map((mod) => (
          <Tooltip title={mod.name} placement="top" disableInteractive>
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
            />
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default ArmorModSelector;
