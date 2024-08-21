import { equipItemRequest, insertSocketPlugFreeRequest } from '../../../lib/bungie_api/Requests';
import { Plug, Subclass } from '../../../types';
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

  public async equipSubclassAbility(ability: Plug) {
    const response = await insertSocketPlugFreeRequest(
      this.result.subject.instanceId,
      ability,
      this.characterId
    ).catch((error) => {
      if (error.response) {
        this.result.status = STATUS.FAIL;
        this.result.operationsStatus[1] = error.response.data.ErrorStatus.replace(
          /([a-z])([A-Z])/g,
          '$1 $2'
        );
      }
    });

    if (response)
      this.result.operationsStatus[1] = response.data.ErrorStatus.replace(
        /([a-z])([A-Z])/g,
        '$1 $2'
      );
  }

  public async equipSubclassAspect(aspect: Plug) {
    const response = await insertSocketPlugFreeRequest(
      this.result.subject.instanceId,
      aspect,
      this.characterId
    ).catch((error) => {
      if (error.response) {
        this.result.status = STATUS.FAIL;
        this.result.operationsStatus[2] = error.response.data.ErrorStatus.replace(
          /([a-z])([A-Z])/g,
          '$1 $2'
        );
      }
    });

    if (response)
      this.result.operationsStatus[2] = response.data.ErrorStatus.replace(
        /([a-z])([A-Z])/g,
        '$1 $2'
      );
  }

  public async equipSubclassFragments(fragments: Plug[]) {
    for (let i = 0; i < fragments.length; i++) {
      const response = await insertSocketPlugFreeRequest(
        this.result.subject.instanceId,
        fragments[i],
        this.characterId
      ).catch((error) => {
        if (error.response) {
          this.result.status = STATUS.FAIL;
          this.result.operationsStatus[i + 3] = error.response.data.ErrorStatus.replace(
            /([a-z])([A-Z])/g,
            '$1 $2'
          );
        }
      });

      if (response)
        this.result.operationsStatus[i + 3] = response.data.ErrorStatus.replace(
          /([a-z])([A-Z])/g,
          '$1 $2'
        );
    }
  }
}
