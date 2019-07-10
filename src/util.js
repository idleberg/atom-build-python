import meta from '../package.json';
import { install } from 'atom-package-deps';
import { platform } from 'os';

export function satisfyDependencies() {
  install(meta.name);

  const packageDeps = meta['package-deps'];

  packageDeps.forEach( packageDep => {
    if (packageDep) {
      if (atom.packages.isPackageDisabled(packageDep)) {
        if (atom.inDevMode()) console.log(`Enabling package '${packageDep}\'`);
        atom.packages.enablePackage(packageDep);
      }
    }
  });
}

export function which() {
  return (platform() === 'win32') ? 'where' : 'which';
}
