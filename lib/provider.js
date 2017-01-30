'use babel';

import { EventEmitter } from 'events';
import { spawnSync } from 'child_process';

// Package settings
import meta from '../package.json';

this.config = {
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
  }
};

// This package depends on build, make sure it's installed
export function activate() {
  if (atom.config.get('build-python.manageDependencies') && !atom.inSpecMode()) {
    this.satisfyDependencies();
  }
}

export function satisfyDependencies() {
  let k;
  let v;

  require('atom-package-deps').install(meta.name);

  const ref = meta['package-deps'];
  const results = [];

  for (k in ref) {
    if (typeof ref !== 'undefined' && ref !== null) {
      v = ref[k];
      if (atom.packages.isPackageDisabled(v)) {
        if (atom.inDevMode()) {
          console.log('Enabling package \'' + v + '\'');
        }
        results.push(atom.packages.enablePackage(v));
      } else {
        results.push(void 0);
      }
    }
  }
  return results;
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

    isEligible() {
      try {
        spawnSync('python --version');
      } catch (error) {
        if (atom.inDevMode()) atom.notifications.addError(meta.name, { detail: error, dismissable: true });
        return false;
      }

      return true;
    }

    settings() {
      const errorMatch = [
        '\\s+File \\"(?<file>.*)\\", line (?<line>\\d+).*?\\n(?:[\\s|\\S]+)\\n(?<message>.*rror:.*)'
      ];

      // User settings
      const customArguments = atom.config.get('build-python.customArguments').trim().split(' ');
      customArguments.push('{FILE_ACTIVE}');

      const customInterpreter = atom.config.get('build-python.customInterpreter');
      const pythonVersion = atom.config.get('build-python.pythonVersion');
      let pythonInterpreter;

      if (customInterpreter.length > 0) {
        pythonInterpreter = customInterpreter;
      } else {
        pythonInterpreter = pythonVersion;
      }

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
