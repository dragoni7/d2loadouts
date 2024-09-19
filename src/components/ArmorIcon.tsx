import { styled } from '@mui/material';
import { DestinyArmor } from '../types/d2l-types';

interface ArmorIconProps {
  armor: DestinyArmor;
  size?: number | string;
}

const MasterworkedArmorIconContainer = styled('img')({
  border: '2px solid',
  borderImage: 'linear-gradient(to right, #FFD700, #FFFACD, #FFD700) 1',
  borderRadius: '0',
  maxWidth: '91px',
  height: 'auto',
});

const DefaultArmorIconContainer = styled('img')({
  border: '2px solid white',
  borderRadius: '0',
  maxWidth: '91px',
  height: 'auto',
});

const ArmorIcon: React.FC<ArmorIconProps> = ({ armor, size = '64%' }) => {
  return armor.masterwork ? (
    <MasterworkedArmorIconContainer src={armor.icon} alt={armor.name} width={size} />
  ) : (
    <DefaultArmorIconContainer src={armor.icon} alt={armor.name} width={size} />
  );
};

export default ArmorIcon;
