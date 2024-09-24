import { ManifestArmorStatMod } from '../../../types/manifest-types';
import { Tooltip, styled } from '@mui/material';
import { autoEquipStatMod } from '../mod-utils';
import { useDispatch } from 'react-redux';
import { D2LTooltip } from '@/components/D2LTooltip';
import { animated, useSpring } from 'react-spring';

interface RequiredModProps {
  required: { mod: ManifestArmorStatMod; equipped: boolean };
}

const RequiredModImg = styled(animated.img)(({ theme }) => ({
  maxWidth: '71px',
  width: '58%',
  height: 'auto',
  cursor: 'pointer',
  backgroundColor: 'black',
}));

export default function RequiredMod({ required }: RequiredModProps) {
  const dispatch = useDispatch();
  const [border, api] = useSpring(
    () => ({
      from: { border: '3px solid rgba(100, 10, 10, 1)' },
      to: async (next) => {
        await next({ border: '3px solid rgba(100, 10, 10, 0)' });
        await next({ border: '3px solid rgba(100, 10, 10, 1)' });
      },
      loop: true,

      config: { duration: 1900, tension: 120, friction: 14 },
    }),
    []
  );

  function handleOnClick() {
    autoEquipStatMod(required.mod, dispatch);
  }

  return (
    <D2LTooltip maxWidth={300} title={required.mod.name} arrow>
      <RequiredModImg
        src={required.mod.icon}
        onClick={handleOnClick}
        style={border}
        sx={{
          '&:hover': { scale: 1.07 },
        }}
      />
    </D2LTooltip>
  );
}
