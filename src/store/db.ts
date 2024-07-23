import Dexie, { EntityTable } from 'dexie';
import { ManifestArmor, ManifestEmblem } from '../types';

const db = new Dexie('manifestDb') as Dexie & {
  manifestArmorDef: EntityTable<ManifestArmor, 'id'>;
  manifestEmblemDef: EntityTable<ManifestEmblem, 'id'>;
};

db.version(1).stores({
  manifestArmorDef: 'id++, hash, name, isExotic, characterClass, slot, icon',
  manifestEmblemDef: 'id++, hash, secondaryOverlay, secondarySpecial',
});

export type { ManifestArmor, ManifestEmblem };
export { db };
