import { ERRORS } from '../../../lib/bungie_api/constants';
import { equipItemRequest, insertSocketPlugFreeRequest } from '../../../lib/bungie_api/requests';
import { Subclass } from '../../../types/d2l-types';
import { ManifestAspect, ManifestPlug, ManifestStatPlug } from '../../../types/manifest-types';
import { STATUS } from '../constants';
import { Equipper } from './equipper';

/**
 * Builder for equipping subclasses and mods and creating equip result array
 */
export class SubclassEquipper extends Equipper {
  /**
   * Equips a subclass
   * @param subclass subclass to equip
   */
  public async equipSubclass(subclass: Subclass) {
    const result = {
      status: STATUS.SUCCESS,
      message: '',
      subject: subclass,
    };

    const response = await equipItemRequest(subclass.instanceId, this.characterId).catch(
      (error) => {
        if (error.response) {
          result.status = STATUS.FAIL;
          result.message = error.response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');
        }
      }
    );

    if (response) result.message = response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');

    this.result.push(result);
  }

  /**
   * Equips an ability into a subclass
   * @param ability subclass ability to equip
   * @param socketArrayIndex index of ability
   */
  public async equipSubclassAbility(ability: ManifestPlug, socketArrayIndex: number) {
    const subclass = this.result[0].subject;

    if (!subclass) return;

    const result = {
      status: STATUS.SUCCESS,
      message: '',
      subject: ability,
    };

    const response = await insertSocketPlugFreeRequest(
      subclass.instanceId,
      {
        plugItemHash: String(ability.itemHash),
        socketArrayType: 0,
        socketIndex: socketArrayIndex,
      },
      this.characterId
    ).catch((error) => {
      if (error.response) {
        error.response.data.ErrorCode === ERRORS.SOCKET_ALREADY_CONTAINS_PLUG
          ? STATUS.SUCCESS
          : STATUS.FAIL;
        result.message = error.response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');
      }
    });

    if (response) result.message = response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');

    this.result.push(result);
  }

  /**
   * Equips a subclass aspect
   * @param aspect aspect to equip
   * @param socketArrayIndex aspect index
   */
  public async equipSubclassAspect(aspect: ManifestAspect, socketArrayIndex: number) {
    const subclass = this.result[0].subject;

    if (!subclass) return;

    const result = {
      status: STATUS.SUCCESS,
      message: '',
      subject: aspect,
    };

    const response = await insertSocketPlugFreeRequest(
      subclass.instanceId,
      {
        plugItemHash: String(aspect.itemHash),
        socketArrayType: 0,
        socketIndex: socketArrayIndex,
      },
      this.characterId
    ).catch((error) => {
      if (error.response) {
        error.response.data.ErrorCode === ERRORS.SOCKET_ALREADY_CONTAINS_PLUG
          ? STATUS.SUCCESS
          : STATUS.FAIL;
        result.message = error.response.data.ErrorStatus?.replace(/([a-z])([A-Z])/g, '$1 $2');
      }
    });

    if (response) result.message = response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');

    this.result.push(result);
  }

  /**
   * Equips a subclass fragment
   * @param fragment fragment to equip
   * @param socketArrayIndex fragment index
   */
  public async equipSubclassFragments(fragment: ManifestStatPlug, socketArrayIndex: number) {
    const subclass = this.result[0].subject;

    if (!subclass) return;

    const result = {
      status: STATUS.SUCCESS,
      message: '',
      subject: fragment,
    };

    const response = await insertSocketPlugFreeRequest(
      subclass.instanceId,
      {
        plugItemHash: String(fragment.itemHash),
        socketArrayType: 0,
        socketIndex: socketArrayIndex,
      },
      this.characterId
    ).catch((error) => {
      if (error.response) {
        error.response.data.ErrorCode === ERRORS.SOCKET_ALREADY_CONTAINS_PLUG
          ? STATUS.SUCCESS
          : STATUS.FAIL;
        result.message = error.response.data.ErrorStatus?.replace(/([a-z])([A-Z])/g, '$1 $2');
      }
    });

    if (response) result.message = response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');

    this.result.push(result);
  }
}
