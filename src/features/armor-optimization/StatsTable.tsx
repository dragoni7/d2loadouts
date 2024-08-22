import React, { useMemo, useState } from 'react';
import { styled } from '@mui/system';
import { FilteredPermutation, Plug, DestinyArmor } from '../../types/d2l-types';
import { useDispatch } from 'react-redux';
import {
  resetLoadoutArmorMods,
  updateLoadoutArmor,
  updateRequiredStatMods,
} from '../../store/LoadoutReducer';
import ArmorIcon from '../../components/ArmorIcon';
import { STAT_HASH, STATS } from '../../lib/bungie_api/constants';
import { getStatModByCost } from '../../lib/bungie_api/utils';
import { ManifestArmorStatMod } from '../../types/manifest-types';
import { db } from '../../store/db';

interface StatsTableProps {
  permutations: FilteredPermutation[];
  onPermutationClick: () => void;
}

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
  backgroundBlendMode: 'multiply',
  backdropFilter: 'blur(5px)',
  display: 'flex',
  flexDirection: 'row',
});

const StatsColumn = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  marginRight: '20px',
  flex: '0 0 auto',
});

const ContentColumn = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});

const IconsRow = styled('div')({
  display: 'flex',
  justifyContent: 'flex-start',
  marginBottom: '10px',
});

const CardCell = styled('div')({
  flex: 0,
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  margin: '0 5px',
});

const StatContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  margin: '5px 0',
});

const StatIcon = styled('img')({
  width: '20px',
  height: '20px',
  marginRight: '5px',
});

const StatValue = styled('div')({
  color: 'white',
  fontSize: '14px',
  width: '30px',
  textAlign: 'right',
});

const ModsRow = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: '5px',
});

const ModLabel = styled('span')({
  fontWeight: 'bold',
  marginRight: '5px',
  color: 'white',
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

const ItemInfo = styled('div')({
  position: 'fixed',
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  color: 'white',
  padding: '10px',
  borderRadius: '5px',
  whiteSpace: 'pre-wrap',
  zIndex: 1000,
  textAlign: 'left',
  fontSize: '12px',
  maxWidth: '200px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
});

const HoverContainer = styled('div')({
  position: 'relative',
});

const TableFooter = styled('div')({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: '10px',
  width: '100%',
  color: 'white',
});

const StatsTable: React.FC<StatsTableProps> = ({ permutations, onPermutationClick }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const [hoverInfo, setHoverInfo] = useState<{ content: string; x: number; y: number } | null>(
    null
  );
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

  const formatArmorStats = (armor: DestinyArmor) => {
    return STATS.map((stat) => {
      const statKey = stat as keyof DestinyArmor;
      return `${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${armor[statKey] || 0}`;
    }).join('\n');
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>, item: DestinyArmor) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverInfo({
      content: `${item.name}\n${formatArmorStats(item)}`,
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY,
    });
  };

  const handleMouseLeave = () => {
    setHoverInfo(null);
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
          <Card
            key={index}
            onClick={() => {
              dispatch(resetLoadoutArmorMods());
              dispatch(updateLoadoutArmor(perm.permutation));
              let requiredMods: ManifestArmorStatMod[] = [];

              Object.entries(perm.modsArray).forEach(([stat, costs]) => {
                costs.forEach(async (cost: number) => {
                  const mod = await db.manifestArmorStatModDef
                    .where(stat + 'Mod')
                    .equals(cost)
                    .first();
                  if (mod !== undefined) requiredMods.push(mod);
                });
              });
              dispatch(updateRequiredStatMods(requiredMods));
              onPermutationClick();
            }}
          >
            <StatsColumn>
              {(STATS as (keyof FilteredPermutation['modsArray'])[]).map((stat) => (
                <StatContainer key={stat}>
                  <StatIcon src={statIcons[stat]} alt={stat} />
                  <StatValue>
                    {calculateTotal(perm, stat as keyof FilteredPermutation['modsArray'])}
                  </StatValue>
                </StatContainer>
              ))}
            </StatsColumn>
            <ContentColumn>
              <IconsRow>
                {perm.permutation.map((item, idx) => (
                  <CardCell key={idx}>
                    <HoverContainer
                      onMouseEnter={(e) => handleMouseEnter(e, item)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <ArmorIcon armor={item} size={64} />
                    </HoverContainer>
                  </CardCell>
                ))}
              </IconsRow>
              {Object.entries(perm.modsArray).map(([stat, mods]) =>
                mods.length > 0 ? (
                  <ModsRow key={stat}>
                    <ModLabel>{stat.charAt(0).toUpperCase() + stat.slice(1)} Mods:</ModLabel>
                    <span>{mods.join(', ')}</span>
                  </ModsRow>
                ) : null
              )}
            </ContentColumn>
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
      {hoverInfo && (
        <ItemInfo style={{ left: hoverInfo.x, top: hoverInfo.y }}>{hoverInfo.content}</ItemInfo>
      )}
    </StatsTableContainer>
  );
};

export default StatsTable;
