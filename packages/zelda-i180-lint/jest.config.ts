// @ts-ignore
import { Config, createConfig } from '@umijs/test';

export default {
  displayName: 'zelda-i180-lint',
  ...createConfig(),
  collectCoverageFrom: ['./**/*.{ts,js,tsx,jsx}'],
  moduleDirectories: ['node_modules', '../../node_modules'],
} as Config.InitialOptions;
