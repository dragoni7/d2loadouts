/**
 * Copies a string to the clipboard
 * @param data string to copy
 */
export function copyToClipBoard(data: string) {
  navigator.clipboard.writeText(data).then(() => {
    alert('Link copied to clipboard!');
  });
}
