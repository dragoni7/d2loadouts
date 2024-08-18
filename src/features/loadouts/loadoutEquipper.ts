import { BUCKET_HASH, ITEM_LOCATIONS } from '../../lib/bungie_api/Constants';
import {
  equipItemRequest,
  getCharacterInventoryRequest,
  insertSocketPlugFreeRequest,
  transferItemRequest,
} from '../../lib/bungie_api/Requests';
import { DestinyArmor, Plug } from '../../types';
import { STATUS } from './constants';
import { EquipResult } from './types';

export class LoadoutEquipper {
  private inventorySlots: { [key: string]: any[] };
  private characterId: number;

  private result: EquipResult;

  public constructor() {
    this.characterId = -1;
    this.inventorySlots = {
      helmet: [],
      arms: [],
      chest: [],
      legs: [],
      class: [],
    };

    this.result = {
      status: STATUS.SUCCESS,
      operationsStatus: [],
      subject: undefined,
    };
  }

  public async setCharacter(characterId: number) {
    this.characterId = characterId;

    const response = await getCharacterInventoryRequest(this.characterId);

    if (response.data.Response) {
      const items = response.data.Response.inventory.data.items;

      for (const item of items) {
        // get armor slot counts
        switch (item.bucketHash) {
          case BUCKET_HASH.HELMET: {
            this.inventorySlots['helmet'].push(item);
            continue;
          }
          case BUCKET_HASH.CHEST_ARMOR: {
            this.inventorySlots['chest'].push(item);
            continue;
          }
          case BUCKET_HASH.GAUNTLETS: {
            this.inventorySlots['arms'].push(item);
            continue;
          }
          case BUCKET_HASH.LEG_ARMOR: {
            this.inventorySlots['legs'].push(item);
            continue;
          }
          case BUCKET_HASH.CLASS_ARMOR: {
            this.inventorySlots['class'].push(item);
            continue;
          }
          default: {
            continue;
          }
        }
      }
    }
  }

  public async equipArmor(armor: DestinyArmor) {
    // if armor not in character inventory, transfer first
    if (armor.location !== ITEM_LOCATIONS.CHARACTER_INVENTORY) {
      // inventory doesn't have space, transfer last item out first
      if (this.inventorySlots[armor.type].length === 9) {
        let toVault = this.inventorySlots[armor.type].at(-1);
        await transferItemRequest(
          Number(toVault.itemHash),
          1,
          true,
          toVault.itemInstanceId,
          this.characterId
        ).catch((error) => {
          if (error.response) {
            this.result.status = STATUS.FAIL;
            this.result.operationsStatus[0] = error.response.data.ErrorStatus.replace(
              /([a-z])([A-Z])/g,
              '$1 $2'
            );
          }
        });
      }

      // transfer item to inventory
      await transferItemRequest(
        Number(armor.itemHash),
        1,
        false,
        armor.instanceHash,
        this.characterId
      ).catch((error) => {
        if (error.response) {
          this.result.status = STATUS.FAIL;
          this.result.operationsStatus[0] = error.response.data.ErrorStatus.replace(
            /([a-z])([A-Z])/g,
            '$1 $2'
          );
        }
      });
    }

    // equip
    const response = await equipItemRequest(armor.instanceHash, this.characterId).catch((error) => {
      if (error.response) {
        this.result.status = STATUS.FAIL;
        this.result.operationsStatus[0] = error.response.data.ErrorStatus.replace(
          /([a-z])([A-Z])/g,
          '$1 $2'
        );
      }
    });

    if (response)
      this.result.operationsStatus[0] = response.data.ErrorStatus.replace(
        /([a-z])([A-Z])/g,
        '$1 $2'
      );
  }

  public async equipArmorMods(armor: DestinyArmor, mods: { [key: number]: Plug }) {
    for (let i = 0; i < 5; i++) {
      if (i === 4 && armor.artifice === false) continue;

      const response = await insertSocketPlugFreeRequest(
        armor.instanceHash,
        mods[i],
        this.characterId
      ).catch((error) => {
        if (error.response) {
          this.result.status = STATUS.FAIL;
          this.result.operationsStatus[i + 1] = error.response.data.ErrorStatus.replace(
            /([a-z])([A-Z])/g,
            '$1 $2'
          );
        }
      });

      if (response)
        this.result.operationsStatus[i + 1] = response?.data.ErrorStatus.replace(
          /([a-z])([A-Z])/g,
          '$1 $2'
        );
    }
  }

  public getResult(): EquipResult {
    const temp = this.result;
    this.reset();
    return temp;
  }

  public reset(): void {
    this.result = {
      status: STATUS.SUCCESS,
      operationsStatus: [],
      subject: undefined,
    };
  }
}
