import React, { useMemo, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Card, Grid, Typography, IconButton, Tooltip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { FilteredPermutation, DestinyArmor } from '../../types/d2l-types';
import { useDispatch } from 'react-redux';
import {
  resetLoadoutArmorMods,
  updateLoadoutArmor,
  updateRequiredStatMods,
} from '../../store/LoadoutReducer';
import ArmorIcon from '../../components/ArmorIcon';
import { STAT_MOD_HASHES, STATS } from '../../lib/bungie_api/constants';
import { db } from '../../store/db';
import { ManifestArmorStatMod } from '../../types/manifest-types';

interface StatsTableProps {
  permutations: FilteredPermutation[];
  onPermutationClick: () => void;
}

const StatsTableContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'center',
  position: 'relative',
  marginTop: theme.spacing(-1),
  gap: theme.spacing(1), // Add gap between children
}));

const CardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '440px',
  padding: theme.spacing(0, 1), // Add horizontal padding
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderTop: '5px solid',
  borderImageSource: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
  borderImageSlice: 1,
  borderRadius: 0,
  padding: theme.spacing(1),
  margin: theme.spacing(0.5, 0),
  width: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const ArmorRow = styled(Grid)(({ theme }) => ({
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
  width: '100%',
}));

const StatsRow = styled(Grid)(({ theme }) => ({
  justifyContent: 'center',
  width: '100%',
  marginBottom: theme.spacing(1),
}));

const ModsRow = styled(Grid)(({ theme }) => ({
  justifyContent: 'center',
  width: '100%',
}));
const StatValue = styled(Typography)({
  color: 'white',
});
const StatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: theme.spacing(0, 0.5),
}));

const StatIcon = styled('img')({
  width: 24,
  height: 24,
});

const ModIcon = styled('img')({
  width: 32,
  height: 32,
  margin: '0 2px',
});

const ArrowButton = styled(IconButton)(({ theme }) => ({
  height: 'auto',
  width: '30px',
  color: theme.palette.common.white,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  borderRadius: 0,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid white',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}));

const TableFooter = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  width: '100%',
  color: theme.palette.common.white,
  textAlign: 'center',
}));

const StatsTable: React.FC<StatsTableProps> = ({ permutations, onPermutationClick }) => {
  const dispatch = useDispatch();
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

  const [modIcons, setModIcons] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchModIcons = async () => {
      const iconMap: Record<string, string> = {};

      for (const [stat, hash] of Object.entries(STAT_MOD_HASHES)) {
        const mod = await db.manifestArmorStatModDef.where('itemHash').equals(hash).first();
        if (mod) {
          iconMap[stat.toLowerCase()] = mod.icon;
        }
      }

      setModIcons(iconMap);
    };

    fetchModIcons();
  }, []);

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

  return (
    <StatsTableContainer>
      <ArrowButton
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
        disabled={currentPage === 0}
      >
        <ChevronLeftIcon />
      </ArrowButton>
      <CardContainer>
        {paginatedData.map((perm, index) => (
          <StyledCard
            key={index}
            onClick={async () => {
              dispatch(resetLoadoutArmorMods());
              dispatch(updateLoadoutArmor(perm.permutation));
              let requiredMods: { mod: ManifestArmorStatMod; equipped: boolean }[] = [];

              for (const [stat, costs] of Object.entries(perm.modsArray)) {
                for (const cost of costs) {
                  const mod = await db.manifestArmorStatModDef
                    .where(stat + 'Mod')
                    .equals(cost)
                    .first();
                  if (mod !== undefined) requiredMods.push({ mod: mod, equipped: false });
                }
              }

              dispatch(updateRequiredStatMods(requiredMods));
              onPermutationClick();
            }}
          >
            <ArmorRow container spacing={1}>
              {perm.permutation.map((item, idx) => (
                <Grid item key={idx}>
                  <Tooltip title={`${item.name}\n${formatArmorStats(item)}`}>
                    <Box>
                      <ArmorIcon armor={item} size={64} />
                    </Box>
                  </Tooltip>
                </Grid>
              ))}
            </ArmorRow>
            <StatsRow container spacing={1}>
              {(STATS as (keyof FilteredPermutation['modsArray'])[]).map((stat) => (
                <Grid item key={stat}>
                  <StatContainer>
                    <StatIcon src={statIcons[stat]} alt={stat} />
                    <StatValue variant="body2">
                      {calculateTotal(perm, stat as keyof FilteredPermutation['modsArray'])}
                    </StatValue>
                  </StatContainer>
                </Grid>
              ))}
            </StatsRow>
            <ModsRow container spacing={1}>
              {(STATS as (keyof FilteredPermutation['modsArray'])[]).map((stat) =>
                perm.modsArray[stat].map((mod, idx) => (
                  <Grid item key={`${stat}-${idx}`}>
                    <ModIcon
                      src={modIcons[stat.toLowerCase() + '_mod'] || ''}
                      alt={mod.toString()}
                    />
                  </Grid>
                ))
              )}
            </ModsRow>
          </StyledCard>
        ))}
        <TableFooter>
          Page {currentPage + 1} of {Math.ceil(permutations.length / itemsPerPage)}
        </TableFooter>
      </CardContainer>
      <ArrowButton
        onClick={() =>
          setCurrentPage((prev) =>
            Math.min(prev + 1, Math.ceil(permutations.length / itemsPerPage) - 1)
          )
        }
        disabled={currentPage === Math.ceil(permutations.length / itemsPerPage) - 1}
      >
        <ChevronRightIcon />
      </ArrowButton>
    </StatsTableContainer>
  );
};

export default StatsTable;
