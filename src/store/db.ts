import Dexie, { EntityTable } from 'dexie';
import {
  ManifestArmor,
  ManifestEmblem,
  ManifestExoticArmor,
  ManifestPlug,
  ManifestSubclass,
} from '../types';

const db = new Dexie('manifestDb') as Dexie & {
  manifestArmorDef: EntityTable<ManifestArmor, 'id'>;
  manifestExoticArmorCollection: EntityTable<ManifestExoticArmor, 'id'>;
  manifestEmblemDef: EntityTable<ManifestEmblem, 'id'>;
  manifestArmorModDef: EntityTable<ManifestPlug, 'id'>;
  manifestSubclassModDef: EntityTable<ManifestPlug, 'id'>;
  manifestSubclass: EntityTable<ManifestSubclass, 'id'>;
};

db.version(1).stores({
  manifestArmorDef: 'id++, hash, name, icon, isExotic, class, slot',
  manifestExoticArmorCollection: 'id++, hash, name, icon, class, slot, isOwned',
  manifestEmblemDef: 'id++, hash, name, icon, secondaryOverlay, secondarySpecial',
  manifestArmorModDef: 'id++, hash, name, icon, category, isOwned',
  manifestSubclassModDef: 'id++, hash, name, icon, category, isOwned',
  manifestSubclass: 'id++, hash, name, icon, screenshot, damageType, class, isOwned',
});

export { db };
