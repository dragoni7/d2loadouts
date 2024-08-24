import { BUCKET_HASH, ITEM_LOCATIONS } from '../../../lib/bungie_api/constants';
import {
  equipItemRequest,
  getCharacterInventoryRequest,
  insertSocketPlugFreeRequest,
  transferItemRequest,
} from '../../../lib/bungie_api/requests';
import { DestinyArmor } from '../../../types/d2l-types';
import { ManifestPlug, ManifestArmorStatMod } from '../../../types/manifest-types';
import { STATUS } from '../constants';
import { Equipper } from './equipper';

export class ArmorEquipper extends Equipper {
  private inventorySlots: { [key: string]: any[] };

  public constructor() {
    super();

    this.inventorySlots = {
      helmet: [],
      arms: [],
      chest: [],
      legs: [],
      class: [],
    };
  }

  public override async setCharacter(characterId: number): Promise<void> {
    super.setCharacter(characterId);

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

  public async equipArmor(armor: DestinyArmor): Promise<void> {
    const result = {
      status: STATUS.SUCCESS,
      operationsStatus: '',
      subject: armor,
    };

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
            result.status = STATUS.FAIL;
            result.operationsStatus = error.response.data.ErrorStatus.replace(
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
          result.status = STATUS.FAIL;
          result.operationsStatus = error.response.data.ErrorStatus.replace(
            /([a-z])([A-Z])/g,
            '$1 $2'
          );
        }
      });
    }

    // equip
    const response = await equipItemRequest(armor.instanceHash, this.characterId).catch((error) => {
      if (error.response) {
        result.status = STATUS.FAIL;
        result.operationsStatus = error.response.data.ErrorStatus.replace(
          /([a-z])([A-Z])/g,
          '$1 $2'
        );
      }
    });

    if (response)
      result.operationsStatus = response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');

    this.result.push(result);
  }

  public async equipArmorMods(mods: {
    [key: number]: ManifestPlug | ManifestArmorStatMod;
  }): Promise<void> {
    const armor = this.result[0].subject;

    if (armor) {
      for (let i = 0; i < 5; i++) {
        const result = {
          status: STATUS.SUCCESS,
          operationsStatus: '',
          subject: mods[i],
        };

        if (i === 4 && armor.artifice === false) continue;

        const response = await insertSocketPlugFreeRequest(
          armor.instanceHash,
          {
            plugItemHash: String(mods[i].itemHash),
            socketArrayType: 0,
            socketIndex: i === 4 && armor.artifice === true ? 11 : i,
          },
          this.characterId
        ).catch((error) => {
          if (error.response) {
            result.status = error.response.data.ErrorCode === 1679 ? STATUS.SUCCESS : STATUS.FAIL;
            this.result[0].status = result.status;
            result.operationsStatus = error.response.data.ErrorStatus.replace(
              /([a-z])([A-Z])/g,
              '$1 $2'
            );
          }
        });

        if (response)
          result.operationsStatus = response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');

        this.result.push(result);
      }
    }
  }
}
