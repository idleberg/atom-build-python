import { platform } from 'os';

export function which() {
  return (platform() === 'win32') ? 'where' : 'which';
}
