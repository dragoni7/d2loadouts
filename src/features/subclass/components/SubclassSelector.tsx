import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { Box, Typography } from '@mui/material';
import { SubclassConfig } from '../../../types/d2l-types';
import { DAMAGE_TYPE } from '../../../lib/bungie_api/constants';
import AnimatedBackground from '@/components/AnimatedBackground';
import { db } from '@/store/db';
import { ManifestSubclass } from '@/types/manifest-types';

const subclassColors: { [key: string]: string } = {
  kinetic: '#ff52cd',
  arc: '#9af9ff',
  solar: '#ff8000',
  void: '#800080',
  strand: '#138035',
  stasis: '#0062ff',
};

const Root = styled(Box)<{ $selectedColor: string }>(({ $selectedColor }) => ({
  width: '200px',
  height: '200px',
  position: 'relative',
  transform: 'rotate(45deg)',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridTemplateRows: 'repeat(3, 1fr)',
  gap: '1px',
  padding: '1px',
  boxSizing: 'border-box',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-100px',
    left: '-100px',
    right: '-100px',
    bottom: '-100px',
    background: `radial-gradient(circle, ${$selectedColor}66 0%, ${$selectedColor}33 30%, transparent 70%)`,
    opacity: 0.5,
    transition: 'opacity 0.3s ease',
    zIndex: -1,
    willChange: 'opacity',
  },
  '&:hover::before': {
    opacity: 1,
  },
  '&:hover .subclass-icon': {
    transform: 'rotate(-45deg) scale(1.3)',
    opacity: 1,
    filter: 'none',
  },
}));

const SubclassButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isCenter',
})<{ isSelected?: boolean; isCenter?: boolean }>(({ isSelected, isCenter }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  background: 'rgba(255, 255, 255, 0.05)',
  transition: 'background-color 0.3s ease',
  padding: 0,
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  ...(isCenter && {
    gridArea: '1 / 1 / 3 / 3',
  }),
}));

const SuperIcon = styled('img')({
  width: '100%',
  height: 'auto',
  display: 'block',
});

const SubclassIcon = styled('img')<{ isCenter: boolean; isSelected: boolean }>(
  ({ isCenter, isSelected }) => ({
    width: isCenter || isSelected ? '100%' : '80%',
    height: isCenter || isSelected ? '100%' : '80%',
    objectFit: 'contain',
    transform: 'rotate(-45deg)',
    transition: 'transform 0.3s ease, opacity 0.3s ease, filter 0.3s ease',
    filter: isSelected ? 'none' : 'brightness(0) invert(1)',
    opacity: isSelected ? 1 : 0.5,
    willChange: 'transform, opacity, filter',
  })
);

const HoverCard = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '90%',
  left: '80%',
  transform: 'translateX(-50%) rotate(-45deg)',
  width: '250px',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  overflow: 'hidden',
  zIndex: 1000,
  pointerEvents: 'none',
}));

const HoverCardTitle = styled(Box)<{ $backgroundColor: string }>(({ $backgroundColor }) => ({
  backgroundColor: `${$backgroundColor}44`,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px',
}));

const HoverCardContent = styled(Box)(({ theme }) => ({
  padding: '0 1px 1px',
}));

const FlavorTextContainer = styled(Box)({
  opacity: 0.8,
  padding: '10px 0',
  position: 'relative',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent)',
  },
  '&::before': {
    top: 0,
  },
  '&::after': {
    bottom: 0,
  },
});

const TitleIcon = styled('img')({
  width: '60px',
  height: '60px',
  opacity: '0.7',
});

const MouseIconImage = styled('img')({
  width: '16px',
  height: '16px',
  marginRight: '4px',
});

const ClickInstructionContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 0 0',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent)',
  },
});

interface SubclassSelectorProps {
  subclasses: { [key: number]: SubclassConfig | undefined } | undefined;
  selectedSubclass: SubclassConfig | null;
  onSubclassSelect: (subclass: SubclassConfig) => void;
  onSubclassOpen: (subclass: SubclassConfig) => void;
}

const SubclassSelector: React.FC<SubclassSelectorProps> = React.memo(
  ({ subclasses, selectedSubclass, onSubclassSelect, onSubclassOpen }) => {
    const [hoveredSubclass, setHoveredSubclass] = useState<SubclassConfig | null>(null);
    const [manifestSubclass, setManifestSubclass] = useState<ManifestSubclass | null>(null);

    useEffect(() => {
      if (hoveredSubclass) {
        const fetchManifestSubclass = async () => {
          try {
            const data = await db.manifestSubclass
              .where('itemHash')
              .equals(hoveredSubclass.subclass.itemHash)
              .first();
            if (data) {
              setManifestSubclass(data);
            } else {
              console.warn(
                `No manifest data found for subclass with itemHash: ${hoveredSubclass.subclass.itemHash}`
              );
              setManifestSubclass(null);
            }
          } catch (error) {
            console.error('Error fetching manifest subclass:', error);
            setManifestSubclass(null);
          }
        };

        fetchManifestSubclass();
      } else {
        setManifestSubclass(null);
      }
    }, [hoveredSubclass]);

    if (!subclasses || Object.keys(subclasses).length === 0) {
      return <div>No subclasses available</div>;
    }

    const subclassEntries = Object.entries(subclasses)
      .filter((entry): entry is [string, SubclassConfig] => entry[1] !== undefined)
      .map(([_, subclass]) => subclass);

    const handleSelect = (subclass: SubclassConfig) => {
      onSubclassSelect(subclass);
    };

    const handleOpenSubclass = (event: React.MouseEvent, subclass: SubclassConfig) => {
      event.preventDefault();
      onSubclassOpen(subclass);
    };

    const orderedSubclasses = [
      ...(selectedSubclass ? [selectedSubclass] : []),
      ...subclassEntries.filter((subclass) => subclass.damageType !== selectedSubclass?.damageType),
    ];

    const gridPositions = [
      '1 / 1 / 3 / 3',
      '1 / 3 / 2 / 4',
      '2 / 3 / 3 / 4',
      '3 / 1 / 4 / 2',
      '3 / 2 / 4 / 3',
      '3 / 3 / 4 / 4',
    ];

    const getSubclassColor = (subclass: SubclassConfig): string => {
      const damageTypeName = DAMAGE_TYPE[subclass.damageType].toLowerCase();
      return subclassColors[damageTypeName] || subclassColors.kinetic;
    };

    const selectedColor = selectedSubclass
      ? getSubclassColor(selectedSubclass)
      : subclassColors.kinetic;

    return (
      <Root $selectedColor={selectedColor}>
        <AnimatedBackground />
        {orderedSubclasses.map((subclass, index) => {
          const isSelected = selectedSubclass?.damageType === subclass.damageType;
          const isCenter = index === 0;
          const subclassColor = getSubclassColor(subclass);

          return (
            <SubclassButton
              key={subclass.damageType}
              isSelected={isSelected}
              isCenter={isCenter}
              onClick={(event) => {
                if (subclass === selectedSubclass) {
                  handleOpenSubclass(event, subclass);
                } else {
                  handleSelect(subclass);
                }
              }}
              style={{ gridArea: gridPositions[index] }}
              onMouseEnter={() => setHoveredSubclass(subclass)}
              onMouseLeave={() => setHoveredSubclass(null)}
            >
              <SubclassIcon
                className="subclass-icon"
                isCenter={isCenter}
                isSelected={isSelected}
                src={`/assets/subclass-icons/${subclass.damageType}.png`}
                alt={`Subclass ${DAMAGE_TYPE[subclass.damageType]}`}
              />
              {hoveredSubclass === subclass && manifestSubclass && (
                <HoverCard>
                  <HoverCardTitle $backgroundColor={subclassColor}>
                    <TitleIcon
                      src={`/assets/energy-icons/${subclass.damageType}.png`}
                      alt="Energy icon"
                    />
                    <Typography variant="h6">{manifestSubclass.name}</Typography>
                  </HoverCardTitle>
                  <HoverCardContent>
                    <SuperIcon
                      src={subclass.super.secondaryIcon || manifestSubclass.icon}
                      alt={manifestSubclass.name}
                    />
                    <FlavorTextContainer>
                      <Typography variant="body2">{manifestSubclass.flavorText}</Typography>
                    </FlavorTextContainer>
                    <ClickInstructionContainer>
                      <MouseIconImage src="/assets/left.png" alt="Mouse icon" />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {isSelected ? 'Left-click for details' : 'Left-click to select'}
                      </Typography>
                    </ClickInstructionContainer>
                  </HoverCardContent>
                </HoverCard>
              )}
            </SubclassButton>
          );
        })}
      </Root>
    );
  }
);

export default SubclassSelector;
