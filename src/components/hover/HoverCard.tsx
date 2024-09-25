import {
  EnergyCapacitySquare,
  ModHoverCardHeader,
  ModHoverCardTitleRow,
  ModHoverCardTitle,
  HoverCardEnergyCostChip,
  HoverCardModTypeLabel,
  HoverCardDivider,
  HoverCardModDescriptionContainer,
  ModHoverCardIcon,
  HoverCardModDescription,
  HoverCardDescription,
  HoverCardStatsList,
  HoverCardContainer,
  HoverCardTitle,
  HoverCardIcon,
} from '@/styled';
import {
  ManifestSubclass,
  ManifestAspect,
  ManifestStatPlug,
  ManifestPlug,
  ManifestArmorMod,
  ManifestArmorStatMod,
} from '@/types/manifest-types';
import { Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useState, useMemo } from 'react';
import FadeIn from '../FadeIn';
import { useHoverCardData } from './use-hover-card-data';

type HoverCardItem =
  | ManifestSubclass
  | ManifestAspect
  | ManifestStatPlug
  | ManifestPlug
  | ManifestArmorMod
  | ManifestArmorStatMod
  | undefined
  | null;

interface HoverCardProps {
  item: HoverCardItem;
  children: React.ReactNode;
}

const HoverCard: React.FC<HoverCardProps> = ({ item, children }) => {
  const hoverData = useHoverCardData(item);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const renderEnergyCapacity = useMemo(
    () => (capacity: number) => {
      return (
        <Box display="flex" mt={1}>
          {[...Array(capacity)].map((_, index) => (
            <EnergyCapacitySquare key={index} />
          ))}
        </Box>
      );
    },
    []
  );

  const renderModContent = useMemo(
    () => (data: any) => {
      return (
        <>
          <ModHoverCardHeader>
            <ModHoverCardTitleRow>
              <ModHoverCardTitle>{data.name.toLocaleUpperCase()}</ModHoverCardTitle>
              <HoverCardEnergyCostChip>{data.energyCost}</HoverCardEnergyCostChip>
            </ModHoverCardTitleRow>
            <HoverCardModTypeLabel>
              {data.type === 'armorMod' ? 'ARMOR MOD' : 'ARMOR STAT MOD'}
            </HoverCardModTypeLabel>
          </ModHoverCardHeader>
          <HoverCardDivider />
          <HoverCardModDescriptionContainer>
            <ModHoverCardIcon src={data.icon} alt={data.name} />
            <HoverCardModDescription>{data.description}</HoverCardModDescription>
          </HoverCardModDescriptionContainer>
        </>
      );
    },
    []
  );

  const renderDescription = useMemo(
    () => () => {
      if (!hoverData) return null;

      switch (hoverData.type) {
        case 'ability':
        case 'subclass':
          return <HoverCardDescription>{hoverData.description}</HoverCardDescription>;

        case 'aspect':
          return (
            <>
              <HoverCardDescription>{hoverData.flavorText}</HoverCardDescription>
              {renderEnergyCapacity(hoverData.energyCapacity)}
            </>
          );

        case 'fragment':
          return (
            <>
              <HoverCardDescription>{hoverData.description}</HoverCardDescription>
              <HoverCardStatsList>
                {[
                  { name: 'Mobility', value: hoverData.mobilityMod },
                  { name: 'Resilience', value: hoverData.resilienceMod },
                  { name: 'Recovery', value: hoverData.recoveryMod },
                  { name: 'Discipline', value: hoverData.disciplineMod },
                  { name: 'Intellect', value: hoverData.intellectMod },
                  { name: 'Strength', value: hoverData.strengthMod },
                ]
                  .filter((mod) => mod.value !== 0)
                  .map((mod, index) => (
                    <li key={index}>
                      <Stack direction="row" justifyContent="flex-start" spacing={1}>
                        {renderStatImage(mod.name)}
                        <Typography color={mod.value < 0 ? 'red' : 'green'}>{` ${
                          mod.value > 0 ? '+' : ''
                        }${mod.value}`}</Typography>
                      </Stack>
                    </li>
                  ))}
              </HoverCardStatsList>
            </>
          );

        case 'armorMod':
        case 'armorStatMod':
          return renderModContent(hoverData);

        default:
          return <HoverCardDescription></HoverCardDescription>;
      }
    },
    [hoverData, renderEnergyCapacity, renderModContent]
  );

  const renderStatImage = useMemo(
    () => (stat: string) => {
      switch (stat) {
        case 'Mobility':
          return <img src="/assets/mob.png" width="10%" alt="Mobility" />;
        case 'Recovery':
          return <img src="/assets/rec.png" width="10%" alt="Recovery" />;
        case 'Resilience':
          return <img src="/assets/res.png" width="10%" alt="Resilience" />;
        case 'Discipline':
          return <img src="/assets/disc.png" width="10%" alt="Discipline" />;
        case 'Intellect':
          return <img src="/assets/int.png" width="10%" alt="Intellect" />;
        case 'Strength':
          return <img src="/assets/str.png" width="10%" alt="Strength" />;
        default:
          return null;
      }
    },
    []
  );

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative' }}
    >
      {children}
      {isHovered && hoverData && (
        <FadeIn duration={160}>
          <HoverCardContainer>
            {hoverData.type === 'armorMod' || hoverData.type === 'armorStatMod' ? (
              renderDescription()
            ) : (
              <>
                <HoverCardTitle variant="h6">{hoverData.name.toLocaleUpperCase()}</HoverCardTitle>
                <HoverCardIcon
                  src={hoverData.secondaryIcon || hoverData.icon}
                  alt={hoverData.name}
                />
                <HoverCardDivider />
                {renderDescription()}
              </>
            )}
          </HoverCardContainer>
        </FadeIn>
      )}
    </div>
  );
};

export default HoverCard;
