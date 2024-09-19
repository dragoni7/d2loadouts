import { EquipResult } from '../types';

/**
 * Base builder for equipping objects and building equip results
 */
export abstract class Equipper {
  protected characterId: number;

  protected result: EquipResult[];

  public constructor() {
    this.characterId = -1;
    this.result = [];
  }

  /**
   * Set the equipping character
   * @param characterId character to equip on
   */
  public setCharacter(characterId: number): void {
    this.characterId = characterId;
  }

  /**
   * Gets the equip results
   * @returns the equip result array
   */
  public getResult(): EquipResult[] {
    const temp = this.result;
    this.reset();
    return temp;
  }

  /**
   * Resets the results
   */
  public reset(): void {
    this.result = [];
  }
}
