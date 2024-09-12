import { ManifestArmorStatMod } from '../../../types/manifest-types';
import { Tooltip, styled } from '@mui/material';
import { autoEquipStatMod } from '../mod-utils';
import { useDispatch } from 'react-redux';

interface RequiredModProps {
  required: { mod: ManifestArmorStatMod; equipped: boolean };
}

const RequiredModImg = styled('img')(({ theme }) => ({
  maxWidth: '71px',
  width: '58%',
  height: 'auto',
  cursor: 'pointer',
  backgroundColor: 'black',
}));

export default function RequiredMod({ required }: RequiredModProps) {
  const dispatch = useDispatch();

  function handleOnClick() {
    autoEquipStatMod(required.mod, dispatch);
  }

  return (
    <Tooltip title={required.mod.name}>
      <RequiredModImg
        src={required.mod.icon}
        onClick={handleOnClick}
        sx={{
          border: `3px solid ${required.equipped ? 'rgba(100,100,100,0.35)' : 'red'}`,
          '&:hover': { scale: 1.07 },
        }}
      />
    </Tooltip>
  );
}
