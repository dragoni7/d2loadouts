import React from 'react';
import './ArmorCustomization.css';
import LoadoutArmor from './LoadoutArmor';
import EquipLoadout from '../../loadouts/components/EquipLoadout';
import { ManifestSubclass } from '../../../types/manifest-types';
import AbilitiesModification from '../../subclass/AbilitiesModification';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ShareLoadout from '../../loadouts/components/ShareLoadout';

interface ArmorCustomizationProps {
  onBackClick: () => void;
  screenshot: string;
  subclass: ManifestSubclass;
}

const TransparentButton = styled(Button)(({ theme }) => ({
  background: 'transparent',
  color: 'white',
  padding: theme.spacing(1, 2),
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
  },
}));

const ArmorCustomization: React.FC<ArmorCustomizationProps> = ({
  onBackClick,
  screenshot,
  subclass,
}) => {
  return (
    <div className="armor-customization-wrapper" style={{ backgroundImage: `url(${screenshot})` }}>
      <Box position="absolute" top={16} left={16} zIndex={1000}>
        <TransparentButton
          onClick={onBackClick}
          startIcon={<span style={{ fontSize: '1.2em' }}>←</span>}
        >
          Back
        </TransparentButton>
      </Box>
      <div className="left-panel">
        <LoadoutArmor />
        <EquipLoadout />
        <ShareLoadout /> {/* Add the ShareLoadout component here */}
      </div>
      <AbilitiesModification subclass={subclass} />
    </div>
  );
};

export default ArmorCustomization;
