import { DestinyArmor } from "../../types";

export const modReverseDict: { [key: number]: (armor: DestinyArmor) => void } =
  {
    2724608735: (armor: DestinyArmor) =>
      (armor.intellect = armor.intellect - 10),
    3897511453: (armor: DestinyArmor) =>
      (armor.intellect = armor.intellect - 5),
    3160845295: (armor: DestinyArmor) =>
      (armor.intellect = armor.intellect - 3),
    1180408010: (armor: DestinyArmor) =>
      (armor.resilience = armor.resilience - 10),
    2532323436: (armor: DestinyArmor) =>
      (armor.resilience = armor.resilience - 5),
    199176566: (armor: DestinyArmor) =>
      (armor.resilience = armor.resilience - 3),
    1435557120: (armor: DestinyArmor) =>
      (armor.discipline = armor.discipline - 10),
    4021790309: (armor: DestinyArmor) =>
      (armor.discipline = armor.discipline - 5),
    617569843: (armor: DestinyArmor) =>
      (armor.discipline = armor.discipline - 3),
    204488676: (armor: DestinyArmor) => (armor.recovery = armor.recovery - 10),
    1237786518: (armor: DestinyArmor) => (armor.recovery = armor.recovery - 5),
    539459624: (armor: DestinyArmor) => (armor.recovery = armor.recovery - 3),
    183296050: (armor: DestinyArmor) => (armor.mobility = armor.mobility - 10),
    1703647492: (armor: DestinyArmor) => (armor.mobility = armor.mobility - 5),
    2322202118: (armor: DestinyArmor) => (armor.mobility = armor.mobility - 3),
    287799666: (armor: DestinyArmor) => (armor.strength = armor.strength - 10),
    2639422088: (armor: DestinyArmor) => (armor.strength = armor.strength - 5),
    2507624050: (armor: DestinyArmor) => (armor.strength = armor.strength - 3),
  };
