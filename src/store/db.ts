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
  ManifestSandboxPerk,
  ManifestIntrinsicMod,
} from '../types/manifest-types';

const db = new Dexie('manifestDb') as Dexie & {
  manifestSandboxPerkDef: EntityTable<ManifestSandboxPerk, 'itemHash'>;
  manifestArmorDef: EntityTable<ManifestArmor, 'itemHash'>;
  manifestExoticArmorCollection: EntityTable<ManifestExoticArmor, 'itemHash'>;
  manifestEmblemDef: EntityTable<ManifestEmblem, 'itemHash'>;
  manifestArmorModDef: EntityTable<ManifestArmorMod, 'itemHash'>;
  manifestIntrinsicModDef: EntityTable<ManifestIntrinsicMod, 'itemHash'>;
  manifestArmorStatModDef: EntityTable<ManifestArmorStatMod, 'itemHash'>;
  manifestSubclassModDef: EntityTable<ManifestPlug, 'itemHash'>;
  manifestSubclassAspectsDef: EntityTable<ManifestAspect, 'itemHash'>;
  manifestSubclassFragmentsDef: EntityTable<ManifestStatPlug, 'itemHash'>;
  manifestSubclass: EntityTable<ManifestSubclass, 'itemHash'>;
};

db.version(2).stores({
  manifestSandboxPerkDef: 'itemHash, name, icon, description',
  manifestArmorDef: 'itemHash, name, icon, isExotic, class, slot',
  manifestExoticArmorCollection: 'itemHash, name, icon, class, slot, isOwned, collectibleHash',
  manifestEmblemDef: 'itemHash, name, icon, secondaryOverlay, secondarySpecial',
  manifestArmorModDef:
    'itemHash, name, icon, category, perkName, perkDescription, perkIcon, isOwned, unique, collectibleHash',
  manifestIntrinsicModDef: 'itemHash, name, icon, perks',
  manifestArmorStatModDef:
    'itemHash, name, icon, category, perkName, perkDescription, perkIcon, isOwned, collectibleHash, mobilityMod, resilienceMod, recoveryMod, discipline, intellect, strength',
  manifestSubclassModDef:
    'itemHash, name, icon, category, perkName, perkDescription, perkIcon, isOwned',
  manifestSubclassAspectsDef:
    'itemHash, name, icon, category, perkName, perkDescription, perkIcon, isOwned, energyCapacity',
  manifestSubclassFragmentsDef:
    'itemHash, name, icon, category, perkName, perkDescription, perkIcon, isOwned, mobilityMod, resilienceMod, recoveryMod, discipline, intellect, strength',
  manifestSubclass: 'itemHash, name, icon, highResIcon, screenshot, damageType, class, isOwned',
});

export { db };
