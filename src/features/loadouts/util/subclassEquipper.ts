import { equipItemRequest, insertSocketPlugFreeRequest } from '../../../lib/bungie_api/requests';
import { Subclass } from '../../../types/d2l-types';
import { ManifestAspect, ManifestPlug, ManifestStatPlug } from '../../../types/manifest-types';
import { STATUS } from '../constants';
import { Equipper } from './equipper';

export class SubclassEquipper extends Equipper {
  public async equipSubclass(subclass: Subclass) {
    const result = {
      status: STATUS.SUCCESS,
      operationsStatus: '',
      subject: subclass,
    };

    const response = await equipItemRequest(subclass.instanceId, this.characterId).catch(
      (error) => {
        if (error.response) {
          result.status = STATUS.FAIL;
          result.operationsStatus = error.response.data.ErrorStatus.replace(
            /([a-z])([A-Z])/g,
            '$1 $2'
          );
        }
      }
    );

    if (response)
      result.operationsStatus = response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');

    this.result.push(result);
  }

  public async equipSubclassAbility(ability: ManifestPlug, socketArrayIndex: number) {
    const subclass = this.result[0].subject;

    if (!subclass) return;

    const result = {
      status: STATUS.SUCCESS,
      operationsStatus: '',
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
        result.status = STATUS.FAIL;
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

  public async equipSubclassAspect(aspect: ManifestAspect, socketArrayIndex: number) {
    const subclass = this.result[0].subject;

    if (!subclass) return;

    const result = {
      status: STATUS.SUCCESS,
      operationsStatus: '',
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
        result.status = STATUS.FAIL;
        this.result[0].status = result.status;
        result.operationsStatus = error.response.data.ErrorStatus?.replace(
          /([a-z])([A-Z])/g,
          '$1 $2'
        );
      }
    });

    if (response)
      result.operationsStatus = response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2');

    this.result.push(result);
  }

  public async equipSubclassFragments(fragment: ManifestStatPlug, socketArrayIndex: number) {
    const subclass = this.result[0].subject;

    if (!subclass) return;

    const result = {
      status: STATUS.SUCCESS,
      operationsStatus: '',
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
        result.status = STATUS.FAIL;
        this.result[0].status = result.status;
        result.operationsStatus = error.response.data.ErrorStatus?.replace(
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
