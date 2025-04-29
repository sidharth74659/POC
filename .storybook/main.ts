import type { StorybookConfig } from '@storybook/angular';
import { mergeConfig } from 'vite';
import viteConfig from './vite.config';

// Define a more compatible config type with viteFinal
interface CustomStorybookConfig extends StorybookConfig {
  viteFinal?: (config: any) => Promise<any>;
}

const config: CustomStorybookConfig = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-scss',
  ],
  framework: {
    name: '@storybook/angular',
    options: {
      enableCli: true,
      enableIvy: true,
      enableNgcc: true,
      inlineStyles: true,
    },
  },
  core: {
    builder: '@storybook/builder-vite',
    disableTelemetry: true,
  },
  staticDirs: ['../src/assets'],
  // Use async viteFinal that correctly merges configurations
  viteFinal: async (config) => {
    return mergeConfig(config, viteConfig);
  },
};

export default config;
