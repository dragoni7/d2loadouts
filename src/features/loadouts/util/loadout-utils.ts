import { ARMOR_ARRAY, DAMAGE_TYPE } from '../../../lib/bungie_api/constants';
import { snapShotLoadoutRequest } from '../../../lib/bungie_api/requests';
import { db } from '../../../store/db';
import {
  armor,
  armorMods,
  Character,
  DestinyArmor,
  FilteredPermutation,
  Loadout,
  StatName,
  Subclass,
  SubclassConfig,
} from '../../../types/d2l-types';
import {
  ManifestArmorMod,
  ManifestArmorStatMod,
  ManifestAspect,
  ManifestPlug,
  ManifestStatPlug,
} from '../../../types/manifest-types';
import { EquipResult, setState } from '../types';
import { ArmorEquipper } from './armor-equipper';
import { SubclassEquipper } from './subclass-equipper';

export async function createInGameLoadout(
  characterId: string,
  colorHash: number,
  iconHash: number,
  loadoutIndex: number,
  nameHash: number
) {
  await snapShotLoadoutRequest(characterId, colorHash, iconHash, loadoutIndex, nameHash);
}

export async function equipLoadout(
  loadout: Loadout,
  setProcessing: setState,
  setEquipStep: setState,
  setResults: setState
) {
  const armorEquipper = new ArmorEquipper();
  const tempEquipped: (
    | DestinyArmor
    | Subclass
    | ManifestPlug
    | ManifestAspect
    | ManifestStatPlug
  )[] = [];
  const tempResults: EquipResult[][] = [];

  await armorEquipper.setCharacter(loadout.characterId);

  await processArmor(
    0,
    loadout,
    armorEquipper,
    tempEquipped,
    tempResults,
    setProcessing,
    setEquipStep,
    setResults
  );

  const subclassEquipper = new SubclassEquipper();
  subclassEquipper.setCharacter(loadout.characterId);

  await processSubclass(
    loadout.subclassConfig,
    subclassEquipper,
    tempEquipped,
    tempResults,
    setProcessing,
    setEquipStep,
    setResults
  );
}

async function processArmor(
  i: number,
  loadout: Loadout,
  equipper: ArmorEquipper,
  tempEquipped: (DestinyArmor | Subclass | ManifestPlug | ManifestAspect | ManifestStatPlug)[],
  tempResults: EquipResult[][],
  setProcessing: setState,
  setEquipStep: setState,
  setResults: setState
) {
  for (let j = i; j < ARMOR_ARRAY.length; j++) {
    const armor = loadout[ARMOR_ARRAY[j]];
    const mods = (armor.type + 'Mods') as armorMods;

    if (armor.exotic && armor.exotic === true) {
      await processArmor(
        j + 1,
        loadout,
        equipper,
        tempEquipped,
        tempResults,
        setProcessing,
        setEquipStep,
        setResults
      );
      tempEquipped.push(armor);
      setProcessing(tempEquipped);
      setEquipStep('Equipping ' + armor.name + ' ...');
      await equipper.equipArmor(armor);
      setEquipStep('Inserting Mods in ' + armor.name + '...');
      await equipper.equipArmorMods(sortMods(loadout[mods]));
      tempResults.push(equipper.getResult());
      setResults(tempResults);

      break;
    }

    tempEquipped.push(armor);
    setProcessing(tempEquipped);
    setEquipStep('Equipping ' + armor.name + ' ...');
    await equipper.equipArmor(armor);
    setEquipStep('Inserting Mods in ' + armor.name + '...');
    await equipper.equipArmorMods(sortMods(loadout[mods]));
    tempResults.push(equipper.getResult());
    setResults(tempResults);
  }
}

function sortMods(mods: {
  [key: number]: ManifestArmorMod | ManifestArmorStatMod;
}): [string, ManifestArmorMod | ManifestArmorStatMod][] {
  return Object.entries(mods).sort(([, a], [, b]) => b.energyCost - a.energyCost);
}

async function processSubclass(
  subclassConfig: SubclassConfig,
  equipper: SubclassEquipper,
  tempEquipped: (DestinyArmor | Subclass | ManifestPlug | ManifestAspect | ManifestStatPlug)[],
  tempResults: EquipResult[][],
  setProcessing: setState,
  setEquipStep: setState,
  setResults: setState
) {
  tempEquipped.push(subclassConfig.subclass);
  setProcessing(tempEquipped);

  setEquipStep('Equipping ' + subclassConfig.subclass.name + ' ...');
  await equipper.equipSubclass(subclassConfig.subclass);

  setEquipStep('Equipping Super ...');
  await equipper.equipSubclassAbility(subclassConfig.super, 2);

  if (subclassConfig.classAbility) {
    setEquipStep('Equipping Class Ability...');
    await equipper.equipSubclassAbility(subclassConfig.classAbility, 0);
  }

  if (subclassConfig.movementAbility) {
    setEquipStep('Equipping Movement Ability...');
    await equipper.equipSubclassAbility(subclassConfig.movementAbility, 1);
  }

  if (subclassConfig.meleeAbility) {
    setEquipStep('Equipping Melee Ability...');
    await equipper.equipSubclassAbility(subclassConfig.meleeAbility, 3);
  }

  if (subclassConfig.grenade) {
    setEquipStep('Equipping Grenade Ability...');
    await equipper.equipSubclassAbility(subclassConfig.grenade, 4);
  }

  setEquipStep('Equipping Aspects ...');

  let aspectIndex = subclassConfig.damageType === DAMAGE_TYPE.KINETIC ? 7 : 5;

  await equipper.equipSubclassAspect(subclassConfig.aspects[0], aspectIndex);
  await equipper.equipSubclassAspect(subclassConfig.aspects[1], aspectIndex + 1);

  setEquipStep('Equipping Fragments ...');

  let fragmentIndex = subclassConfig.damageType === DAMAGE_TYPE.KINETIC ? 9 : 7;

  for (let i = 0; i < subclassConfig.fragments.length; i++) {
    await equipper.equipSubclassFragments(subclassConfig.fragments[i], fragmentIndex + i);
  }

  const result = equipper.getResult();
  tempResults.push(result);
  setResults(tempResults);
}
