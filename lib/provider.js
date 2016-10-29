'use babel';

import { install } from 'atom-package-deps';
import { execSync } from 'child_process';
import { EventEmitter } from 'events';

// Package settings
import meta from '../package.json';

this.config = {
  pythonVersion: {
    title: "Python Version",
    description: "Specify version of `python` to build with",
    type: "string",
    default: "Python 3",
    enum: [
        "Python 2",
        "Python 3"
    ],
    order: 0
  },
  customArguments: {
    title: "Custom Arguments",
    description: "Specify your preferred arguments for `python`",
    type: "string",
    "default": "-u",
    order: 1
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
    }

    getNiceName() {
      return 'Python';
    }

    isEligible() {
      try {
        stdout = execSync('python --version');
        if (atom.inDevMode()) atom.notifications.addInfo(meta.name, { detail: stdout, dismissable: false });
        return true;
      } catch (error) {
        if (atom.inDevMode()) atom.notifications.addError(meta.name, { detail: error, dismissable: true });
        return false;
      }
    }

    settings() {
      const errorMatch = [
        '\\s+File \\"(?<file>.*)\\", line (?<line>\\d+).*?\\n(?:[\\s|\\S]+)\\n(?<message>.*rror:.*)'
      ];

      // User settings
      let customArguments = atom.config.get('build-python.customArguments').trim().split(" ");
      customArguments.push('{FILE_ACTIVE}');
      let pythonVersion = atom.config.get('build-python.pythonVersion');

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
