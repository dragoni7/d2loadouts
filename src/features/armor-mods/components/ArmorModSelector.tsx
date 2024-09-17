import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ManifestArmorMod, ManifestArmorStatMod } from '../../../types/manifest-types';
import { IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HoverCard from '../../../components/HoverCard';

interface ModSelectorProps {
  selected: ManifestArmorMod | ManifestArmorStatMod;
  mods: (ManifestArmorMod | ManifestArmorStatMod)[];
  onSelectMod: (mod: ManifestArmorMod | ManifestArmorStatMod) => void;
  availableEnergy: number;
}

const lockedModIcon =
  'https://www.bungie.net/common/destiny2_content/icons/1426b518acd10943c31171c99222e6fd.png';

const ArmorModSelector: React.FC<ModSelectorProps> = ({
  selected,
  mods,
  onSelectMod,
  availableEnergy,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [hoveredMod, setHoveredMod] = useState<ManifestArmorMod | ManifestArmorStatMod | null>(
    null
  );
  const modsPerPage = 18; // 3 rows * 6 columns

  const handlePrevious = () => {
    setStartIndex(Math.max(0, startIndex - modsPerPage));
  };

  const handleNext = () => {
    setStartIndex(Math.min(mods.length - modsPerPage, startIndex + modsPerPage));
  };

  const isModDisabled = (mod: ManifestArmorMod | ManifestArmorStatMod) => {
    return !mod.isOwned || mod.energyCost > availableEnergy;
  };

  const renderHoverMessage = (mod: ManifestArmorMod | ManifestArmorStatMod) => {
    if (!mod.isOwned) {
      return 'Mod not owned';
    } else if (mod.energyCost > availableEnergy) {
      return 'Not enough energy';
    }
    return null;
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
              <Box key={mod.itemHash} sx={{ position: 'relative' }}>
                <HoverCard item={mod}>
                  <Box
                    className="submenu-item"
                    sx={{
                      width: '74px',
                      height: '74px',
                      backgroundImage: `url(${mod.isOwned ? mod.icon : lockedModIcon})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: isModDisabled(mod) ? 'not-allowed' : 'pointer',
                      backgroundColor: 'rgba(10, 10, 10, 0.8)',
                      filter: isModDisabled(mod) ? 'grayscale(100%) brightness(50%)' : 'none',
                      transition: 'filter 0.3s ease',
                    }}
                    onClick={() => !isModDisabled(mod) && onSelectMod(mod)}
                    onMouseEnter={() => setHoveredMod(mod)}
                    onMouseLeave={() => setHoveredMod(null)}
                  />
                </HoverCard>
                {hoveredMod === mod && isModDisabled(mod) && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '100%',
                      left: 0,

                      width: '100%',
                      backgroundColor: 'red',
                      color: 'white',
                      padding: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      zIndex: 1601,
                    }}
                  >
                    {renderHoverMessage(mod)}
                  </Box>
                )}
              </Box>
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
