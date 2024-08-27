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

export enum PLUG_SET {
  LEG_PLUGS = 541478408,
  CLASS_ITEM_PLUGS = 963686427,
  HELMET_PLUGS = 2037229815,
  CHEST_PLUGS = 2321486318,
  ARM_PLUGS = 3899745242,
}

export module SUBCLASS_PLUG_SETS {
  export module SUPERS {
    export enum TITAN {
      ARC = 1129,
      SOLAR = 1100,
      VOID = 1087,
    }

    export enum HUNTER {
      PRISMATIC = 1358,
      ARC = 1124,
      SOLAR = 1095,
      VOID = 1082,
    }

    export enum WARLOCK {
      PRISMATIC = 1368,
      SOLAR = 1104,
      VOID = 1091,
      ARC = 1133,
      STASIS = 1368,
      STRAND = 1196,
    }
  }

  export module MELEE_ABILITIES {
    export enum TITAN {
      ARC = 1130,
      SOLAR = 1101,
      VOID = 1088,
    }

    export enum HUNTER {
      PRISMATIC = 1359,
      ARC = 1125,
      SOLAR = 1096,
      VOID = 1083,
    }

    export enum WARLOCK {
      PRISMATIC = 1369,
      ARC = 1134,
      SOLAR = 1105,
      VOID = 1092,
      STASIS = 956,
      STRAND = 1197,
    }
  }

  export module ASPECTS {
    export enum TITAN {
      SOLAR = 4030440911,
      ARC = 3609966783,
      VOID = 1369926501,
    }

    export enum HUNTER {
      ARC = 3432159481,
      PRISMATIC = 2685327650,
      VOID = 949441155,
      SOLAR = 634290851,
    }

    export enum WARLOCK {
      SOLAR = 3562933678,
      ARC = 3085216490,
      PRISMATIC = 2676106717,
      STASIS = 2491007355,
      STRAND = 2260242405,
      VOID = 2203811618,
    }
  }

  export enum GRENADES {
    PRISMATIC_WARLOCK = 1370,
    PRISMATIC_HUNTER = 1360,
    STRAND = 1189,
    ARC = 1126,
    SOLAR = 1097,
    VOID = 1084,
    STASIS = 950,
  }

  export enum FRAGMENTS {
    PRISMATIC = 3916244727,
    STASIS = 2878515719,
    ARC = 2179662812,
    SOLAR = 1319395210,
    STRAND = 837761865,
    VOID = 225543744,
  }
}

export module PLUG_CATEGORY_HASH {
  export module SUPERS {
    export enum TITAN {
      TITAN_ARC_SUPERS = 1861253111,
      TITAN_STASIS_SUPERS = 635737914,
      TITAN_PRISMATIC_SUPERS = 902963970,
      TITAN_SOLAR_SUPERS = 2850085618,
      TITAN_STRAND_SUPERS = 1080622901,
      TITAN_VOID_SUPERS = 3468785159,
    }

    export enum HUNTER {
      HUNTER_SOLAR_SUPERS = 3151809860,
      HUNTER_PRISMATIC_SUPERS = 180411040,
      HUNTER_STRAND_SUPERS = 144959979,
      HUNTER_STASIS_SUPERS = 818442312,
      HUNTER_VOID_SUPERS = 2613010961,
      HUNTER_ARC_SUPERS = 4145425829,
    }

    export enum WARLOCK {
      WARLOCK_ARC_SUPERS = 2285394316,
      WARLOCK_VOID_SUPERS = 4141244538,
      WARLOCK_PRISMATIC_SUPERS = 1684765285,
      WARLOCK_STRAND_SUPERS = 1774026300,
      WARLOCK_SOLAR_SUPERS = 2997411645,
      WARLOCK_STASIS_SUPERS = 3379648287,
    }
  }

  export module CLASS_ABILITIES {
    export enum ARC {
      WARLOCK_ARC_CLASS = 1308084083,
      HUNTER_ARC_CLASS = 3956119552,
      TITAN_ARC_CLASS = 1281712906,
    }

    export enum SOLAR {
      WARLOCK_SOLAR_CLASS = 1662395848,
      HUNTER_SOLAR_CLASS = 3538316507,
      TITAN_SOLAR_CLASS = 1197336009,
    }

    export enum VOID {
      WARLOCK_VOID_CLASS = 3202031457,
      HUNTER_VOID_CLASS = 3673640204,
      TITAN_VOID_CLASS = 3366817658,
    }

    export enum STASIS {
      WARLOCK_STASIS_CLASS = 1960796738,
      HUNTER_STASIS_CLASS = 641408223,
      TITAN_STASIS_CLASS = 826897697,
    }

    export enum STRAND {
      WARLOCK_STRAND_CLASS = 2200902275,
      HUNTER_STRAND_CLASS = 2552562702,
      TITAN_STRAND_CLASS = 2480042224,
    }

    export enum PRISMATIC {
      WARLOCK_PRISMATIC_CLASS = 3339135424,
      HUNTER_PRISMATIC_CLASS = 3324969927,
      TITAN_PRISMATIC_CLASS = 3820930681,
    }
  }

  export module MELEE_ABILITIES {
    export enum ARC {
      TITAN_ARC_MELEE = 1458470025,
      HUNTER_ARC_MELEE = 2434874031,
      WARLOCK_ARC_MELEE = 1387605624,
    }

    export enum SOLAR {
      TITAN_SOLAR_MELEE = 605941486,
      HUNTER_SOLAR_MELEE = 4225254304,
      WARLOCK_SOLAR_MELEE = 2822977079,
    }

    export enum VOID {
      TITAN_VOID_MELEE = 4008726361,
      HUNTER_VOID_MELEE = 1288993259,
      WARLOCK_VOID_MELEE = 2900030790,
    }

    export enum STASIS {
      TITAN_STASIS_MELEE = 3693308166,
      HUNTER_STASIS_MELEE = 3530064820,
      WARLOCK_STASIS_MELEE = 4031311265,
    }

    export enum STRAND {
      TITAN_STRAND_MELEE = 3826855743,
      HUNTER_STRAND_MELEE = 3873313773,
      WARLOCK_STRAND_MELEE = 3904090216,
    }

    export enum PRISMATIC {
      TITAN_PRISMATIC_MELEE = 1422809918,
      HUNTER_PRISMATIC_MELEE = 511532732,
      WARLOCK_PRISMATIC_MELEE = 204703343,
    }
  }

  export module MOVEMENT_ABILITIES {
    export enum ARC {
      HUNTER_ARC_MOVEMENT = 2101241798,
      TITAN_ARC_MOVEMENT = 2415307576,
      WARLOCK_ARC_MOVEMENT = 1943502171,
    }

    export enum SOLAR {
      HUNTER_SOLAR_MOVEMENT = 3752921107,
      TITAN_SOLAR_MOVEMENT = 379285521,
      WARLOCK_SOLAR_MOVEMENT = 1763298974,
    }

    export enum VOID {
      HUNTER_VOID_MOVEMENT = 1796328914,
      TITAN_VOID_MOVEMENT = 1924069544,
      WARLOCK_VOID_MOVEMENT = 3427909241,
    }

    export enum STASIS {
      HUNTER_STASIS_MOVEMENT = 1929408791,
      TITAN_STASIS_MOVEMENT = 3711066169,
      WARLOCK_STASIS_MOVEMENT = 1191502208,
    }

    export enum STRAND {
      HUNTER_STRAND_MOVEMENT = 1979332108,
      TITAN_STRAND_MOVEMENT = 2139679542,
      WARLOCK_STRAND_MOVEMENT = 3728449707,
    }

    export enum PRISMATIC {
      HUNTER_PRISMATIC_MOVEMENT = 1681184239,
      TITAN_PRISMATIC_MOVEMENT = 3777887553,
      WARLOCK_PRISMATIC_MOVEMENT = 2883193222,
    }
  }

  export module ASPECTS {
    export enum ARC {
      HUNTER_ARC_ASPECTS = 185594100,
      WARLOCK_ARC_ASPECTS = 2111409167,
      TITAN_ARC_ASPECTS = 3460332466,
    }

    export enum SOLAR {
      HUNTER_SOLAR_ASPECTS = 3052104375,
      WARLOCK_SOLAR_ASPECTS = 81856188,
      TITAN_SOLAR_ASPECTS = 1970675705,
    }

    export enum VOID {
      HUNTER_VOID_ASPECTS = 2905530840,
      WARLOCK_VOID_ASPECTS = 227647633,
      TITAN_VOID_ASPECTS = 3990226434,
    }

    export enum STASIS {
      HUNTER_STASIS_ASPECTS = 1853189378,
      WARLOCK_STASIS_ASPECTS = 2997725741,
      TITAN_STASIS_ASPECTS = 1491608144,
    }

    export enum STRAND {
      HUNTER_STRAND_ASPECTS = 3805562622,
      WARLOCK_STRAND_ASPECTS = 2557935615,
      TITAN_STRAND_ASPECTS = 323641540,
    }

    export enum PRISMATIC {
      HUNTER_PRISMATIC_ASPECTS = 1164816619,
      WARLOCK_PRISMATIC_ASPECTS = 769886388,
      TITAN_PRISMATIC_ASPECTS = 912150793,
    }
  }

  export enum GRENADES {
    TITAN_PRISMATIC_GRENADES = 3205146347,
    HUNTER_PRISMATIC_GRENADES = 2789335173,
    WARLOCK_PRISMATIC_GRENADES = 3287837048,
    SHARED_ARC_GRENADES = 404070091,
    SHARED_STASIS_GRENADES = 900498880,
    SHARED_VOID_GRENADES = 3089520417,
    SHARED_SOLAR_GRENADES = 3369359206,
    SHARED_STRAND_GRENADES = 2831653331,
  }

  export enum FRAGMENTS {
    SHARED_PRISMATIC_FRAGMENTS = 2696330562,
    SHARED_SOLAR_FRAGMENTS = 3119191718,
    SHARED_STASIS_FRAGMENTS = 83940941,
    SHARED_ARC_FRAGMENTS = 2430016289,
    SHARED_VOID_FRAGMENTS = 39076551,
    SHARED_STRAND_FRAGMENTS = 685964393,
  }

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
