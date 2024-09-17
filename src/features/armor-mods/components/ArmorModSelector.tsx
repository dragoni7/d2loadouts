import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/system';
import { ManifestArmorMod, ManifestArmorStatMod } from '../../../types/manifest-types';
import { Tooltip, IconButton, styled } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface ModSelectorProps {
  selected: ManifestArmorMod | ManifestArmorStatMod;
  mods: (ManifestArmorMod | ManifestArmorStatMod)[];
  onSelectMod: (mod: ManifestArmorMod | ManifestArmorStatMod) => void;
}

const lockedModIcon =
  'https://www.bungie.net/common/destiny2_content/icons/1426b518acd10943c31171c99222e6fd.png';

const Submenu = styled('div', { shouldForwardProp: (prop) => prop !== 'top' })<{ top: number }>(
  ({ theme, top }) =>
    top > 500
      ? {
          display: 'none',
          position: 'absolute',
          left: 0,
          [theme.breakpoints.down('lg')]: {
            bottom: '100%',
          },
          [theme.breakpoints.between('lg', 'xl')]: {
            top: '100%',
          },
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(5px)',
          padding: '6px',
          zIndex: 1000,
          width: '550px',
          borderRadius: '0px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }
      : {
          display: 'none',
          position: 'absolute',
          left: 0,
          top: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(5px)',
          padding: '6px',
          zIndex: 1000,
          width: '550px',
          borderRadius: '0px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }
);

const ArmorModSelector: React.FC<ModSelectorProps> = ({ selected, mods, onSelectMod }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [top, setTop] = useState<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const modsPerPage = 18; // 3 rows * 6 columns

  const handlePrevious = () => {
    setStartIndex(Math.max(0, startIndex - modsPerPage));
  };

  const handleNext = () => {
    setStartIndex(Math.min(mods.length - modsPerPage, startIndex + modsPerPage));
  };

  useEffect(() => {
    const element = elementRef.current;

    if (element) {
      setTop(element.getBoundingClientRect().top);
    }
  }, []);

  return (
    <Box
      ref={elementRef}
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
      <Submenu top={top} className="submenu-grid">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={handlePrevious}
            disabled={startIndex === 0}
            sx={{ color: 'white', height: '100%', borderRadius: 0 }}
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
              <Tooltip key={mod.itemHash} title={mod.name} placement="top" disableInteractive>
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
              </Tooltip>
            ))}
          </Box>
          <IconButton
            onClick={handleNext}
            disabled={startIndex + modsPerPage >= mods.length}
            sx={{ color: 'white', height: '100%', borderRadius: 0 }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Submenu>
    </Box>
  );
};

export default ArmorModSelector;
