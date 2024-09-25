import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/system';
import { ManifestArmorMod, ManifestArmorStatMod } from '../../../types/manifest-types';
import { IconButton, Stack, styled } from '@mui/material';
import { ArrowRight, ArrowLeft } from '@mui/icons-material';
import HoverCard from '@/components/hover/HoverCard';

interface ModSelectorProps {
  selected: ManifestArmorMod | ManifestArmorStatMod;
  mods: (ManifestArmorMod | ManifestArmorStatMod)[];
  onSelectMod: (mod: ManifestArmorMod | ManifestArmorStatMod) => void;
  availableEnergy: number;
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
          padding: '6px',
          zIndex: 1000,
          borderRadius: '0px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }
      : {
          display: 'none',
          position: 'absolute',
          left: 0,
          top: '100%',
          padding: '6px',
          zIndex: 1000,
          borderRadius: '0px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }
);

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
  const [top, setTop] = useState<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const modsPerPage = 18;

  useEffect(() => {
    const element = elementRef.current;

    if (element) {
      setTop(element.getBoundingClientRect().top);
    }
  });

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
      <Submenu
        top={top}
        className="submenu-grid"
        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(5px)' }}
      >
        <Stack direction="row" spacing={1}>
          {startIndex > 0 && (
            <IconButton
              onClick={handlePrevious}
              disabled={startIndex === 0}
              sx={{
                color: 'white',
                height: '100%',
                borderRadius: 0,
                backgroundColor: 'grey',
                opacity: 0.8,
              }}
            >
              <ArrowLeft fontSize="large" />
            </IconButton>
          )}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 74px)',
              gap: '8px',
              justifyContent: 'center',
            }}
          >
            {mods.slice(startIndex, startIndex + modsPerPage).map((mod) => (
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
                    border: '2px solid grey',
                  }}
                  onClick={() => !isModDisabled(mod) && onSelectMod(mod)}
                  onMouseEnter={() => setHoveredMod(mod)}
                  onMouseLeave={() => setHoveredMod(null)}
                />
                {hoveredMod === mod && isModDisabled(mod) && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -25,
                      left: -140,
                      width: '150%',
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
              </HoverCard>
            ))}
          </Box>
          {startIndex + modsPerPage < mods.length && (
            <IconButton
              onClick={handleNext}
              disabled={startIndex + modsPerPage >= mods.length}
              sx={{
                color: 'white',
                height: '100%',
                borderRadius: 0,
                backgroundColor: 'grey',
                opacity: 0.8,
              }}
            >
              <ArrowRight fontSize="large" />
            </IconButton>
          )}
        </Stack>
      </Submenu>
    </Box>
  );
};

export default ArmorModSelector;
