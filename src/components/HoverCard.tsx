import React, { useState } from 'react';
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

const HoverCardContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '-100%',
  right: '100%',
  zIndex: 1600,
  padding: theme.spacing(1.5),
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  borderRadius: '0px',
  boxShadow: theme.shadows[10],
  width: '300px',
  pointerEvents: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  fontFamily: 'Arial, sans-serif',
}));

const HoverCardTitle = styled(Typography)({
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  fontSize: '16px',
  textAlign: 'center',
  color: '#ffffff',
});

const HoverCardIcon = styled('img')({
  width: '100%',
  height: 'auto',
  objectFit: 'contain',
  margin: '8px 0',
});

const HoverCardDescription = styled(Typography)({
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  color: '#cccccc',
});

const HoverCardStatsList = styled('ul')({
  margin: '4px 0',
  paddingLeft: '20px',
  color: '#cccccc',
  listStyleType: 'none',
});

const EnergyCapacitySquare = styled('div')(({ theme }) => ({
  width: '12px',
  height: '12px',
  backgroundColor: 'white',
  opacity: 0.3,
  marginRight: '2px',
}));

const ModHoverCardHeader = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '8px',
});

const ModHoverCardTitleRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ModHoverCardIcon = styled('img')({
  width: '32px',
  height: '32px',
  marginRight: '8px',
});

const ModHoverCardTitle = styled(Typography)({
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  fontSize: '18px',
  color: '#ffffff',
  flexGrow: 1,
});

const EnergyCostChip = styled(Box)(({ theme }) => ({
  color: '#ffffff',
  padding: '2px 6px',
  fontSize: '24px',
  fontWeight: 'bold',
}));

const ModTypeLabel = styled(Typography)({
  fontSize: '12px',
  color: '#aaaaaa',
  marginTop: '4px',
});

const Divider = styled('div')({
  width: '100%',
  height: '1px',
  background:
    'linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0))',
  margin: '8px 0',
});

const ModDescriptionContainer = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
});

const ModDescription = styled(Typography)({
  fontSize: '14px',
  color: '#cccccc',
  flexGrow: 1,
});

const HoverCard: React.FC<HoverCardProps> = ({ item, children }) => {
  const [hoverData, setHoverData] = useState<any | null>(null);

  const handleMouseEnter = async () => {
    if (!item) {
      console.log('No item provided');
      return;
    }

    const itemHash = item.itemHash;
    console.log('Hovering over item with itemHash:', itemHash);

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

      console.log('Item not found in any table');
    } catch (error) {
      console.error('Error fetching item data:', error);
    }
  };

  const handleMouseLeave = () => {
    setHoverData(null);
  };

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
            <EnergyCostChip>{data.energyCost}</EnergyCostChip>
          </ModHoverCardTitleRow>
          <ModTypeLabel>{data.type === 'armorMod' ? 'Armor Mod' : 'Armor Stat Mod'}</ModTypeLabel>
        </ModHoverCardHeader>
        <Divider />
        <ModDescriptionContainer>
          <ModHoverCardIcon src={data.icon} alt={data.name} />
          <ModDescription>{data.description}</ModDescription>
        </ModDescriptionContainer>
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative' }}
    >
      {children}
      {hoverData && (
        <HoverCardContainer>
          {hoverData.type === 'armorMod' || hoverData.type === 'armorStatMod' ? (
            renderDescription()
          ) : (
            <>
              <HoverCardTitle variant="h6">{hoverData.name}</HoverCardTitle>
              <HoverCardIcon src={hoverData.secondaryIcon || hoverData.icon} alt={hoverData.name} />
              {renderDescription()}
            </>
          )}
        </HoverCardContainer>
      )}
    </div>
  );
};

export default HoverCard;
