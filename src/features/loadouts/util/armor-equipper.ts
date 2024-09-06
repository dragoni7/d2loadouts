import { BUCKET_HASH, ERRORS, ITEM_LOCATIONS } from '../../../lib/bungie_api/constants';
import {
  equipItemRequest,
  getCharacterInventoryRequest,
  insertSocketPlugFreeRequest,
  transferItemRequest,
} from '../../../lib/bungie_api/requests';
import { DestinyArmor } from '../../../types/d2l-types';
import { ManifestArmorStatMod, ManifestArmorMod } from '../../../types/manifest-types';
import { STATUS } from '../constants';
import { Equipper } from './equipper';

export class ArmorEquipper extends Equipper {
  private inventorySlots: { [key: string]: any[] };

  public constructor() {
    super();

    this.inventorySlots = {
      helmet: [],
      gauntlets: [],
      chestArmor: [],
      legArmor: [],
      classArmor: [],
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
            this.inventorySlots.helmet.push(item);
            continue;
          }
          case BUCKET_HASH.CHEST_ARMOR: {
            this.inventorySlots.chestArmor.push(item);
            continue;
          }
          case BUCKET_HASH.GAUNTLETS: {
            this.inventorySlots.gauntlets.push(item);
            continue;
          }
          case BUCKET_HASH.LEG_ARMOR: {
            this.inventorySlots.legArmor.push(item);
            continue;
          }
          case BUCKET_HASH.CLASS_ARMOR: {
            this.inventorySlots.classArmor.push(item);
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
      message: '',
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
            result.message = error.response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');
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
          result.message = error.response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');
        }
      });
    }

    // equip
    const response = await equipItemRequest(armor.instanceHash, this.characterId).catch((error) => {
      if (error.response) {
        result.status = STATUS.FAIL;
        result.message = error.response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');
      }
    });

    if (response) {
      result.status = STATUS.SUCCESS;
      result.message = response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    this.result.push(result);
  }

  public async equipArmorMods(
    mods: [string, ManifestArmorMod | ManifestArmorStatMod][]
  ): Promise<void> {
    const armor = this.result[0].subject;

    if (!armor) return;

    for (const [index, mod] of mods) {
      const i = Number(index);
      const result = {
        status: STATUS.SUCCESS,
        message: '',
        subject: mod,
      };

      if (i === 4 && armor.artifice === false) continue;

      const response = await insertSocketPlugFreeRequest(
        armor.instanceHash,
        {
          plugItemHash: String(mod.itemHash),
          socketArrayType: 0,
          socketIndex: i === 4 && armor.artifice === true ? 11 : i,
        },
        this.characterId
      ).catch((error) => {
        if (error.response) {
          result.status =
            error.response.data.ErrorCode === ERRORS.SOCKET_ALREADY_CONTAINS_PLUG
              ? STATUS.SUCCESS
              : STATUS.FAIL;
          result.message = error.response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');
        }
      });

      if (response) result.message = response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');

      this.result[i + 1] = result;
    }
  }
}
