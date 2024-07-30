import { db } from '../../store/db';
import { getManifestItemClass, getManifestItemSlot } from './utils';
import { getManifestComponentRequest, getManifestRequest } from './Requests';
import { ITEM_CATEGORY_HASHES, MANIFEST_CLASS, MANIFEST_TYPES } from './Constants';

const EXOTIC = 2759499571;
const urlPrefix = 'https://bungie.net';

export async function updateManifest() {
  const response = await getManifestRequest();

  if (response.data.Response) {
    const currentVersion = localStorage.getItem('manifestVersion');

    if (!currentVersion || currentVersion !== response.data.Response.version) {
      await db.manifestArmorDef.clear();
      localStorage.setItem('manifestVersion', response.data.Response.version);

      const itemInventoryComponent =
        response.data.Response.jsonWorldComponentContentPaths.en['DestinyInventoryItemDefinition'];

      const itemDefResponse = await getManifestComponentRequest(itemInventoryComponent);

      if (itemDefResponse.data && itemDefResponse.status === 200) {
        for (const itemHash in itemDefResponse.data) {
          const current = itemDefResponse.data[itemHash];

          // store armor defs in indexdb
          if (current.itemType === MANIFEST_TYPES.ARMOR) {
            await db.manifestArmorDef.add({
              hash: Number(itemHash),
              name: current.displayProperties.name,
              isExotic: current.inventory.tierTypeHash === EXOTIC,
              class: getManifestItemClass(current.classType),
              slot: getManifestItemSlot(current.itemSubType),
              icon: urlPrefix + current.displayProperties.icon,
            });
          }

          // store emblem defs in indexdb
          if (current.itemType === MANIFEST_TYPES.EMBLEM) {
            await db.manifestEmblemDef.add({
              hash: Number(itemHash),
              secondaryOverlay: urlPrefix + current.secondaryOverlay,
              secondarySpecial: urlPrefix + current.secondarySpecial,
              name: current.displayProperties.name,
              icon: urlPrefix + current.displayProperties.icon,
            });
          }

          // store subclass defs in indexdb
          if (
            current.itemType === MANIFEST_TYPES.SUBCLASS &&
            current.classType !== MANIFEST_CLASS.UNKNOWN
          ) {
            await db.manifestSubclass.add({
              hash: Number(itemHash),
              name: current.displayProperties.name,
              icon: urlPrefix + current.displayProperties.icon,
              screenshot: urlPrefix + current.screenshot,
              damageType: current.talentGrid.hudDamageType,
              isOwned: false,
              class: getManifestItemClass(current.classType),
            });
          }

          // store plug defs in indexdb
          if (current.itemType === MANIFEST_TYPES.PLUG && current.plug) {
            if (
              current.itemSubType !== MANIFEST_TYPES.ORNAMENTS &&
              current.itemCategoryHashes.includes(ITEM_CATEGORY_HASHES.ARMOR_MODS)
            ) {
              await db.manifestArmorModDef.add({
                hash: Number(itemHash),
                name: current.displayProperties.name,
                icon: urlPrefix + current.displayProperties.icon,
                energyCost: current.plug.energyCost ? current.plug.energyCost.energyCost : 0,
                category: current.plug.plugCategoryHash,
                isOwned: false,
              });
            } else if (current.itemCategoryHashes.includes(ITEM_CATEGORY_HASHES.SUBCLASS_MODS)) {
              await db.manifestSubclassModDef.add({
                hash: Number(itemHash),
                name: current.displayProperties.name,
                icon: urlPrefix + current.displayProperties.icon,
                energyCost: current.plug.energyCost ? current.plug.energyCost.energyCost : 0,
                category: current.plug.plugCategoryHash,
                isOwned: false,
              });
            }
          }
        }
      }

      const collectiblesComponent =
        response.data.Response.jsonWorldComponentContentPaths.en['DestinyCollectibleDefinition'];

      const collectiblesResponse = await getManifestComponentRequest(collectiblesComponent);

      // store exotic armor collectibles def
      if (collectiblesResponse && collectiblesResponse.status === 200) {
        for (const collectionHash in collectiblesResponse.data) {
          const current = collectiblesResponse.data[collectionHash];

          const armorDef = await db.manifestArmorDef
            .where('hash')
            .equals(current.itemHash)
            .and((entry) => entry.isExotic === true)
            .first();

          if (armorDef && armorDef.isExotic) {
            await db.manifestExoticArmorCollection.add({
              hash: Number(collectionHash),
              name: armorDef.name,
              class: armorDef.class,
              slot: armorDef.slot,
              icon: armorDef.icon,
              isOwned: false,
              itemHash: current.itemHash,
            });
          }
        }
      }
    }
  } else {
    throw new Error('Error retrieving manifest');
  }
}
