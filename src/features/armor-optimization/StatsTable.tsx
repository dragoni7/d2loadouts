import React, { useMemo, useState } from 'react';
import { styled } from '@mui/system';
import { FilteredPermutation } from '../../types';

interface StatsTableProps {
  permutations: FilteredPermutation[];
}

const noiseTexture =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA\
AAAECAYAAABGM/VAAAAKiElEQVR42mNkYGAw0r7Iz89fAxMWFgZGRlZ+//8\
DAwMA/FYUFNTT6AK5RUYwMDC4f/8/Hx8fDIBB/zAQIw//8fEGGRkUA/tscO\
yAgXg4I5j/P379wFhQUC/AADLEQTxllEqywAAAABJRU5ErkJggg==';

const StatsTableContainer = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  marginTop: '-10px',
});

const CardContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '80%',
});

const Card = styled('div')({
  borderTop: '5px solid #bdab6d',
  borderRadius: '0',
  padding: '10px',
  margin: '5px 0',
  width: '100%',
  backgroundColor: 'rgba(128, 128, 128, 0.5)',
  backgroundImage: `url(${noiseTexture})`,
  backgroundBlendMode: 'multiply',
  backdropFilter: 'blur(5px)',
  display: 'flex',
  flexDirection: 'column',
});

const CardRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '5px',
});

const CardCell = styled('div')({
  flex: 1,
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
});

const HorizontalStatsRow = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const StatContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 10px',
});

const StatIcon = styled('img')({
  width: '24px',
  height: '24px',
  marginBottom: '5px',
});

const StatValue = styled('div')({
  color: 'white',
  fontSize: '14px',
});

const StatCell = styled(CardCell)({
  fontWeight: 'bold',
});

const ArrowButton = styled('button')({
  cursor: 'pointer',
  fontSize: '24px',
  color: 'white',
  userSelect: 'none',
  background: 'rgba(0, 0, 0, 0.1)',
  border: 'none',
  outline: 'none',
  height: '100%',
  width: '5%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0',
  transition: 'border 0.2s',
  '&:hover': {
    opacity: 0.5,
    border: '1px solid white',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

const LeftArrowButton = styled(ArrowButton)({
  position: 'absolute',
  left: '0',
  marginLeft: '5px',
});

const RightArrowButton = styled(ArrowButton)({
  position: 'absolute',
  right: '0',
  marginRight: '5px',
});

const Icon = styled('img')({
  width: '48px',
  height: '48px',
});

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

const ItemName = styled('div')({
  display: 'none',
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '5px',
  borderRadius: '3px',
  whiteSpace: 'nowrap',
  zIndex: 1,
});

const HoverContainer = styled('div')({
  position: 'relative',
  '&:hover div': {
    display: 'block',
  },
});

const TableFooter = styled('div')({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: '10px',
  width: '100%',
  color: 'white',
});

const StatsTable: React.FC<StatsTableProps> = ({ permutations }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  const paginatedData = useMemo(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return permutations.slice(start, end);
  }, [currentPage, permutations]);

  const calculateTotal = (
    perm: FilteredPermutation,
    stat: keyof FilteredPermutation['modsArray']
  ) => {
    const baseSum = perm.permutation.reduce((sum, item) => sum + (item[stat] || 0), 0);
    const modSum = perm.modsArray[stat]?.reduce((sum, mod) => sum + mod, 0) || 0;
    return baseSum + modSum;
  };

  const statIcons: Record<keyof FilteredPermutation['modsArray'], string> = {
    mobility:
      'https://www.bungie.net/common/destiny2_content/icons/e26e0e93a9daf4fdd21bf64eb9246340.png',
    resilience:
      'https://www.bungie.net/common/destiny2_content/icons/202ecc1c6febeb6b97dafc856e863140.png',
    recovery:
      'https://www.bungie.net/common/destiny2_content/icons/128eee4ee7fc127851ab32eac6ca91cf.png',
    discipline:
      'https://www.bungie.net/common/destiny2_content/icons/79be2d4adef6a19203f7385e5c63b45b.png',
    intellect:
      'https://www.bungie.net/common/destiny2_content/icons/d1c154469670e9a592c9d4cbdcae5764.png',
    strength:
      'https://www.bungie.net/common/destiny2_content/icons/ea5af04ccd6a3470a44fd7bb0f66e2f7.png',
  };

  return (
    <StatsTableContainer>
      <LeftArrowButton
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
        disabled={currentPage === 0}
      >
        &#9664;
      </LeftArrowButton>
      <CardContainer>
        {paginatedData.map((perm, index) => (
          <Card key={index}>
            <CardRow>
              {perm.permutation.map((item, idx) => (
                <CardCell key={idx}>
                  <HoverContainer>
                    {item.masterwork ? (
                      <MasterworkedIconContainer>
                        <Icon src={item.icon} alt={item.name} />
                      </MasterworkedIconContainer>
                    ) : (
                      <DefaultIconContainer>
                        <Icon src={item.icon} alt={item.name} />
                      </DefaultIconContainer>
                    )}
                    <ItemName>{item.name}</ItemName>
                  </HoverContainer>
                </CardCell>
              ))}
            </CardRow>
            <HorizontalStatsRow>
              {(
                [
                  'mobility',
                  'resilience',
                  'recovery',
                  'discipline',
                  'intellect',
                  'strength',
                ] as (keyof FilteredPermutation['modsArray'])[]
              ).map((stat) => (
                <StatContainer key={stat}>
                  <StatIcon src={statIcons[stat]} alt={stat} />
                  <StatValue>
                    {calculateTotal(perm, stat as keyof FilteredPermutation['modsArray'])}
                  </StatValue>
                </StatContainer>
              ))}
            </HorizontalStatsRow>
            {Object.keys(perm.modsArray).map((stat, idx) => {
              const mods = perm.modsArray[stat as keyof FilteredPermutation['modsArray']];
              return mods.length > 0 ? (
                <CardRow key={idx}>
                  <StatCell>{stat.charAt(0).toUpperCase() + stat.slice(1)} Mods</StatCell>
                  <CardCell>{mods.join(', ')}</CardCell>
                </CardRow>
              ) : null;
            })}
          </Card>
        ))}
        <TableFooter>
          Page {currentPage + 1} of {Math.ceil(permutations.length / itemsPerPage)}
        </TableFooter>
      </CardContainer>
      <RightArrowButton
        onClick={() =>
          setCurrentPage((prev) =>
            Math.min(prev + 1, Math.ceil(permutations.length / itemsPerPage) - 1)
          )
        }
        disabled={currentPage === Math.ceil(permutations.length / itemsPerPage) - 1}
      >
        &#9654;
      </RightArrowButton>
    </StatsTableContainer>
  );
};

export default StatsTable;
