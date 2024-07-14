import { db } from "../../store/db";
import { _get } from "./BungieApiClient";
import axios from "axios";

const ARMOR_TYPE = 2;

const HELMET = 26;
const CHEST = 28;
const CLASS = 30;
const GAUNTLETS = 27;
const LEGS = 29;

const HUNTER = 1;
const WARLOCK = 2;
const TITAN = 0;

const EXOTIC = 2759499571;

function getSlot(slotNum: number): string {
  switch (slotNum) {
    case HELMET: {
      return "helmet";
    }
    case CHEST: {
      return "chest";
    }
    case GAUNTLETS: {
      return "arms";
    }
    case LEGS: {
      return "legs";
    }
    case CLASS: {
      return "class";
    }
    default: {
      return "";
    }
  }
}

function getClass(classNum: number): string {
  switch (classNum) {
    case HUNTER: {
      return "hunter";
    }
    case WARLOCK: {
      return "warlock";
    }
    case TITAN: {
      return "titan";
    }
    default: {
      return "";
    }
  }
}

export async function updateManifest() {
  const response = await _get("/Platform/Destiny2/Manifest/");

  if (response.data.Response) {
    const currentVersion = localStorage.getItem("manifestVersion");

    if (!currentVersion || currentVersion !== response.data.Response.version) {
      await db.manifestArmorDef.clear();
      localStorage.setItem("manifestVersion", response.data.Response.version);

      const component =
        response.data.Response.jsonWorldComponentContentPaths.en[
          "DestinyInventoryItemDefinition"
        ];

      const itemDefResponse = await axios.get(
        "https://www.bungie.net" + component,
        {
          responseType: "json",
        }
      );

      if (itemDefResponse.data && itemDefResponse.status === 200) {
        for (const itemHash in itemDefResponse.data) {
          const current = itemDefResponse.data[itemHash];

          // store armor defs in indexdb
          if (current.itemType === ARMOR_TYPE) {
            await db.manifestArmorDef.add({
              hash: Number(itemHash),
              name: current.displayProperties.name,
              isExotic: current.inventory.tierTypeHash === EXOTIC,
              characterClass: getClass(current.classType),
              slot: getSlot(current.itemSubType),
              icon: "https://bungie.net" + current.displayProperties.icon,
            });
          }
        }
      }
    }
  } else {
    throw new Error("Error retrieving manifest");
  }
}
