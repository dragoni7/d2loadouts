import { Box, styled } from '@mui/system';
import { DestinyArmor } from '../types/d2l-types';

const MasterworkedIconContainer = styled('img')({
  border: '2px solid',
  borderImage: 'linear-gradient(to right, #FFD700, #FFFACD, #FFD700) 1',
  borderRadius: '0',
  padding: '2px',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '5px',
});

const DefaultIconContainer = styled('img')({
  border: '2px solid white',
  borderRadius: '0',
  padding: '2px',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '5px',
});

interface ArmorIconProps {
  armor: DestinyArmor;
  size?: number;
}

const ArmorIcon: React.FC<ArmorIconProps> = ({ armor, size }) => {
  return armor.masterwork ? (
    <MasterworkedIconContainer src={armor.icon} alt={armor.name} width={size} height={size} />
  ) : (
    <DefaultIconContainer src={armor.icon} alt={armor.name} width={size} height={size} />
  );
};

export default ArmorIcon;
