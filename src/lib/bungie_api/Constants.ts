export module API_CREDENTIALS {
  export const API_KEY = import.meta.env.VITE_API_KEY;

  export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

  export const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
}

export module ERRORS {
  export const INVALID_EQUIP_LOCATION = 1671;
  export const CANNOT_FIND_ITEM = 1623;
}

export module ITEM_LOCATIONS {
  export const VAULT = 0;
  export const CHARACTER_INVENTORY = 1;
  export const CHARACTER_EQUIPMENT = 2;
}

export module PRIMARY_STATS {
  export const DEFENSE = 3897883278;
}

export module BUCKET_HASH {
  export const EMBLEM = 4274335291;
  export const HELMET = 3448274439;
  export const GAUNTLETS = 3551918588;
  export const CHEST_ARMOR = 14239492;
  export const LEG_ARMOR = 20886954;
  export const CLASS_ARMOR = 1585787867;
}

export module STAT_HASH {
  export const INTELLECT = 144602215;
  export const RESILIENCE = 392767087;
  export const DISCIPLINE = 1735777505;
  export const RECOVERY = 1943323491;
  export const MOBILITY = 2996146975;
  export const STRENGTH = 4244567218;
}

export module CLASS_HASH {
  export const TITAN = 3655393761;
  export const HUNTER = 671679327;
  export const WARLOCK = 2271682572;
}

export module SOCKET_HASH {
  export const ARTIFICE_ARMOR = 3727270518;
}

export module PLUG_CATEGORY_HASH {
  export module SUPERS {
    export module TITAN {
      export const TITAN_ARC_SUPERS = 1861253111;
      export const TITAN_STASIS_SUPERS = 635737914;
      export const TITAN_PRISMATIC_SUPERS = 902963970;
      export const TITAN_SOLAR_SUPERS = 2850085618;
      export const TITAN_STRAND_SUPERS = 1080622901;
      export const TITAN_VOID_SUPERS = 3468785159;
    }

    export module HUNTER {
      export const HUNTER_SOLAR_SUPERS = 3151809860;
      export const HUNTER_PRISMATIC_SUPERS = 180411040;
      export const HUNTER_STRAND_SUPERS = 144959979;
      export const HUNTER_STASIS_SUPERS = 818442312;
      export const HUNTER_VOID_SUPERS = 2613010961;
      export const HUNTER_ARC_SUPERS = 4145425829;
    }

    export module WARLOCK {
      export const WARLOCK_ARC_SUPERS = 2285394316;
      export const WARLOCK_VOID_SUPERS = 4141244538;
      export const WARLOCK_PRISMATIC_SUPERS = 1684765285;
      export const WARLOCK_STRAND_SUPERS = 1774026300;
      export const WARLOCK_SOLAR_SUPERS = 2997411645;
      export const WARLOCK_STASIS_SUPERS = 3379648287;
    }
  }

  export module CLASS_ABILITIES {
    export module ARC {
      export const WARLOCK_ARC_CLASS = 1308084083;
      export const HUNTER_ARC_CLASS = 3956119552;
      export const TITAN_ARC_CLASS = 1281712906;
    }

    export module SOLAR {
      export const WARLOCK_SOLAR_CLASS = 1662395848;
      export const HUNTER_SOLAR_CLASS = 3538316507;
      export const TITAN_SOLAR_CLASS = 1197336009;
    }

    export module VOID {
      export const WARLOCK_VOID_CLASS = 3202031457;
      export const HUNTER_VOID_CLASS = 3673640204;
      export const TITAN_VOID_CLASS = 3366817658;
    }

    export module STASIS {
      export const WARLOCK_STASIS_CLASS = 1960796738;
      export const HUNTER_STASIS_CLASS = 641408223;
      export const TITAN_STASIS_CLASS = 826897697;
    }

    export module STRAND {
      export const WARLOCK_STRAND_CLASS = 2200902275;
      export const HUNTER_STRAND_CLASS = 2552562702;
      export const TITAN_STRAND_CLASS = 2480042224;
    }

    export module PRISMATIC {
      export const WARLOCK_PRISMATIC_CLASS = 3339135424;
      export const HUNTER_PRISMATIC_CLASS = 3324969927;
      export const TITAN_PRISMATIC_CLASS = 3820930681;
    }
  }

  export module MELEE_ABILITIES {
    export module ARC {
      export const TITAN_ARC_MELEE = 1458470025;
      export const HUNTER_ARC_MELEE = 2434874031;
      export const WARLOCK_ARC_MELEE = 1387605624;
    }

    export module SOLAR {
      export const TITAN_SOLAR_MELEE = 605941486;
      export const HUNTER_SOLAR_MELEE = 4225254304;
      export const WARLOCK_SOLAR_MELEE = 2822977079;
    }

    export module VOID {
      export const TITAN_VOID_MELEE = 4008726361;
      export const HUNTER_VOID_MELEE = 1288993259;
    }

    export module STASIS {
      export const TITAN_STASIS_MELEE = 3693308166;
      export const HUNTER_STASIS_MELEE = 3530064820;
      export const WARLOCK_STASIS_MELEE = 4031311265;
    }

    export module STRAND {
      export const TITAN_STRAND_MELEE = 3826855743;
      export const HUNTER_STRAND_MELEE = 3873313773;
      export const WARLOCK_STRAND_MELEE = 3904090216;
    }

    export module PRISMATIC {
      export const TITAN_PRISMATIC_MELEE = 1422809918;
      export const HUNTER_PRISMATIC_MELEE = 511532732;
      export const WARLOCK_PRISMATIC_MELEE = 204703343;
    }
  }

  export module MOVEMENT_ABILITIES {
    export module ARC {
      export const HUNTER_ARC_MOVEMENT = 2101241798;
      export const TITAN_ARC_MOVEMENT = 2415307576;
      export const WARLOCK_ARC_MOVEMENT = 1943502171;
    }

    export module SOLAR {
      export const HUNTER_SOLAR_MOVEMENT = 3752921107;
      export const TITAN_SOLAR_MOVEMENT = 379285521;
      export const WARLOCK_SOLAR_MOVEMENT = 1763298974;
    }

    export module VOID {
      export const HUNTER_VOID_MOVEMENT = 1796328914;
      export const TITAN_VOID_MOVEMENT = 1924069544;
      export const WARLOCK_VOID_MOVEMENT = 3427909241;
    }

    export module STASIS {
      export const HUNTER_STASIS_MOVEMENT = 1929408791;
      export const TITAN_STASIS_MOVEMENT = 3711066169;
      export const WARLOCK_STASIS_MOVEMENT = 1191502208;
    }

    export module STRAND {
      export const HUNTER_STRAND_MOVEMENT = 1979332108;
      export const TITAN_STRAND_MOVEMENT = 2139679542;
      export const WARLOCK_STRAND_MOVEMENT = 3728449707;
    }

    export module PRISMATIC {
      export const HUNTER_PRISMATIC_MOVEMENT = 1681184239;
      export const TITAN_PRISMATIC_MOVEMENT = 3777887553;
      export const WARLOCK_PRISMATIC_MOVEMENT = 2883193222;
    }
  }

  export module ASPECTS {
    export module ARC {
      export const HUNTER_ARC_ASPECTS = 185594100;
      export const WARLOCK_ARC_ASPECTS = 2111409167;
      export const TITAN_ARC_ASPECTS = 3460332466;
    }

    export module SOLAR {
      export const HUNTER_SOLAR_ASPECTS = 3052104375;
      export const WARLOCK_SOLAR_ASPECTS = 81856188;
      export const TITAN_SOLAR_ASPECTS = 1970675705;
    }

    export module VOID {
      export const HUNTER_VOID_ASPECTS = 2905530840;
      export const WARLOCK_VOID_ASPECTS = 227647633;
      export const TITAN_VOID_ASPECTS = 3990226434;
    }

    export module STASIS {
      export const HUNTER_STASIS_ASPECTS = 1853189378;
      export const WARLOCK_STASIS_ASPECTS = 2997725741;
      export const TITAN_STASIS_ASPECTS = 1491608144;
    }

    export module STRAND {
      export const HUNTER_STRAND_ASPECTS = 3805562622;
      export const WARLOCK_STRAND_ASPECTS = 2557935615;
      export const TITAN_STRAND_ASPECTS = 323641540;
    }

    export module PRISMATIC {
      export const HUNTER_PRISMATIC_ASPECTS = 1164816619;
      export const WARLOCK_PRISMATIC_ASPECTS = 769886388;
      export const TITAN_PRISMATIC_ASPECTS = 912150793;
    }
  }

  export module GRENADES {
    export const TITAN_PRISMATIC_GRENADES = 3205146347;
    export const HUNTER_PRISMATIC_GRENADES = 2789335173;
    export const WARLOCK_PRISMATIC_GRENADES = 3287837048;
    export const SHARED_ARC_GRENADES = 404070091;
    export const SHARED_STASIS_GRENADES = 900498880;
    export const SHARED_VOID_GRENADES = 3089520417;
    export const SHARED_SOLAR_GRENADES = 3369359206;
    export const SHARED_STRAND_GRENADES = 2831653331;
  }

  export module FRAGMENTS {
    export const SHARED_PRISMATIC_FRAGMENTS = 2696330562;
    export const SHARED_SOLAR_FRAGMENTS = 3119191718;
    export const SHARED_STASIS_FRAGMENTS = 83940941;
    export const SHARED_ARC_FRAGMENTS = 2430016289;
    export const SHARED_VOID_FRAGMENTS = 39076551;
    export const SHARED_STRAND_FRAGMENTS = 685964393;
  }

  export module ARMOR_MODS {
    export const ARTIFICE_ARMOR_MODS = 3773173029;
    export const STAT_ARMOR_MODS = 2487827355;
    export const HELMET_MODS = 2912171003;
    export const GAUNTLETS_MODS = 3422420680;
    export const CHEST_ARMOR_MODS = 1526202480;
    export const LEG_ARMOR_MODS = 2111701510;
    export const CLASS_ARMOR_MODS = 912441879;
  }
}

export module ITEM_CATEGORY_HASHES {
  export const MODS = 59;
  export const ARMOR_MODS = 4104513227;
  export const SUBCLASS_MODS = 1043342778;
}

export module MANIFEST_ARMOR {
  export const HELMET = 26;
  export const CHEST = 28;
  export const CLASS = 30;
  export const GAUNTLETS = 27;
  export const LEGS = 29;
}

export module MANIFEST_TYPES {
  export const ARMOR = 2;
  export const EMBLEM = 14;
  export const PLUG = 19;
  export const ORNAMENTS = 21;
}

export module MANIFEST_CLASS {
  export const TITAN = 0;
  export const HUNTER = 1;
  export const WARLOCK = 2;
}
