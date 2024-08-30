import { styled } from '@mui/system';
import { DestinyArmor } from '../types/d2l-types';

const MasterworkedIconContainer = styled('img')({
  border: '2px solid',
  borderImage: 'linear-gradient(to right, #FFD700, #FFFACD, #FFD700) 1',
  borderRadius: '0',
  maxWidth: '91px',
  height: 'auto',
});

const DefaultIconContainer = styled('img')({
  border: '2px solid white',
  borderRadius: '0',
  maxWidth: '91px',
  height: 'auto',
});

interface ArmorIconProps {
  armor: DestinyArmor;
  size?: number | string;
}

const ArmorIcon: React.FC<ArmorIconProps> = ({ armor, size = '64%' }) => {
  return armor.masterwork ? (
    <MasterworkedIconContainer src={armor.icon} alt={armor.name} width={size} />
  ) : (
    <DefaultIconContainer src={armor.icon} alt={armor.name} width={size} />
  );
};

export default ArmorIcon;
