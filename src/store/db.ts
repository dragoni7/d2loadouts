import Dexie, { EntityTable } from 'dexie';
import {
  ManifestArmor,
  ManifestArmorMod,
  ManifestEmblem,
  ManifestExoticArmor,
  ManifestPlug,
  ManifestSubclass,
} from '../types';

const db = new Dexie('manifestDb') as Dexie & {
  manifestArmorDef: EntityTable<ManifestArmor, 'itemHash'>;
  manifestExoticArmorCollection: EntityTable<ManifestExoticArmor, 'itemHash'>;
  manifestEmblemDef: EntityTable<ManifestEmblem, 'itemHash'>;
  manifestArmorModDef: EntityTable<ManifestArmorMod, 'itemHash'>;
  manifestSubclassModDef: EntityTable<ManifestPlug, 'itemHash'>;
  manifestSubclass: EntityTable<ManifestSubclass, 'itemHash'>;
};

db.version(1).stores({
  manifestArmorDef: 'itemHash, name, icon, isExotic, class, slot',
  manifestExoticArmorCollection: 'itemHash, name, icon, class, slot, isOwned, collectibleHash',
  manifestEmblemDef: 'itemHash, name, icon, secondaryOverlay, secondarySpecial',
  manifestArmorModDef: 'itemHash, name, icon, category, isOwned, collectibleHash',
  manifestSubclassModDef: 'itemHash, name, icon, category, isOwned',
  manifestSubclass: 'itemHash, name, icon, screenshot, damageType, class, isOwned',
});

export { db };
