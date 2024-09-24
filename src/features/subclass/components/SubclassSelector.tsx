import React from 'react';
import { styled } from '@mui/system';
import { Box } from '@mui/material';
import { SubclassConfig } from '../../../types/d2l-types';
import { DAMAGE_TYPE } from '../../../lib/bungie_api/constants';
import AnimatedBackground from '@/components/AnimatedBackground';

const subclassColors = {
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
    filter: 'blur(20px)',
    transition: 'all 0.3s ease',
    zIndex: -1,
  },
  '&:hover::before': {
    background: `radial-gradient(circle, ${$selectedColor}99 0%, ${$selectedColor}66 30%, transparent 70%)`,
    filter: 'blur(25px)',
  },
  '&:hover .subclass-icon': {
    width: '130%',
    height: '130%',
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
  transition: 'all 0.3s ease',
  padding: 0,
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.05)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
  },
  ...(isCenter && {
    gridArea: '1 / 1 / 3 / 3',
  }),
}));

const SubclassIcon = styled('img')<{ isCenter: boolean; isSelected: boolean }>(
  ({ isCenter, isSelected }) => ({
    width: isCenter || isSelected ? '130%' : '70%',
    height: isCenter || isSelected ? '130%' : '70%',
    objectFit: 'contain',
    transform: 'rotate(-45deg)',
    transition: 'all 0.3s ease',
    filter: isSelected ? 'none' : 'brightness(0) invert(1)',
    opacity: isSelected ? 1 : 0.5,
  })
);

interface SubclassSelectorProps {
  subclasses: { [key: number]: SubclassConfig | undefined } | undefined;
  selectedSubclass: SubclassConfig | null;
  onSubclassSelect: (subclass: SubclassConfig) => void;
  onSubclassRightClick: (subclass: SubclassConfig) => void;
}

const SubclassSelector: React.FC<SubclassSelectorProps> = ({
  subclasses,
  selectedSubclass,
  onSubclassSelect,
  onSubclassRightClick,
}) => {
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
    onSubclassRightClick(subclass);
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
    return subclassColors[damageTypeName as keyof typeof subclassColors] || subclassColors.kinetic;
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

        return (
          <SubclassButton
            key={subclass.damageType}
            isSelected={isSelected}
            isCenter={isCenter}
            onClick={() => handleSelect(subclass)}
            onContextMenu={(event) => handleOpenSubclass(event, subclass)}
            style={{ gridArea: gridPositions[index] }}
          >
            <SubclassIcon
              className="subclass-icon"
              isCenter={isCenter}
              isSelected={isSelected}
              src={`/assets/subclass-icons/${subclass.damageType}.png`}
              alt={`Subclass ${DAMAGE_TYPE[subclass.damageType]}`}
            />
          </SubclassButton>
        );
      })}
    </Root>
  );
};

export default SubclassSelector;