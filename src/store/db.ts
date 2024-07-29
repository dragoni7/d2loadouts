import Dexie, { EntityTable } from 'dexie';
import { ManifestArmor, ManifestEmblem, ManifestPlug, ManifestSubclass } from '../types';

const db = new Dexie('manifestDb') as Dexie & {
  manifestArmorDef: EntityTable<ManifestArmor, 'id'>;
  manifestEmblemDef: EntityTable<ManifestEmblem, 'id'>;
  manifestArmorModDef: EntityTable<ManifestPlug, 'id'>;
  manifestSubclassModDef: EntityTable<ManifestPlug, 'id'>;
  manifestSubclass: EntityTable<ManifestSubclass, 'id'>;
};

db.version(1).stores({
  manifestArmorDef: 'id++, hash, name, icon, isExotic, characterClass, slot',
  manifestEmblemDef: 'id++, hash, name, icon, secondaryOverlay, secondarySpecial',
  manifestArmorModDef: 'id++, hash, name, icon, category',
  manifestSubclassModDef: 'id++, hash, name, icon, category',
  manifestSubclass: 'id++, hash, name, icon, screenshot, damageType',
});

export { db };
