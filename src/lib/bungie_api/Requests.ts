import axios, { AxiosResponse } from 'axios';
import { getBungieMembershipId, getTokens } from '../../store/TokensStore';
import { _get, _post } from './BungieApiClient';
import { API_CREDENTIALS } from './Constants';
import { store } from '../../store';

export function getDestinyMembershipsRequest(): Promise<AxiosResponse<any, any>> {
  const bungieMembershipId = getBungieMembershipId();
  const accessToken = getTokens()?.accessToken.value;

  return _get(`/Platform/User/GetMembershipsById/${bungieMembershipId}/1/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getProfileDataRequest(): Promise<AxiosResponse<any, any>> {
  const accessToken = getTokens()?.accessToken.value;
  const destinyMembership = store.getState().destinyMembership.membership;

  return _get(
    `/Platform/Destiny2/${destinyMembership.membershipType}/Profile/${destinyMembership.membershipId}/?components=102,200,201,300,205,302,304,305`,
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
