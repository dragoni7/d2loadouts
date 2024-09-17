import React, { useState } from 'react';
import { Box } from '@mui/system';
import { ManifestArmorMod, ManifestArmorStatMod } from '../../../types/manifest-types';
import { IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HoverCard from '../../../components/HoverCard';

interface ModSelectorProps {
  selected: ManifestArmorMod | ManifestArmorStatMod;
  mods: (ManifestArmorMod | ManifestArmorStatMod)[];
  onSelectMod: (mod: ManifestArmorMod | ManifestArmorStatMod) => void;
}

const lockedModIcon =
  'https://www.bungie.net/common/destiny2_content/icons/1426b518acd10943c31171c99222e6fd.png';

const ArmorModSelector: React.FC<ModSelectorProps> = ({ selected, mods, onSelectMod }) => {
  const [startIndex, setStartIndex] = useState(0);
  const modsPerPage = 18; // 3 rows * 6 columns

  const handlePrevious = () => {
    setStartIndex(Math.max(0, startIndex - modsPerPage));
  };

  const handleNext = () => {
    setStartIndex(Math.min(mods.length - modsPerPage, startIndex + modsPerPage));
  };

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
          backgroundColor: 'rgba(10, 10, 10, 0.8)',
        }}
      />
      <Box
        className="submenu-grid"
        sx={{
          display: 'none',
          position: 'absolute',
          top: '100%',
          left: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(5px)',
          padding: '10px',
          zIndex: 1000,
          width: '550px',
          borderRadius: '0px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={handlePrevious}
            disabled={startIndex === 0}
            sx={{ color: 'white', padding: '10px' }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 74px)',
              gap: '5px',
              justifyContent: 'center',
            }}
          >
            {mods.slice(startIndex, startIndex + modsPerPage).map((mod) => (
              <HoverCard key={mod.itemHash} item={mod}>
                <Box
                  className="submenu-item"
                  sx={{
                    width: '74px',
                    height: '74px',
                    backgroundImage: `url(${mod.isOwned ? mod.icon : lockedModIcon})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'rgba(10, 10, 10, 0.8)',
                  }}
                  onClick={() => onSelectMod(mod)}
                />
              </HoverCard>
            ))}
          </Box>
          <IconButton
            onClick={handleNext}
            disabled={startIndex + modsPerPage >= mods.length}
            sx={{ color: 'white', padding: '10px' }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ArmorModSelector;
