import packageJson from '../../package.json';

/**
 * Clears the local storage on app version update
 */
export function handleVersionUpdate() {
  const storedVersion = localStorage.getItem('version');
  if (packageJson.version !== storedVersion || storedVersion === null) {
    localStorage.clear();
    localStorage.setItem('version', packageJson.version);
    console.log(
      'Cleared storage and updated to from version ' + storedVersion + ' to ' + packageJson.version
    );
  }
}
