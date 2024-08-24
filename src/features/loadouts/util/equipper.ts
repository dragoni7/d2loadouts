import { EquipResult } from '../types';

export abstract class Equipper {
  protected characterId: number;

  protected result: EquipResult[];

  public constructor() {
    this.characterId = -1;
    this.result = [];
  }

  public setCharacter(characterId: number): void {
    this.characterId = characterId;
  }

  public getResult(): EquipResult[] {
    const temp = this.result;
    this.reset();
    return temp;
  }

  public reset(): void {
    this.result = [];
  }
}
