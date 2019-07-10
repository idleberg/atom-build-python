import meta from '../package.json';

export const configSchema = {
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

export function getConfig(key) {
  return atom.config.get(`${meta.name}.${key}`);
}
