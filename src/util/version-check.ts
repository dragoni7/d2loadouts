import packageJson from '../../package.json';

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
