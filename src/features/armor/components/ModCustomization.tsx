import { store } from '../../../store';
import ArmorConfig from './ArmorConfig';
import { Grid, Stack, styled, Typography } from '@mui/material';
import useArtificeMods from '../hooks/use-artifice-mods';
import useStatMods from '../hooks/use-stat-mods';
import RequiredMod from './RequiredMod';

const StyledTitle = styled(Typography)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
  fontSize: '28px',
  fontWeight: 'bold',
}));

const StyledSubTitle = styled(Typography)(({ theme }) => ({
  opacity: 0.7,
  borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
  width: '90%',
}));

const ModCustomization: React.FC = () => {
  const currentConfig = store.getState().loadoutConfig.loadout;
  const statMods = useStatMods();
  const artificeMods = useArtificeMods();
  const requiredMods = store.getState().loadoutConfig.loadout.requiredStatMods;

  return (
    <Grid container>
      <Grid item md={12} marginBottom={5} marginX={{ md: 5, lg: 8 }}>
        <StyledTitle>MOD CUSTOMIZATION</StyledTitle>
      </Grid>
      {requiredMods.length !== 0 ? (
        <>
          <Grid item md={12} marginLeft={{ md: 4, lg: 8 }}>
            <StyledSubTitle>REQUIRED MODS</StyledSubTitle>
          </Grid>
          <Grid item md={10} marginBottom={6} marginLeft={{ md: 4, lg: 8 }}>
            <Stack direction="row" spacing={2}>
              {requiredMods.map((mod, index) => (
                <RequiredMod mod={mod} index={index} />
              ))}
            </Stack>
          </Grid>
        </>
      ) : (
        <Grid item md={12} marginBottom={6} marginLeft={{ md: 4, lg: 8 }} />
      )}
      {/* Helmet */}
      <ArmorConfig armor={currentConfig.helmet} statMods={statMods} artificeMods={artificeMods} />
      {/* Gauntlets */}
      <ArmorConfig
        armor={currentConfig.gauntlets}
        statMods={statMods}
        artificeMods={artificeMods}
      />
      {/* Chest Armor */}
      <ArmorConfig
        armor={currentConfig.chestArmor}
        statMods={statMods}
        artificeMods={artificeMods}
      />
      {/* Leg Armor */}
      <ArmorConfig armor={currentConfig.legArmor} statMods={statMods} artificeMods={artificeMods} />
      {/* Class Armor */}
      <ArmorConfig
        armor={currentConfig.classArmor}
        statMods={statMods}
        artificeMods={artificeMods}
      />
    </Grid>
  );
};

export default ModCustomization;
