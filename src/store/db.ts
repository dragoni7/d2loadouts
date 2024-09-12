import Dexie, { EntityTable } from 'dexie';
import {} from '../types/d2l-types';
import {
  ManifestArmor,
  ManifestExoticArmor,
  ManifestEmblem,
  ManifestArmorMod,
  ManifestPlug,
  ManifestSubclass,
  ManifestArmorStatMod,
  ManifestAspect,
  ManifestStatPlug,
  ManifestEntry,
  ManifestLoadoutColor,
  ManifestLoadoutIcon,
  ManifestLoadoutName,
} from '../types/manifest-types';

const db = new Dexie('manifestDb') as Dexie & {
  manifestSandboxPerkDef: EntityTable<ManifestEntry, 'itemHash'>;
  manifestArmorDef: EntityTable<ManifestArmor, 'itemHash'>;
  manifestExoticArmorCollection: EntityTable<ManifestExoticArmor, 'itemHash'>;
  manifestEmblemDef: EntityTable<ManifestEmblem, 'itemHash'>;
  manifestArmorModDef: EntityTable<ManifestArmorMod, 'itemHash'>;
  manifestIntrinsicModDef: EntityTable<ManifestEntry, 'itemHash'>;
  manifestArmorStatModDef: EntityTable<ManifestArmorStatMod, 'itemHash'>;
  manifestSubclassModDef: EntityTable<ManifestPlug, 'itemHash'>;
  manifestSubclassAspectsDef: EntityTable<ManifestAspect, 'itemHash'>;
  manifestSubclassFragmentsDef: EntityTable<ManifestStatPlug, 'itemHash'>;
  manifestSubclass: EntityTable<ManifestSubclass, 'itemHash'>;
  manifestLoadoutColorDef: EntityTable<ManifestLoadoutColor, 'hash'>;
  manifestLoadoutIconDef: EntityTable<ManifestLoadoutIcon, 'hash'>;
  manifestLoadoutNameDef: EntityTable<ManifestLoadoutName, 'hash'>;
};

db.version(1).stores({
  manifestSandboxPerkDef: 'itemHash, name, description, icon',
  manifestArmorDef: 'itemHash, name, icon, isExotic, class, slot',
  manifestExoticArmorCollection: 'itemHash, name, icon, class, slot, isOwned, collectibleHash',
  manifestEmblemDef: 'itemHash, name, icon, secondaryIcon, secondaryOverlay, secondarySpecial',
  manifestArmorModDef: 'itemHash, name, icon, category, perks, isOwned, unique, collectibleHash',
  manifestIntrinsicModDef: 'itemHash, name, description, icon, perks',
  manifestArmorStatModDef:
    'itemHash, name, icon, category, perks, isOwned, collectibleHash, mobilityMod, resilienceMod, recoveryMod, disciplineMod, intellectMod, strengthMod',
  manifestSubclassModDef: 'itemHash, name, description, icon, secondaryIcon, category, isOwned',
  manifestSubclassAspectsDef:
    'itemHash, name, icon, secondaryIcon, flavorText, category, perks, isOwned, energyCapacity',
  manifestSubclassFragmentsDef:
    'itemHash, name, icon, secondaryIcon, category, perks, isOwned, mobilityMod, resilienceMod, recoveryMod, disciplineMod, intellectMod, strengthMod',
  manifestSubclass:
    'itemHash, name, icon, secondaryIcon, screenshot, flavorText, damageType, class, isOwned',
  manifestLoadoutColorDef: 'hash, imagePath, index',
  manifestLoadoutIconDef: 'hash, imagePath, index',
  manifestLoadoutNameDef: 'hash, name, index',
});

export { db };
