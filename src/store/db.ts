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
  manifestArmorDef: EntityTable<ManifestArmor, 'id'>;
  manifestExoticArmorCollection: EntityTable<ManifestExoticArmor, 'id'>;
  manifestEmblemDef: EntityTable<ManifestEmblem, 'id'>;
  manifestArmorModDef: EntityTable<ManifestArmorMod, 'id'>;
  manifestSubclassModDef: EntityTable<ManifestPlug, 'id'>;
  manifestSubclass: EntityTable<ManifestSubclass, 'id'>;
};

db.version(1).stores({
  manifestArmorDef: 'id++, itemHash, name, icon, isExotic, class, slot',
  manifestExoticArmorCollection:
    'id++, itemHash, name, icon, class, slot, isOwned, collectibleHash',
  manifestEmblemDef: 'id++, itemHash, name, icon, secondaryOverlay, secondarySpecial',
  manifestArmorModDef: 'id++, itemHash, name, icon, category, isOwned, collectibleHash',
  manifestSubclassModDef: 'id++, itemHash, name, icon, category, isOwned',
  manifestSubclass: 'id++, itemHash, name, icon, screenshot, damageType, class, isOwned',
});

export { db };
