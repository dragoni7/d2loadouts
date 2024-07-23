import { generateToken } from '../../lib/bungie_api/TokenService';

function getAuthCodeFromURL(): string | null {
  return window.location.href.includes('code=') ? window.location.href.split('code=')[1] : null;
}

/**
 * Get auth tokens from auth code
 * @returns whether or not tokens were successfully generated
 */
export async function handleAuthReturn(): Promise<boolean> {
  const code = getAuthCodeFromURL();

  console.log('auth code is ' + code);

  if (!code?.length) {
    console.log('Could not find authorization code');
    return false;
  }

  try {
    await generateToken(false, code);
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
}
