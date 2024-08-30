import { decompressFromEncodedURIComponent } from 'lz-string';

export const parseLoadoutLink = (link: string) => {
  const url = new URL(link);
  const compressedData = url.searchParams.get('data');
  
  if (!compressedData) {
    throw new Error('Invalid loadout link');
  }

  const decompressedData = decompressFromEncodedURIComponent(compressedData);
  
  if (!decompressedData) {
    throw new Error('Failed to decompress loadout data');
  }

  return JSON.parse(decompressedData);
};