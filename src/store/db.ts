import Dexie, { EntityTable } from 'dexie';
import { ManifestArmor, ManifestEmblem, ManifestPlug } from '../types';

const db = new Dexie('manifestDb') as Dexie & {
  manifestArmorDef: EntityTable<ManifestArmor, 'id'>;
  manifestEmblemDef: EntityTable<ManifestEmblem, 'id'>;
  manifestArmorModDef: EntityTable<ManifestPlug, 'id'>;
  manifestSubclassModDef: EntityTable<ManifestPlug, 'id'>;
};

db.version(1).stores({
  manifestArmorDef: 'id++, hash, name, isExotic, characterClass, slot, icon',
  manifestEmblemDef: 'id++, hash, secondaryOverlay, secondarySpecial',
  manifestArmorModDef: 'id++, hash, name, icon, category',
  manifestSubclassModDef: 'id++, hash, name, icon, category',
});

export { db };
