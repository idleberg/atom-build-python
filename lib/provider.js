'use babel';

import { EventEmitter } from 'events';
import { install } from 'atom-package-deps';
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
      'python3'
    ],
    order: 0
  },
  customArguments: {
    title: 'Custom Arguments',
    description: 'Specify your preferred arguments for `python`. Will be used in the *Python (user)* target only.',
    type: 'string',
    default: '-u',
    order: 1
  },
  customInterpreter: {
    title: 'Custom Interpreter',
    description: 'Specify a custom Python interpreter (e.g. `abaqus`), overrides Python version specified above',
    type: 'string',
    default: '',
    order: 2
  }
};

// This package depends on build, make sure it's installed
export function activate() {
  if (!atom.inSpecMode()) {
    install(meta.name);
  }
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
      let pythonVersion;

      if (customInterpreter.length > 0) {
        pythonVersion = customInterpreter;
      } else {
        pythonVersion = atom.config.get('build-python.pythonVersion');
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
          exec: pythonVersion,
          args: customArguments,
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          keymap: 'cmd-alt-b',
          atomCommandName: 'python:compile-with-user-settings',
          errorMatch: errorMatch
        }
      ];
    }
  };
}
