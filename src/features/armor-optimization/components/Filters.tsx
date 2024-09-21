import { RootState } from '@/store';
import { updateAssumeMasterwork, updateAssumeExoticArtifice } from '@/store/DashboardReducer';
import { FormGroup, FormControlLabel, Switch } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function Filters() {
  const { assumeMasterwork, assumeExoticArtifice } = useSelector(
    (state: RootState) => state.dashboard
  );

  const dispatch = useDispatch();
  return (
    <FormGroup
      sx={{
        padding: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      <FormControlLabel
        control={
          <Switch checked={assumeMasterwork} onChange={() => dispatch(updateAssumeMasterwork())} />
        }
        label="Assume Armor Masterworked"
      />
      <FormControlLabel
        control={
          <Switch
            checked={assumeExoticArtifice}
            onChange={() => dispatch(updateAssumeExoticArtifice())}
          />
        }
        label="Assume Exotics are Artifice"
      />
    </FormGroup>
  );
}
