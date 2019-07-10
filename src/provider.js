'use babel';

import { configSchema, getConfig } from './config';
import { EventEmitter } from 'events';
import { satisfyDependencies, which } from './util';
import { spawnSync } from 'child_process';

export { configSchema as config };

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
      if (getConfig('alwaysEligible') === true) {
        return true;
      }

      const pythonVersion = getConfig('pythonVersion');
      const whichCmd = spawnSync(which(), [pythonVersion]);

      return (whichCmd.stdout && whichCmd.stdout.toString().length) ? true : false;
    }

    settings() {
      const errorMatch = [
        '\\s+File \\"(?<file>.*)\\", line (?<line>\\d+).*?\\n(?:[\\s|\\S]+)\\n(?<message>.*rror:.*)'
      ];

      // User settings
      const customArguments = getConfig('customArguments').trim().split(' ');
      customArguments.push('{FILE_ACTIVE}');

      const customInterpreter = getConfig('customInterpreter');
      const pythonVersion = getConfig('pythonVersion');
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
export async function activate() {
  if (getConfig('manageDependencies') === true) {
    satisfyDependencies();
  }
}
