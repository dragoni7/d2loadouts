import { useState } from 'react';
import { ManifestArmorStatMod } from '../../../types/manifest-types';
import { Tooltip, styled } from '@mui/material';
import { autoEquipStatMod } from '../mod-utils';
import { useDispatch } from 'react-redux';

interface RequiredModProps {
  mod: ManifestArmorStatMod;
  index: number;
}

const RequiredModImg = styled('img')(({ theme }) => ({
  maxWidth: '71px',
  width: '58%',
  height: 'auto',
  cursor: 'pointer',
  backgroundColor: 'black',
}));

export default function RequiredMod({ mod, index }: RequiredModProps) {
  const [equipped, setEquipped] = useState<boolean>(false);

  const dispatch = useDispatch();

  function handleOnClick() {
    setEquipped(autoEquipStatMod(mod, dispatch));
  }

  return (
    <Tooltip title={mod.name}>
      <RequiredModImg
        src={mod.icon}
        onClick={handleOnClick}
        sx={{
          border: `3px solid ${equipped ? 'rgba(100,100,100,0.35)' : 'red'}`,
          '&:hover': { scale: 1.07 },
        }}
      />
    </Tooltip>
  );
}
