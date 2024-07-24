export module API_CREDENTIALS {
  export const API_KEY = import.meta.env.VITE_API_KEY;

  export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

  export const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
}

export module ERRORS {
  export const INVALID_EQUIP_LOCATION = 1671;
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
}

export module MANIFEST_CLASS {
  export const TITAN = 0;
  export const HUNTER = 1;
  export const WARLOCK = 2;
}
