import { db } from '@/store/db';
import { updateLoadoutArmorMods } from '@/store/LoadoutReducer';
import { ARMOR_ARRAY, DAMAGE_TYPE } from '../../../lib/bungie_api/constants';
import { snapShotLoadoutRequest } from '../../../lib/bungie_api/requests';
import { ArmorModKeys, Armor, Loadout, Subclass, SubclassConfig } from '../../../types/d2l-types';
import {
  ManifestArmorMod,
  ManifestArmorStatMod,
  ManifestAspect,
  ManifestPlug,
  ManifestStatPlug,
} from '../../../types/manifest-types';
import { EquipResult, setState, SharedLoadoutDto } from '../types';
import { ArmorEquipper } from './armor-equipper';
import { SubclassEquipper } from './subclass-equipper';
import { Dispatch } from 'redux';

/**
 * Saves a loadout from equipped items to Destiny 2
 * @param characterId character for the loadout
 * @param colorHash loadout color identifier hash
 * @param iconHash loadout icon identifier hash
 * @param loadoutIndex loadout index to replace
 * @param nameHash loadout name identifierhash
 */
export async function createInGameLoadout(
  characterId: string,
  colorHash: number,
  iconHash: number,
  loadoutIndex: number,
  nameHash: number
) {
  await snapShotLoadoutRequest(characterId, colorHash, iconHash, loadoutIndex, nameHash);
}

/**
 * Equips a loadout, handling armor first then subclass, setting state as it goes.
 * @param loadout the loadout to equip
 * @param setProcessing the setState for processing object
 * @param setEquipStep the setState for equipping item
 * @param setResults the setState for results
 */
export async function equipLoadout(
  loadout: Loadout,
  setProcessing: setState,
  setEquipStep: setState,
  setResults: setState
) {
  const armorEquipper = new ArmorEquipper();
  const tempEquipped: (Armor | Subclass | ManifestPlug | ManifestAspect | ManifestStatPlug)[] = [];
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

/**
 * Equips armor piece and it's mods, processing exotics last
 * @param i armor index
 * @param loadout loadout to equip
 * @param equipper armor equipper to use
 * @param tempEquipped temp equipped array
 * @param tempResults temp results array
 * @param setProcessing the setState for processing object
 * @param setEquipStep the setState for equipping item
 * @param setResults the setState for results
 */
async function processArmor(
  i: number,
  loadout: Loadout,
  equipper: ArmorEquipper,
  tempEquipped: (Armor | Subclass | ManifestPlug | ManifestAspect | ManifestStatPlug)[],
  tempResults: EquipResult[][],
  setProcessing: setState,
  setEquipStep: setState,
  setResults: setState
) {
  for (let j = i; j < ARMOR_ARRAY.length; j++) {
    const armor = loadout[ARMOR_ARRAY[j]];
    const mods = (armor.type + 'Mods') as ArmorModKeys;

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

/**
 * Sorts a mod dicationary
 * @param mods mods to sort
 * @returns sorted mods array
 */
function sortMods(mods: {
  [key: number]: ManifestArmorMod | ManifestArmorStatMod;
}): [string, ManifestArmorMod | ManifestArmorStatMod][] {
  return Object.entries(mods).sort(([, a], [, b]) => b.energyCost - a.energyCost);
}

/**
 * Equips subclass config
 * @param subclassConfig subclass config to equip
 * @param equipper subclass equipper to use
 * @param tempEquipped temp equipped array
 * @param tempResults temp results array
 * @param setProcessing the setState for processing object
 * @param setEquipStep the setState for equipping item
 * @param setResults the setState for results
 */
async function processSubclass(
  subclassConfig: SubclassConfig,
  equipper: SubclassEquipper,
  tempEquipped: (Armor | Subclass | ManifestPlug | ManifestAspect | ManifestStatPlug)[],
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

/**
 * Equips mods from a shared loadout into the loadout config
 * @param sharedLoadoutDto the shared loadout
 * @param dispatch dispatch
 */
export async function equipSharedMods(sharedLoadoutDto: SharedLoadoutDto, dispatch: Dispatch) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < ARMOR_ARRAY.length; j++) {
      const hash = sharedLoadoutDto.mods[ARMOR_ARRAY[j]][i];

      // only equip non stat mods
      // stat mods should be equipped by the user according to the calculated permutation
      const armorMod = await db.manifestArmorModDef.where('itemHash').equals(hash).first();
      if (armorMod) {
        dispatch(
          updateLoadoutArmorMods({
            armorType: ARMOR_ARRAY[j],
            slot: i,
            plug: armorMod,
          })
        );
      }
    }
  }
}
