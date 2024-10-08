import axios, { AxiosResponse } from 'axios';
import { getBungieMembershipId, getTokens } from '../../store/TokensStore';
import { _get, _post } from './bungie-api-client';
import { API_COMPONENTS, API_CREDENTIALS } from './constants';
import { store } from '../../store';
import { Plug } from '../../types/d2l-types';

export function getDestinyMembershipsRequest(): Promise<AxiosResponse<any, any>> {
  const bungieMembershipId = getBungieMembershipId();
  const accessToken = getTokens()?.accessToken.value;

  return _get(`/Platform/User/GetMembershipsById/${bungieMembershipId}/1/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getProfileDataRequest(
  components: number[] = [
    API_COMPONENTS.PROFILE_INVENTORIES,
    API_COMPONENTS.CHARACTERS,
    API_COMPONENTS.CHARACTER_INVENTORIES,
    API_COMPONENTS.ITEM_INSTANCES,
    API_COMPONENTS.CHARACTER_EQUIPMENT,
    API_COMPONENTS.CHARACTER_LOADOUTS,
    API_COMPONENTS.ITEM_PERKS,
    API_COMPONENTS.ITEM_STATS,
    API_COMPONENTS.ITEM_SOCKETS,
    API_COMPONENTS.COLLECTIBLES,
  ]
): Promise<AxiosResponse<any, any>> {
  const accessToken = getTokens()?.accessToken.value;
  const destinyMembership = store.getState().destinyMembership.membership;

  return _get(
    `/Platform/Destiny2/${destinyMembership.membershipType}/Profile/${
      destinyMembership.membershipId
    }/?components=${components.join(',')}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getCharacterInventoryRequest(
  characterId: number
): Promise<AxiosResponse<any, any>> {
  const accessToken = getTokens()?.accessToken.value;
  const destinyMembership = store.getState().destinyMembership.membership;

  return _get(
    `/Platform/Destiny2/${destinyMembership.membershipType}/Profile/${destinyMembership.membershipId}/Character/${characterId}/?components=201`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function transferItemRequest(
  itemReferenceHash: number,
  stackSize: number,
  transferToVault: boolean,
  itemId: string,
  characterId: number
): Promise<AxiosResponse<any, any>> {
  const accessToken = getTokens()?.accessToken.value;
  const membershipType = store.getState().destinyMembership.membership.membershipType;

  let body = {
    characterId: characterId,
    itemId: itemId,
    itemReferenceHash: itemReferenceHash,
    membershipType: membershipType,
    stackSize: stackSize,
    transferToVault: transferToVault,
  };

  return _post('/Platform/Destiny2/Actions/Items/TransferItem/', body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function equipItemRequest(
  itemId: string,
  characterId: number
): Promise<AxiosResponse<any, any>> {
  const accessToken = getTokens()?.accessToken.value;
  const membershipType = store.getState().destinyMembership.membership.membershipType;

  let body = {
    characterId: characterId,
    itemId: itemId,
    membershipType: membershipType,
  };

  return _post('/Platform/Destiny2/Actions/Items/EquipItem/', body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function equipItemsRequest(
  itemIds: string[],
  characterId: number
): Promise<AxiosResponse<any, any>> {
  const accessToken = getTokens()?.accessToken.value;
  const membershipType = store.getState().destinyMembership.membership.membershipType;

  let body = {
    characterId: characterId,
    itemIds: itemIds,
    membershipType: membershipType,
  };

  return _post('/Platform/Destiny2/Actions/Items/EquipItems/', body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function snapShotLoadoutRequest(
  characterId: string,
  colorHash: number,
  iconHash: number,
  loadoutIndex: number,
  nameHash: number
): Promise<AxiosResponse<any, any>> {
  const accessToken = getTokens()?.accessToken.value;
  const membershipType = store.getState().destinyMembership.membership.membershipType;

  let body = {
    characterId: characterId,
    colorHash: colorHash,
    iconHash: iconHash,
    loadoutIndex: loadoutIndex,
    nameHash: nameHash,
    membershipType: membershipType,
  };

  return _post('/Platform/Destiny2/Actions/Loadouts/SnapshotLoadout/', body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function insertSocketPlugFreeRequest(
  itemId: string,
  plug: Plug | null,
  characterId: number
): Promise<AxiosResponse<any, any>> {
  const accessToken = getTokens()?.accessToken.value;
  const membershipType = store.getState().destinyMembership.membership.membershipType;

  let body = {
    characterId: characterId,
    itemId: itemId,
    membershipType: membershipType,
    plug: plug,
  };

  return _post('/Platform/Destiny2/Actions/Items/InsertSocketPlugFree/', body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getOAuthTokensRequest(
  refresh: boolean,
  authCode: string
): Promise<AxiosResponse<any, any>> {
  const refreshToken = getTokens()?.refreshToken?.value;

  let body = refresh
    ? `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${API_CREDENTIALS.CLIENT_ID}&client_secret=${API_CREDENTIALS.CLIENT_SECRET}`
    : `grant_type=authorization_code&code=${authCode}&client_id=${API_CREDENTIALS.CLIENT_ID}&client_secret=${API_CREDENTIALS.CLIENT_SECRET}`;

  return _post('/Platform/App/OAuth/Token/', body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${window.btoa(
        `${API_CREDENTIALS.CLIENT_ID}:${API_CREDENTIALS.CLIENT_SECRET}`
      )}`,
    },
  });
}

export function getManifestRequest(): Promise<AxiosResponse<any, any>> {
  return _get('/Platform/Destiny2/Manifest/');
}

export function getManifestComponentRequest(component: string): Promise<AxiosResponse<any, any>> {
  return axios.get('https://www.bungie.net' + component, {
    responseType: 'json',
  });
}
