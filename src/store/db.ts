import Dexie, { EntityTable } from "dexie";
import { ManifestArmor } from "../types";

const db = new Dexie("manifestDb") as Dexie & {
  manifestArmorDef: EntityTable<ManifestArmor, "id">;
};

db.version(1).stores({
  manifestArmorDef: "id++, hash, name, isExotic, characterClass, slot, icon",
});

export type { ManifestArmor };
export { db };
