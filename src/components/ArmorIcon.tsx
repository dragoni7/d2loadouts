import { styled } from '@mui/system';
import { DestinyArmor } from '../types';

const MasterworkedIconContainer = styled('div')({
  border: '2px solid',
  borderImage: 'linear-gradient(to right, #FFD700, #FFFACD, #FFD700) 1',
  borderRadius: '0',
  padding: '2px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '5px',
});

const DefaultIconContainer = styled('div')({
  border: '2px solid white',
  borderRadius: '0',
  padding: '2px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '5px',
});

interface ArmorIconProps {
  armor: DestinyArmor;
  size?: number;
}

const ArmorIcon: React.FC<ArmorIconProps> = ({ armor, size }) => {
  return (
    <div>
      {armor.masterwork ? (
        <MasterworkedIconContainer>
          <img src={armor.icon} alt={armor.name} width={size} height={size} />
        </MasterworkedIconContainer>
      ) : (
        <DefaultIconContainer>
          <img src={armor.icon} alt={armor.name} width={size} height={size} />
        </DefaultIconContainer>
      )}
    </div>
  );
};

export default ArmorIcon;
