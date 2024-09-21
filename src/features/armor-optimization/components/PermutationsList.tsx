import React, { useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  Stack,
  Fade,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  FilteredPermutation,
  Armor,
  StatName,
  StatModifiers,
  FragmentStatModifications,
} from '../../../types/d2l-types';
import ArmorIcon from '../../../components/ArmorIcon';
import { STATS } from '../../../lib/bungie_api/constants';
import useStatMods from '../../../hooks/use-stat-mods';
import useArtificeMods from '../../../hooks/use-artifice-mods';
import { statIcons } from '@/util/constants';
import { D2LTooltip } from '@/components/D2LTooltip';

interface PermutationsListProps {
  permutations: FilteredPermutation[];
  fragmentStatModifications: FragmentStatModifications;
  onPermutationClick: (filteredPermutation: FilteredPermutation) => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  borderTop: '5px solid',
  borderImageSource: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
  borderImageSlice: 1,
  borderRadius: 0,
  padding: theme.spacing(1),
  height: '21.5vh',
  [theme.breakpoints.between('lg', 'xl')]: {
    height: '18.5vh',
  },
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(10px)',
  alignItems: 'center',
  justifyContent: 'center',
  ':hover': {
    cursor: 'pointer',
  },
}));

const ArrowButton = styled(IconButton)(({ theme }) => ({
  height: '100%',
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

const PageCount = styled(Typography)(({ theme }) => ({
  width: '100%',
  color: theme.palette.common.white,
  textAlign: 'center',
}));

const PermutationsList: React.FC<PermutationsListProps> = ({
  permutations,
  fragmentStatModifications,
  onPermutationClick,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const theme = useTheme();
  const statMods = useStatMods();
  const artificeMods = useArtificeMods();

  const paginatedData = useMemo(() => {
    const start = currentPage * 3;
    const end = start + 3;
    return permutations.slice(start, end);
  }, [currentPage, permutations]);

  const calculateTotal = (perm: FilteredPermutation, stat: StatName) => {
    const baseSum = perm.permutation.reduce((sum, item) => sum + (item[stat] || 0), 0);
    const modSum = perm.modsArray[stat]?.reduce((sum, mod) => sum + mod, 0) || 0;
    const fragmentMod = fragmentStatModifications[stat] || 0;
    return baseSum + modSum + fragmentMod;
  };

  const formatArmorStats = (armor: Armor) => {
    return STATS.map((stat) => {
      const statKey = stat as keyof Armor;
      return ` ${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${armor[statKey] || 0}`;
    }).join('\n');
  };

  function renderStatModCount(perm: FilteredPermutation, stat: StatName, modAmount: number) {
    const matchedStatMod =
      modAmount !== 3
        ? statMods.find((mod) => mod[(stat + 'Mod') as StatModifiers] === modAmount)
        : artificeMods.find((mod) => mod[(stat + 'Mod') as StatModifiers] === modAmount);

    return perm.modsArray[stat].find((mod) => mod === modAmount) ? (
      <Stack sx={{ width: '2.5vw' }} spacing={0}>
        <D2LTooltip
          arrow
          maxWidth={300}
          title={
            matchedStatMod?.name +
            ' x' +
            perm.modsArray[stat].filter((mod) => mod === modAmount).length
          }
          placement="bottom"
        >
          <img src={matchedStatMod?.icon} alt={matchedStatMod?.name} />
        </D2LTooltip>

        <Grid
          container
          rowSpacing={0.5}
          columnSpacing={0}
          justifyContent="center"
          sx={{ paddingTop: 0.5 }}
        >
          {perm.modsArray[stat]
            .filter((mod) => mod === modAmount)
            .map(() => (
              <Grid item md={4} display="flex" justifyContent="center" alignItems="center">
                <Box
                  sx={{
                    backgroundColor: 'white',
                    opacity: 0.3,
                    width: '1.2vh',
                    height: '1.2vh',
                  }}
                />
              </Grid>
            ))}
        </Grid>
      </Stack>
    ) : (
      false
    );
  }

  return permutations.length > 0 ? (
    <Grid container justifyContent="center" spacing={1}>
      <Grid item md={12}>
        <PageCount>
          Page {currentPage + 1} of {Math.ceil(permutations.length / 3)}
        </PageCount>
      </Grid>
      <Grid item md={1}>
        <ArrowButton
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          <ChevronLeftIcon />
        </ArrowButton>
      </Grid>
      <Grid item md={9}>
        <Stack spacing={1}>
          {paginatedData.map((perm, index) => (
            <StyledCard
              key={index}
              onClick={async () => {
                onPermutationClick(perm);
              }}
            >
              <Stack justifyContent="center" alignItems="center" height="100%">
                <Grid container spacing={0} sx={{ justifyContent: 'center', width: '100%' }}>
                  {perm.permutation.map((item, idx) => (
                    <Grid item md={2} key={idx}>
                      <D2LTooltip
                        TransitionComponent={Fade}
                        title={`${item.name}\n${formatArmorStats(item)}`}
                        placement="left"
                        arrow
                        followCursor
                      >
                        <Box>
                          <ArmorIcon armor={item} />
                        </Box>
                      </D2LTooltip>
                    </Grid>
                  ))}
                </Grid>
                <Grid
                  container
                  spacing={1}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ justifyContent: 'center', width: '100%', marginBottom: theme.spacing(0.5) }}
                >
                  {(STATS as StatName[]).map((stat) => (
                    <Grid item md={1} key={stat}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img width={24} height={24} src={statIcons[stat]} alt={stat} />
                        <Typography color="white" variant="body2">
                          {calculateTotal(perm, stat)}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Stack direction="row" alignItems="start" justifyContent="center" spacing={0.5}>
                  {(STATS as StatName[]).map((stat) =>
                    perm.modsArray[stat].length !== 0 ? (
                      <>
                        {renderStatModCount(perm, stat, 10)}
                        {renderStatModCount(perm, stat, 5)}
                        {renderStatModCount(perm, stat, 3)}
                      </>
                    ) : (
                      false
                    )
                  )}
                </Stack>
              </Stack>
            </StyledCard>
          ))}
        </Stack>
      </Grid>
      <Grid item md={1}>
        <ArrowButton
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(permutations.length / 3) - 1))
          }
          disabled={currentPage === Math.ceil(permutations.length / 3) - 1}
        >
          <ChevronRightIcon />
        </ArrowButton>
      </Grid>
      <Grid item md={12}>
        <PageCount>
          Page {currentPage + 1} of {Math.ceil(permutations.length / 3)}
        </PageCount>
      </Grid>
    </Grid>
  ) : (
    <Box
      sx={{
        padding: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(5px)',
        borderRadius: 0,
        border: '1px solid rgba(255, 255, 255, 0.3)',
        width: '80%',
        height: '80%',
        textAlign: 'center',
        display: 'flex',
      }}
    >
      <Typography typography="h5" margin="auto">
        NO COMBINATIONS FOUND
        <br />
        <ul style={{ textAlign: 'start' }}>
          <li>Try selecting another Exotic</li>
          <li>Try changing desired stats / fragments</li>
        </ul>
      </Typography>
    </Box>
  );
};

export default PermutationsList;
