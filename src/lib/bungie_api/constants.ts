import { armor } from '../../types/d2l-types';
import { ManifestPlug, ManifestAspect, ManifestStatPlug } from '../../types/manifest-types';

export enum API_CREDENTIALS {
  API_KEY = import.meta.env.VITE_API_KEY,

  CLIENT_ID = import.meta.env.VITE_CLIENT_ID,

  CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET,
}

export const EMPTY_MANIFEST_PLUG: ManifestPlug = {
  perkName: '',
  perkDescription: '',
  perkIcon: '',
  category: 0,
  isOwned: false,
  itemHash: 0,
  name: '',
  icon: '',
};

export const EMPTY_ASPECT: ManifestAspect = {
  energyCapacity: 0,
  perkName: '',
  perkDescription: '',
  perkIcon: '',
  category: 0,
  isOwned: false,
  itemHash: 0,
  name: '',
  icon: '',
};

export const EMPTY_FRAGMENT: ManifestStatPlug = {
  mobilityMod: 0,
  resilienceMod: 0,
  recoveryMod: 0,
  disciplineMod: 0,
  intellectMod: 0,
  strengthMod: 0,
  perkName: '',
  perkDescription: '',
  perkIcon: '',
  category: 0,
  isOwned: false,
  itemHash: 0,
  name: '',
  icon: '',
};

export const COLLECTIBLE_OWNED: number[] = [0, 16, 64, 80];

export const STATS: string[] = [
  'mobility',
  'resilience',
  'recovery',
  'discipline',
  'intellect',
  'strength',
];

export enum ARMOR {
  HELMET = 'helmet',
  GAUNTLETS = 'gauntlets',
  CHEST_ARMOR = 'chestArmor',
  LEG_ARMOR = 'legArmor',
  CLASS_ARMOR = 'classArmor',
}

export const ARMOR_ARRAY: armor[] = [
  ARMOR.HELMET,
  ARMOR.GAUNTLETS,
  ARMOR.CHEST_ARMOR,
  ARMOR.LEG_ARMOR,
  ARMOR.CLASS_ARMOR,
];

export module EMPTY_SOCKETS {
  export const HELMET = [
    {
      itemHash: 1980618587,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2487827355,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://bungie.net/common/destiny2_content/icons/80d2e1a2a76fdea2752beb141084dcf8.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 1078080765,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2912171003,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://bungie.net/common/destiny2_content/icons/5af87586c92c673aa783543d8fd2d8fd.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 1078080765,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2912171003,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://bungie.net/common/destiny2_content/icons/5af87586c92c673aa783543d8fd2d8fd.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 1078080765,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2912171003,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://bungie.net/common/destiny2_content/icons/5af87586c92c673aa783543d8fd2d8fd.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 4173924323,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 3773173029,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://bungie.net/common/destiny2_content/icons/20133fd6a0df6abaa14bbe5bb3e19856.png',
      energyCost: 0,
      collectibleHash: -1,
    },
  ];

  export const GAUNTLETS = [
    {
      itemHash: 1980618587,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2487827355,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://bungie.net/common/destiny2_content/icons/80d2e1a2a76fdea2752beb141084dcf8.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 3820147479,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2912171003,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://www.bungie.net/common/destiny2_content/icons/9f217880c3b0cfa3cb17ac4929a99e18.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 3820147479,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2912171003,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://www.bungie.net/common/destiny2_content/icons/9f217880c3b0cfa3cb17ac4929a99e18.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 3820147479,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2912171003,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://www.bungie.net/common/destiny2_content/icons/9f217880c3b0cfa3cb17ac4929a99e18.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 4173924323,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 3773173029,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://bungie.net/common/destiny2_content/icons/20133fd6a0df6abaa14bbe5bb3e19856.png',
      energyCost: 0,
      collectibleHash: -1,
    },
  ];

  export const CHEST_ARMOR = [
    {
      itemHash: 1980618587,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2487827355,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://bungie.net/common/destiny2_content/icons/80d2e1a2a76fdea2752beb141084dcf8.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 1803434835,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2912171003,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://www.bungie.net/common/destiny2_content/icons/66684f6d81e57eb6cc60fc9fb56168e1.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 1803434835,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2912171003,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://www.bungie.net/common/destiny2_content/icons/66684f6d81e57eb6cc60fc9fb56168e1.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 1803434835,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2912171003,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://www.bungie.net/common/destiny2_content/icons/66684f6d81e57eb6cc60fc9fb56168e1.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 4173924323,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 3773173029,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://bungie.net/common/destiny2_content/icons/20133fd6a0df6abaa14bbe5bb3e19856.png',
      energyCost: 0,
      collectibleHash: -1,
    },
  ];

  export const LEG_ARMOR = [
    {
      itemHash: 1980618587,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2487827355,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://bungie.net/common/destiny2_content/icons/80d2e1a2a76fdea2752beb141084dcf8.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 2269836811,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2912171003,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://www.bungie.net/common/destiny2_content/icons/915767bb1f39b166087173954d600f36.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 2269836811,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2912171003,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://www.bungie.net/common/destiny2_content/icons/915767bb1f39b166087173954d600f36.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 2269836811,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2912171003,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://www.bungie.net/common/destiny2_content/icons/915767bb1f39b166087173954d600f36.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 4173924323,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 3773173029,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://bungie.net/common/destiny2_content/icons/20133fd6a0df6abaa14bbe5bb3e19856.png',
      energyCost: 0,
      collectibleHash: -1,
    },
  ];

  export const CLASS_ARMOR = [
    {
      itemHash: 1980618587,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2487827355,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://bungie.net/common/destiny2_content/icons/80d2e1a2a76fdea2752beb141084dcf8.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 3200810407,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2912171003,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://www.bungie.net/common/destiny2_content/icons/c5f0d737d0cdaf3e1e45167a2096a07c.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 3200810407,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2912171003,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://www.bungie.net/common/destiny2_content/icons/c5f0d737d0cdaf3e1e45167a2096a07c.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 3200810407,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 2912171003,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://www.bungie.net/common/destiny2_content/icons/c5f0d737d0cdaf3e1e45167a2096a07c.jpg',
      energyCost: 0,
      collectibleHash: -1,
    },
    {
      itemHash: 4173924323,
      perkName: '',
      perkDescription: '',
      perkIcon: '',
      category: 3773173029,
      isOwned: true,
      name: 'Empty Mod Socket',
      icon: 'https://bungie.net/common/destiny2_content/icons/20133fd6a0df6abaa14bbe5bb3e19856.png',
      energyCost: 0,
      collectibleHash: -1,
    },
  ];
}

export enum ERRORS {
  INVALID_EQUIP_LOCATION = 1671,
  CANNOT_FIND_ITEM = 1623,
  SOCKET_ALREADY_CONTAINS_PLUG = 1679,
}

export enum STAT_MOD_HASHES {
  MOBILITY_MOD = 4183296050,
  MINOR_MOBILITY_MOD = 1703647492,
  ARTIFICE_MOBILITY_MOD = 2322202118,
  RESILIENCE_MOD = 1180408010,
  MINOR_RESILIENCE_MOD = 2532323436,
  ARTIFICE_RESILIENCE_MOD = 199176566,
  RECOVERY_MOD = 4204488676,
  MINOR_RECOVERY_MOD = 1237786518,
  ARTIFICE_RECOVERY_MOD = 539459624,
  DISCIPLINE_MOD = 1435557120,
  MINOR_DISCIPLINE_MOD = 4021790309,
  ARTIFICE_DISCIPLINE_MOD = 617569843,
  INTELLECT_MOD = 2724608735,
  MINOR_INTELLECT_MOD = 350061697,
  ARTIFICE_INTELLECT_MOD = 3160845295,
  STRENGTH_MOD = 4287799666,
  MINOR_STRENGTH_MOD = 2639422088,
  ARTIFICE_STRENGTH_MOD = 2507624050,
}

export enum ITEM_LOCATIONS {
  VAULT = 0,
  CHARACTER_INVENTORY = 1,
  CHARACTER_EQUIPMENT = 2,
}

export enum PRIMARY_STATS {
  DEFENSE = 3897883278,
}

export enum DAMAGE_TYPE {
  KINETIC = 1, // also prismatic
  ARC = 2,
  SOLAR = 3,
  VOID = 4,
  STASIS = 6,
  STRAND = 7,
}

export enum BUCKET_HASH {
  EMBLEM = 4274335291,
  HELMET = 3448274439,
  GAUNTLETS = 3551918588,
  CHEST_ARMOR = 14239492,
  LEG_ARMOR = 20886954,
  CLASS_ARMOR = 1585787867,
  SUBCLASS = 3284755031,
}

export enum STAT_HASH {
  INTELLECT = 144602215,
  RESILIENCE = 392767087,
  DISCIPLINE = 1735777505,
  RECOVERY = 1943323491,
  MOBILITY = 2996146975,
  STRENGTH = 4244567218,
}

export enum CLASS_HASH {
  TITAN = 3655393761,
  HUNTER = 671679327,
  WARLOCK = 2271682572,
}

export enum SOCKET_HASH {
  ARTIFICE_ARMOR = 3727270518,
  UNLOCKED_ARTIFICE_ARMOR = 720825311,
}

export module PLUG_CATEGORY_HASH {
  export enum ARMOR_MODS {
    ARTIFICE_ARMOR_MODS = 3773173029,
    STAT_ARMOR_MODS = 2487827355,
    HELMET_MODS = 2912171003,
    GAUNTLETS_MODS = 3422420680,
    CHEST_ARMOR_MODS = 1526202480,
    LEG_ARMOR_MODS = 2111701510,
    CLASS_ARMOR_MODS = 912441879,
  }
}

export enum ITEM_CATEGORY_HASHES {
  MODS = 59,
  ARMOR_MODS = 4104513227,
  SUBCLASS_MODS = 1043342778,
}

export enum MANIFEST_ARMOR {
  HELMET = 26,
  CHEST = 28,
  CLASS = 30,
  GAUNTLETS = 27,
  LEGS = 29,
}

export enum MANIFEST_TYPES {
  ARMOR = 2,
  EMBLEM = 14,
  PLUG = 19,
  ORNAMENTS = 21,
  SUBCLASS = 16,
}

export enum MANIFEST_CLASS {
  TITAN = 0,
  HUNTER = 1,
  WARLOCK = 2,
  UNKNOWN = 3,
}
