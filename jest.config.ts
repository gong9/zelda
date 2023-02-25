// @ts-ignore
import { Config, createConfig } from '@umijs/test';

export default {
  ...createConfig(),
  collectCoverageFrom: ['./**/*.{ts,js,tsx,jsx}'],
} as Config.InitialOptions;
