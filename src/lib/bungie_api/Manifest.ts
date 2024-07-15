import { db } from "../../store/db";
import { getManifestItemClass, getManifestItemSlot } from "./utils";
import { getManifestComponentRequest, getManifestRequest } from "./Requests";

const ARMOR_TYPE = 2;

const EXOTIC = 2759499571;

export async function updateManifest() {
  const response = await getManifestRequest();

  if (response.data.Response) {
    const currentVersion = localStorage.getItem("manifestVersion");

    if (!currentVersion || currentVersion !== response.data.Response.version) {
      await db.manifestArmorDef.clear();
      localStorage.setItem("manifestVersion", response.data.Response.version);

      const component =
        response.data.Response.jsonWorldComponentContentPaths.en[
          "DestinyInventoryItemDefinition"
        ];

      const itemDefResponse = await getManifestComponentRequest(component);

      if (itemDefResponse.data && itemDefResponse.status === 200) {
        for (const itemHash in itemDefResponse.data) {
          const current = itemDefResponse.data[itemHash];

          // store armor defs in indexdb
          if (current.itemType === ARMOR_TYPE) {
            await db.manifestArmorDef.add({
              hash: Number(itemHash),
              name: current.displayProperties.name,
              isExotic: current.inventory.tierTypeHash === EXOTIC,
              characterClass: getManifestItemClass(current.classType),
              slot: getManifestItemSlot(current.itemSubType),
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