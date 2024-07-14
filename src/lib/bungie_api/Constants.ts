export module API_CREDENTIALS {
  export const API_KEY = import.meta.env.VITE_API_KEY;

  export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

  export const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
}

export module PRIMARY_STATS {
  export const DEFENSE = 3897883278;
}

export module STAT_HASH {
  export const INTELLECT = 144602215;
  export const RESILIENCE = 392767087;
  export const DISCIPLINE = 1735777505;
  export const RECOVERY = 1943323491;
  export const MOBILITY = 2996146975;
  export const STRENGTH = 4244567218;
}

export module SOCKET_HASH {
  export const ARTIFICE_ARMOR = 3727270518;
}

export module MANIFEST_ARMOR {
  export const HELMET = 26;
  export const CHEST = 28;
  export const CLASS = 30;
  export const GAUNTLETS = 27;
  export const LEGS = 29;
}

export module MANIFEST_CLASS {
  export const TITAN = 0;
  export const HUNTER = 1;
  export const WARLOCK = 2;
}
