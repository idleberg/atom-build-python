'use babel';

import { EventEmitter } from 'events';
import { install } from 'atom-package-deps';
import { platform} from 'os';
import { spawn } from 'child_process';

// Package settings
import meta from '../package.json';

export const config = {
  pythonVersion: {
    title: 'Python Version',
    description: 'Specify version of `python` to build with',
    type: 'string',
    default: 'python3',
    enum: [
      'python',
      'python3',
      'py'
    ],
    order: 0
  },
  customInterpreter: {
    title: 'Custom Interpreter',
    description: 'Specify a custom Python interpreter (e.g. `abaqus`), to be used with the *Python (user)* target. Falls back to Python Version specified above when left empty.',
    type: 'string',
    default: '',
    order: 1
  },
  customArguments: {
    title: 'Custom Arguments',
    description: 'Specify your preferred arguments, to be used with the *Python (user)* target',
    type: 'string',
    default: '-u',
    order: 2
  },
  manageDependencies: {
    title: 'Manage Dependencies',
    description: 'When enabled, third-party dependencies will be installed automatically',
    type: 'boolean',
    default: true,
    order: 3
  },
  alwaysEligible: {
    title: 'Always Eligible',
    description: 'The build provider will be available in your project, even when not eligible',
    type: 'boolean',
    default: false,
    order: 4
  }
};

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

function spawnPromise(cmd, args) {
  return new Promise(function (resolve, reject) {
    const child = spawn(cmd, args);
    let stdOut;
    let stdErr;

    child.stdout.on('data', function (line) {
      stdOut += line.toString().trim();
    });

    child.stderr.on('data', function (line) {
      stdErr += line.toString().trim();
    });

    child.on('close', function (code) {
      if (code === 0) {
        resolve(stdOut);
      }

      reject(stdErr);
    });
  });
}

export function which() {
  return (platform() === 'win32') ? 'where' : 'which';
}

export function provideBuilder() {
  return class PythonProvider extends EventEmitter {
    constructor(cwd) {
      super();
      this.cwd = cwd;
      atom.config.observe('build-python.customArguments', () => this.emit('refresh'));
      atom.config.observe('build-python.pythonVersion', () => this.emit('refresh'));
      atom.config.observe('build-python.customInterpreter', () => this.emit('refresh'));
    }

    getNiceName() {
      return 'Python';
    }

    async isEligible() {
      if (atom.config.get(meta.name + '.alwaysEligible') === true) {
        return true;
      }

      const pythonVersion = atom.config.get(meta.name + '.pythonVersion');
      const whichCmd = await spawnPromise(which(), [pythonVersion]);

      if (whichCmd.stdout && whichCmd.stdout.toString()) {
        return true;
      }

      return false;
    }

    settings() {
      const errorMatch = [
        '\\s+File \\"(?<file>.*)\\", line (?<line>\\d+).*?\\n(?:[\\s|\\S]+)\\n(?<message>.*rror:.*)'
      ];

      // User settings
      const customArguments = atom.config.get(meta.name + '.customArguments').trim().split(' ');
      customArguments.push('{FILE_ACTIVE}');

      const customInterpreter = atom.config.get(meta.name + '.customInterpreter');
      const pythonVersion = atom.config.get(meta.name + '.pythonVersion');
      const pythonInterpreter = (customInterpreter.length > 0) ? customInterpreter : pythonVersion;

      return [
        {
          name: 'Python',
          exec: pythonVersion,
          args: [ '-u', '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          keymap: 'cmd-alt-b',
          atomCommandName: 'python:compile-script',
          errorMatch: errorMatch
        },
        {
          name: 'Python (compileall)',
          exec: pythonVersion,
          args: [ '-u', '-m', 'compileall', '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          keymap: 'cmd-alt-b',
          atomCommandName: 'python:compile-script',
          errorMatch: errorMatch
        },
        {
          name: 'Python (compileall, optimized)',
          exec: pythonVersion,
          args: [ '-u', '-O', '-m', 'compileall', '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          keymap: 'cmd-alt-b',
          atomCommandName: 'python:compile-script',
          errorMatch: errorMatch
        },
        {
          name: 'Python (user)',
          exec: pythonInterpreter,
          args: customArguments,
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          keymap: 'cmd-alt-shift-b',
          atomCommandName: 'python:compile-with-user-settings',
          errorMatch: errorMatch
        }
      ];
    }
  };
}

// This package depends on build, make sure it's installed
export function activate() {
  if (atom.config.get(meta.name + '.manageDependencies') === true) {
    this.satisfyDependencies();
  }
}
