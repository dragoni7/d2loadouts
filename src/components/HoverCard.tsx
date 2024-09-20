import React, { useEffect, useState } from 'react';
import { styled, Typography, Box } from '@mui/material';
import { db } from '../store/db';
import {
  ManifestSubclass,
  ManifestAspect,
  ManifestStatPlug,
  ManifestPlug,
  ManifestArmorMod,
  ManifestArmorStatMod,
} from '../types/manifest-types';
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
} from '../styled';
import FadeIn from './FadeIn';

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
  const [hoverData, setHoverData] = useState<any | null>(null);
  const [hovered, setHovered] = useState<boolean>(false);

  async function getItemData() {
    if (!item) {
      return;
    }

    const itemHash = item.itemHash;

    try {
      let fullData;

      fullData = await db.manifestSubclass.where('itemHash').equals(itemHash).first();
      if (fullData) {
        setHoverData({ ...fullData, type: 'subclass' });
        return;
      }

      fullData = await db.manifestSubclassAspectsDef.where('itemHash').equals(itemHash).first();
      if (fullData) {
        setHoverData({ ...fullData, type: 'aspect' });
        return;
      }

      fullData = await db.manifestSubclassFragmentsDef.where('itemHash').equals(itemHash).first();
      if (fullData) {
        const sandboxPerk = await db.manifestSandboxPerkDef
          .where('name')
          .equals(fullData.name)
          .first();
        setHoverData({
          ...fullData,
          type: 'fragment',
          description: sandboxPerk ? sandboxPerk.description : 'No description available',
        });
        return;
      }

      fullData = await db.manifestSubclassModDef.where('itemHash').equals(itemHash).first();
      if (fullData) {
        setHoverData({ ...fullData, type: 'ability' });
        return;
      }

      fullData = await db.manifestArmorModDef.where('itemHash').equals(itemHash).first();
      if (fullData) {
        const sandboxPerk =
          fullData.perks && fullData.perks.length > 0
            ? await db.manifestSandboxPerkDef.where('itemHash').equals(fullData.perks[0]).first()
            : null;
        setHoverData({
          ...fullData,
          type: 'armorMod',
          description: sandboxPerk ? sandboxPerk.description : 'No description available',
        });
        return;
      }

      fullData = await db.manifestArmorStatModDef.where('itemHash').equals(itemHash).first();
      if (fullData) {
        const sandboxPerk =
          fullData.perks && fullData.perks.length > 0
            ? await db.manifestSandboxPerkDef.where('itemHash').equals(fullData.perks[0]).first()
            : null;
        setHoverData({
          ...fullData,
          type: 'armorStatMod',
          description: sandboxPerk ? sandboxPerk.description : 'No description available',
        });
        return;
      }
    } catch (error) {
      console.error('Error fetching item data:', error);
    }
  }

  useEffect(() => {
    getItemData().catch(console.error);
  }, []);

  const renderEnergyCapacity = (capacity: number) => {
    return (
      <Box display="flex" mt={1}>
        {[...Array(capacity)].map((_, index) => (
          <EnergyCapacitySquare key={index} />
        ))}
      </Box>
    );
  };

  const renderModContent = (data: any) => {
    return (
      <>
        <ModHoverCardHeader>
          <ModHoverCardTitleRow>
            <ModHoverCardTitle>{data.name}</ModHoverCardTitle>
            <HoverCardEnergyCostChip>{data.energyCost}</HoverCardEnergyCostChip>
          </ModHoverCardTitleRow>
          <HoverCardModTypeLabel>
            {data.type === 'armorMod' ? 'Armor Mod' : 'Armor Stat Mod'}
          </HoverCardModTypeLabel>
        </ModHoverCardHeader>
        <HoverCardDivider />
        <HoverCardModDescriptionContainer>
          <ModHoverCardIcon src={data.icon} alt={data.name} />
          <HoverCardModDescription>{data.description}</HoverCardModDescription>
        </HoverCardModDescriptionContainer>
      </>
    );
  };

  const renderDescription = () => {
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
                  <li key={index}>{`${mod.name}: ${mod.value > 0 ? '+' : ''}${mod.value}`}</li>
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
  };

  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      {children}
      {hovered && hoverData && (
        <FadeIn duration={160}>
          <HoverCardContainer>
            {hoverData.type === 'armorMod' || hoverData.type === 'armorStatMod' ? (
              renderDescription()
            ) : (
              <>
                <HoverCardTitle variant="h6">{hoverData.name}</HoverCardTitle>
                <HoverCardIcon
                  src={hoverData.secondaryIcon || hoverData.icon}
                  alt={hoverData.name}
                />
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
