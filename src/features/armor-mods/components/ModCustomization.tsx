import { RootState } from '../../../store';
import ArmorConfig from './ArmorConfig';
import { Grid, Stack, styled, Typography } from '@mui/material';
import useArtificeMods from '../../../hooks/use-artifice-mods';
import useStatMods from '../../../hooks/use-stat-mods';
import RequiredMod from './RequiredMod';
import { useSelector } from 'react-redux';
import { ManifestArmorMod, ManifestArmorStatMod } from '../../../types/manifest-types';
import { BoldTitle } from '@/components/BoldTitle';

const StyledSubTitle = styled(Typography)(({ theme }) => ({
  opacity: 0.7,
  borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
  width: '90%',
}));

const ModCustomization: React.FC = () => {
  const currentConfig = useSelector((state: RootState) => state.loadoutConfig.loadout);
  const statMods: (ManifestArmorMod | ManifestArmorStatMod)[] = useStatMods();
  const artificeMods: (ManifestArmorMod | ManifestArmorStatMod)[] = useArtificeMods();
  const requiredMods = useSelector(
    (state: RootState) => state.loadoutConfig.loadout.requiredStatMods
  );

  return (
    <Grid container>
      <Grid item md={12} marginBottom={5} marginX={{ md: 5, lg: 8 }}>
        <BoldTitle>MOD CUSTOMIZATION</BoldTitle>
      </Grid>
      {requiredMods.length !== 0 ? (
        <>
          <Grid item md={12} marginLeft={{ md: 4, lg: 8 }}>
            <StyledSubTitle>REQUIRED MODS // CLICK MODS TO AUTO EQUIP</StyledSubTitle>
          </Grid>
          <Grid item md={10} marginBottom={6} marginLeft={{ md: 4, lg: 8 }}>
            <Stack direction="row" spacing={2}>
              {requiredMods.map((required) => (
                <RequiredMod required={required} />
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
