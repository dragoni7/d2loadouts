import { db } from '../../store/db';
import { getManifestItemClass, getManifestItemSlot } from './utils';
import { getManifestComponentRequest, getManifestRequest } from './requests';
import {
  ITEM_CATEGORY_HASHES,
  MANIFEST_CLASS,
  MANIFEST_TYPES,
  PLUG_CATEGORY_HASH,
  STAT_HASH,
} from './constants';

const EXOTIC = 2759499571;
const urlPrefix = 'https://bungie.net';

export async function updateManifest() {
  const response = await getManifestRequest();

  if (response.data.Response) {
    const currentVersion = localStorage.getItem('manifestVersion');

    if (!currentVersion || currentVersion !== response.data.Response.version) {
      await db.manifestArmorDef.clear();
      await db.manifestArmorModDef.clear();
      await db.manifestArmorStatModDef.clear();
      await db.manifestEmblemDef.clear();
      await db.manifestExoticArmorCollection.clear();
      await db.manifestSubclass.clear();
      await db.manifestSubclassModDef.clear();
      await db.manifestSubclassFragmentsDef.clear();
      await db.manifestSubclassAspectsDef.clear();
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
              itemHash: Number(itemHash),
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
              itemHash: Number(itemHash),
              secondaryOverlay: urlPrefix + current.secondaryOverlay,
              secondarySpecial: urlPrefix + current.secondarySpecial,
              name: current.displayProperties.name,
              icon: urlPrefix + current.displayProperties.icon,
              secondaryIcon: urlPrefix + current.secondaryIcon,
            });
          }

          // store subclass defs in indexdb
          if (
            current.itemType === MANIFEST_TYPES.SUBCLASS &&
            current.classType !== MANIFEST_CLASS.UNKNOWN
          ) {
            await db.manifestSubclass.add({
              itemHash: Number(itemHash),
              name: current.displayProperties.name,
              icon: urlPrefix + current.displayProperties.icon,
              secondaryIcon: urlPrefix + current.displayProperties.highResIcon,
              screenshot: urlPrefix + current.screenshot,
              flavorText: current.flavorText,
              damageType: current.talentGrid.hudDamageType,
              isOwned: false,
              class: getManifestItemClass(current.classType),
            });
          }

          // store plug defs in indexdb
          if (current.itemType === MANIFEST_TYPES.PLUG && current.plug) {
            if (
              current.itemSubType !== MANIFEST_TYPES.ORNAMENTS &&
              current.itemCategoryHashes.includes(ITEM_CATEGORY_HASHES.ARMOR_MODS) &&
              current.displayProperties.name &&
              current.displayProperties.name !== 'Locked Armor Mod' &&
              !current.displayProperties.description.includes('deprecated') &&
              !current.itemTypeDisplayName.includes('Legacy') &&
              !current.itemTypeDisplayName.includes('Deprecated') &&
              !current.itemTypeDisplayName.includes('Artifact Mod') &&
              !current.plug.enabledRules.some((rule: any) => {
                return rule.failureMessage.includes('Artifact');
              })
            ) {
              if (
                current.plug.plugCategoryHash === PLUG_CATEGORY_HASH.ARMOR_MODS.STAT_ARMOR_MODS ||
                current.plug.plugCategoryHash === PLUG_CATEGORY_HASH.ARMOR_MODS.ARTIFICE_ARMOR_MODS
              ) {
                await db.manifestArmorStatModDef.add({
                  itemHash: Number(itemHash),
                  name: current.displayProperties.name,
                  icon: urlPrefix + current.displayProperties.icon,
                  energyCost: current.plug.energyCost ? current.plug.energyCost.energyCost : 0,
                  category: current.plug.plugCategoryHash,
                  isOwned: true,
                  collectibleHash: -1,
                  perks: current.perks.map((p: any) => p.perkHash),
                  mobilityMod:
                    0 |
                    current.investmentStats.find(
                      (stat: any) => stat.statTypeHash === STAT_HASH.MOBILITY
                    )?.value,
                  resilienceMod:
                    0 |
                    current.investmentStats.find(
                      (stat: any) => stat.statTypeHash === STAT_HASH.RESILIENCE
                    )?.value,
                  recoveryMod:
                    0 |
                    current.investmentStats.find(
                      (stat: any) => stat.statTypeHash === STAT_HASH.RECOVERY
                    )?.value,
                  disciplineMod:
                    0 |
                    current.investmentStats.find(
                      (stat: any) => stat.statTypeHash === STAT_HASH.DISCIPLINE
                    )?.value,
                  intellectMod:
                    0 |
                    current.investmentStats.find(
                      (stat: any) => stat.statTypeHash === STAT_HASH.INTELLECT
                    )?.value,
                  strengthMod:
                    0 |
                    current.investmentStats.find(
                      (stat: any) => stat.statTypeHash === STAT_HASH.STRENGTH
                    )?.value,
                });
              } else {
                await db.manifestArmorModDef.add({
                  itemHash: Number(itemHash),
                  name: current.displayProperties.name,
                  icon: urlPrefix + current.displayProperties.icon,
                  energyCost: current.plug.energyCost ? current.plug.energyCost.energyCost : 0,
                  category: current.plug.plugCategoryHash,
                  isOwned: true,
                  collectibleHash: -1,
                  perks: current.perks.map((p: any) => p.perkHash),
                  unique: current.tooltipNotifications.some(
                    (notification: any) =>
                      notification.displayString ===
                      'Equipping additional copies of this mod provides no benefit.'
                  ),
                });
              }
            } else if (current.itemCategoryHashes.includes(ITEM_CATEGORY_HASHES.SUBCLASS_MODS)) {
              if (current.itemTypeDisplayName.includes('Aspect')) {
                await db.manifestSubclassAspectsDef.add({
                  itemHash: Number(itemHash),
                  name: current.displayProperties.name,
                  icon: urlPrefix + current.displayProperties.icon,
                  secondaryIcon: urlPrefix + current.secondaryIcon,
                  flavorText: current.flavorText,
                  category: current.plug.plugCategoryHash,
                  isOwned: true,
                  perks: current.perks.map((p: any) => p.perkHash),
                  energyCapacity: current.investmentStats[0].value,
                });
              } else if (current.itemTypeDisplayName.includes('Fragment')) {
                await db.manifestSubclassFragmentsDef.add({
                  itemHash: Number(itemHash),
                  name: current.displayProperties.name,
                  icon: urlPrefix + current.displayProperties.icon,
                  secondaryIcon: urlPrefix + current.secondaryIcon,
                  category: current.plug.plugCategoryHash,
                  isOwned: true,
                  perks: current.perks.map((p: any) => p.perkHash),
                  mobilityMod:
                    0 |
                    current.investmentStats.find(
                      (stat: any) => stat.statTypeHash === STAT_HASH.MOBILITY
                    )?.value,
                  resilienceMod:
                    0 |
                    current.investmentStats.find(
                      (stat: any) => stat.statTypeHash === STAT_HASH.RESILIENCE
                    )?.value,
                  recoveryMod:
                    0 |
                    current.investmentStats.find(
                      (stat: any) => stat.statTypeHash === STAT_HASH.RECOVERY
                    )?.value,
                  disciplineMod:
                    0 |
                    current.investmentStats.find(
                      (stat: any) => stat.statTypeHash === STAT_HASH.DISCIPLINE
                    )?.value,
                  intellectMod:
                    0 |
                    current.investmentStats.find(
                      (stat: any) => stat.statTypeHash === STAT_HASH.INTELLECT
                    )?.value,
                  strengthMod:
                    0 |
                    current.investmentStats.find(
                      (stat: any) => stat.statTypeHash === STAT_HASH.STRENGTH
                    )?.value,
                });
              } else {
                await db.manifestSubclassModDef.add({
                  itemHash: Number(itemHash),
                  name: current.displayProperties.name,
                  description: current.displayProperties.description,
                  icon: urlPrefix + current.displayProperties.icon,
                  secondaryIcon: urlPrefix + current.secondaryIcon,
                  category: current.plug.plugCategoryHash,
                  isOwned: true,
                  perks: current.perks.map((p: any) => p.perkHash),
                });
              }
            } else if (
              current.itemCategoryHashes.includes(ITEM_CATEGORY_HASHES.INTRINSIC_WEAPON_MOD)
            ) {
              await db.manifestIntrinsicModDef.add({
                itemHash: Number(itemHash),
                name: current.displayProperties.name,
                description: current.displayProperties.description,
                icon: urlPrefix + current.displayProperties.icon,
                perks: current.perks.map((p: any) => p.perkHash),
              });
            }
          }
        }
      }

      const collectiblesComponent =
        response.data.Response.jsonWorldComponentContentPaths.en['DestinyCollectibleDefinition'];

      const collectiblesResponse = await getManifestComponentRequest(collectiblesComponent);

      if (collectiblesResponse) {
        for (const collectionHash in collectiblesResponse.data) {
          const current = collectiblesResponse.data[collectionHash];

          const armorDef = await db.manifestArmorDef
            .where('itemHash')
            .equals(current.itemHash)
            .and((entry) => entry.isExotic === true)
            .first();

          // store exotic armor collectibles def
          if (armorDef) {
            await db.manifestExoticArmorCollection.add({
              itemHash: current.itemHash,
              name: armorDef.name,
              class: armorDef.class,
              slot: armorDef.slot,
              icon: armorDef.icon,
              isOwned: false,
              collectibleHash: Number(collectionHash),
            });
          } else {
            // get collection hash for armor mods
            await db.manifestArmorModDef
              .where('itemHash')
              .equals(current.itemHash)
              .modify({ collectibleHash: current.hash });

            await db.manifestArmorStatModDef
              .where('itemHash')
              .equals(current.itemHash)
              .modify({ collectibleHash: current.hash });
          }
        }
      }

      const sandboxPerksComponent =
        response.data.Response.jsonWorldComponentContentPaths.en['DestinySandboxPerkDefinition'];

      const sandboxPerksResponse = await getManifestComponentRequest(sandboxPerksComponent);

      if (sandboxPerksResponse) {
        for (const perkHash in sandboxPerksResponse.data) {
          const current = sandboxPerksResponse.data[perkHash];

          if (current.isDisplayable && !current.displayProperties.name.includes('Deprecated')) {
            await db.manifestSandboxPerkDef.add({
              itemHash: current.hash,
              name: current.displayProperties.name,
              description: current.displayProperties.description,
              icon: urlPrefix + current.displayProperties.icon,
            });
          }
        }
      }
    }
  } else {
    throw new Error('Error retrieving manifest');
  }
}
