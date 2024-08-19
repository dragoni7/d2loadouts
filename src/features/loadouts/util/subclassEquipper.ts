import { equipItemRequest, insertSocketPlugFreeRequest } from '../../../lib/bungie_api/Requests';
import { Plug } from '../../../types';
import { Equipper } from './equipper';

export class SubclassEquipper extends Equipper {
  public async equipSubclass(instanceId: string) {
    await equipItemRequest(instanceId, this.characterId);
  }

  public async equipSubclassAbility(instanceId: string, ability: Plug) {
    await insertSocketPlugFreeRequest(instanceId, ability, this.characterId);
  }

  public async equipSubclassAspect(instanceId: string, aspect: Plug) {
    await insertSocketPlugFreeRequest(instanceId, aspect, this.characterId);
  }

  public async equipSubclassFragments(instanceId: string, fragments: Plug[]) {
    fragments.forEach(async (fragment) => {
      await insertSocketPlugFreeRequest(instanceId, fragment, this.characterId);
    });
  }
}
