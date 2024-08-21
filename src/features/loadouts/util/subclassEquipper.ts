import { equipItemRequest, insertSocketPlugFreeRequest } from '../../../lib/bungie_api/requests';
import { Plug, Subclass } from '../../../types/d2l-types';
import { ManifestAspect, ManifestPlug, ManifestStatPlug } from '../../../types/manifest-types';
import { STATUS } from '../constants';
import { Equipper } from './equipper';

export class SubclassEquipper extends Equipper {
  public async equipSubclass(subclass: Subclass) {
    this.result.subject = subclass;

    const response = await equipItemRequest(subclass.instanceId, this.characterId).catch(
      (error) => {
        if (error.response) {
          this.result.status = STATUS.FAIL;
          this.result.operationsStatus[0] = error.response.data.ErrorStatus.replace(
            /([a-z])([A-Z])/g,
            '$1 $2'
          );
        }
      }
    );

    if (response)
      this.result.operationsStatus[0] = response.data.ErrorStatus.replace(
        /([a-z])([A-Z])/g,
        '$1 $2'
      );
  }

  public async equipSubclassAbility(ability: ManifestPlug, socketArrayIndex: number) {
    const response = await insertSocketPlugFreeRequest(
      this.result.subject.instanceId,
      {
        plugItemHash: String(ability.itemHash),
        socketArrayType: 0,
        socketIndex: socketArrayIndex,
      },
      this.characterId
    ).catch((error) => {
      if (error.response) {
        this.result.status = STATUS.FAIL;
        this.result.operationsStatus.push(
          error.response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2')
        );
      }
    });

    if (response)
      this.result.operationsStatus.push(
        response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2')
      );
  }

  public async equipSubclassAspect(aspect: ManifestAspect, socketArrayIndex: number) {
    const response = await insertSocketPlugFreeRequest(
      this.result.subject.instanceId,
      {
        plugItemHash: String(aspect.itemHash),
        socketArrayType: 0,
        socketIndex: socketArrayIndex,
      },
      this.characterId
    ).catch((error) => {
      if (error.response) {
        this.result.status = STATUS.FAIL;
        this.result.operationsStatus.push(
          error.response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2')
        );
      }
    });

    if (response)
      this.result.operationsStatus.push(
        response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2')
      );
  }

  public async equipSubclassFragments(fragment: ManifestStatPlug, socketArrayIndex: number) {
    const response = await insertSocketPlugFreeRequest(
      this.result.subject.instanceId,
      {
        plugItemHash: String(fragment.itemHash),
        socketArrayType: 0,
        socketIndex: socketArrayIndex,
      },
      this.characterId
    ).catch((error) => {
      if (error.response) {
        this.result.status = STATUS.FAIL;
        this.result.operationsStatus.push(
          error.response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2')
        );
      }
    });

    if (response)
      this.result.operationsStatus.push(
        response.data.ErrorStatus.replace(/([a-z])([A-Z])/g, '$1 $2')
      );
  }
}
