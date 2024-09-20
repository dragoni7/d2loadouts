import { CharacterClass } from '../../../types/d2l-types';
import { SharedLoadoutDto } from '../types';

// We'll use a custom base64 encoding to make the strings URL-safe
const base64Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';

function encodeNumber(num: number): string {
  if (num === 0) return base64Chars[0];
  let encoded = '';
  while (num > 0) {
    encoded = base64Chars[num & 63] + encoded;
    num = Math.floor(num / 64); // Use Math.floor for integer division
  }
  return encoded;
}

function decodeNumber(str: string): number {
  let decoded = 0;
  for (let i = 0; i < str.length; i++) {
    decoded = decoded * 64 + base64Chars.indexOf(str[i]);
  }
  return decoded;
}

export function encodeLoadout(loadout: SharedLoadoutDto): string {
  const { mods, subclass, selectedExoticItemHash, selectedValues, statPriority, characterClass } =
    loadout;

  // Encode mods
  const encodedMods = Object.values(mods)
    .map((arr) => arr.map(encodeNumber).join(','))
    .join('|');

  // Encode subclass
  const encodedSubclass = [
    encodeNumber(subclass.damageType),
    encodeNumber(subclass.super),
    subclass.aspects.map(encodeNumber).join(','),
    subclass.fragments.map(encodeNumber).join(','),
    encodeNumber(subclass.classAbility),
    encodeNumber(subclass.meleeAbility),
    encodeNumber(subclass.movementAbility),
    encodeNumber(subclass.grenade),
  ].join('|');

  // Encode selected exotic
  const encodedExotic = encodeNumber(parseInt(selectedExoticItemHash));

  // Encode selected values
  const encodedValues = Object.entries(selectedValues)
    .map(([key, value]) => `${key}:${encodeNumber(value)}`)
    .join(',');

  // Encode stat priority
  const statOrder = ['mobility', 'resilience', 'recovery', 'discipline', 'intellect', 'strength'];
  const encodedPriority = statPriority.map((stat) => statOrder.indexOf(stat).toString()).join('');

  // Encode character class
  const encodedClass = characterClass || '';

  return [
    encodedMods,
    encodedSubclass,
    encodedExotic,
    encodedValues,
    encodedPriority,
    encodedClass,
  ].join('~');
}

export function decodeLoadout(encoded: string): SharedLoadoutDto {
  const [
    encodedMods,
    encodedSubclass,
    encodedExotic,
    encodedValues,
    encodedPriority,
    encodedClass,
  ] = encoded.split('~');

  const mods = {
    helmet: encodedMods.split('|')[0].split(',').map(decodeNumber),
    gauntlets: encodedMods.split('|')[1].split(',').map(decodeNumber),
    chestArmor: encodedMods.split('|')[2].split(',').map(decodeNumber),
    legArmor: encodedMods.split('|')[3].split(',').map(decodeNumber),
    classArmor: encodedMods.split('|')[4].split(',').map(decodeNumber),
  };

  const subclassParts = encodedSubclass.split('|');
  const subclass = {
    damageType: decodeNumber(subclassParts[0]),
    super: decodeNumber(subclassParts[1]),
    aspects: subclassParts[2].split(',').map(decodeNumber),
    fragments: subclassParts[3].split(',').map(decodeNumber),
    classAbility: decodeNumber(subclassParts[4]),
    meleeAbility: decodeNumber(subclassParts[5]),
    movementAbility: decodeNumber(subclassParts[6]),
    grenade: decodeNumber(subclassParts[7]),
  };

  const selectedExoticItemHash = decodeNumber(encodedExotic).toString();

  const selectedValues = Object.fromEntries(
    encodedValues.split(',').map((pair) => {
      const [key, value] = pair.split(':');
      return [key, decodeNumber(value)];
    })
  );

  const statOrder = ['mobility', 'resilience', 'recovery', 'discipline', 'intellect', 'strength'];
  const statPriority = encodedPriority.split('').map((index) => statOrder[parseInt(index)]);

  // Decode character class
  const characterClass = (encodedClass as CharacterClass) || null;

  return {
    mods,
    subclass,
    selectedExoticItemHash,
    selectedValues,
    statPriority,
    characterClass,
  };
}
