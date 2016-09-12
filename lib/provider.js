'use babel';

import { install } from 'atom-package-deps';
import { exec } from 'child_process';

// Package settings
import meta from '../package.json';
const notEligible = `**${meta.name}**: \`python\` is not in your PATH`;

// This package depends on build, make sure it's installed
export function activate() {
  if (!atom.inSpecMode()) {
    install(meta.name);
  }
}

export function provideBuilder() {
  return class PythonProvider {
    constructor(cwd) {
      this.cwd = cwd;
    }

    getNiceName() {
      return 'Python';
    }

    isEligible() {
      exec('python --version', function (error, stdout, stderr) {
          // No Python installed
        if (error !== null) {
          if (atom.inDevMode()) atom.notifications.addError(notEligible, { detail: error, dismissable: true });
          return false;
        }
        if (atom.inDevMode()) atom.notifications.addInfo(`**${meta.name}**`, { detail: stdout, dismissable: false });
      });

      return true;
    }

    settings() {
      const errorMatch = [
        '\\s+File \\"(?<file>.*)\\", line (?<line>\\d+).*?\\n(?:[\\s|\\S]+)\\n(?<message>.*rror:.*)'
      ];

      return [
        {
          name: 'Python',
          exec: 'python',
          args: [ '-u', '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          keymap: 'cmd-alt-b',
          atomCommandName: 'python:compile-script',
          errorMatch: errorMatch
        }
      ];
    }
  };
}
