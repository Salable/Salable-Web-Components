import { Config } from '@stencil/core';
import {reactOutputTarget} from "@stencil/react-output-target";
import {postcss} from '@stencil-community/postcss';
import autoprefixer from 'autoprefixer';
import dotenv from "rollup-plugin-dotenv"

const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./src/**/*.tsx", "./src/**/*.css", "./src/index.html"],
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
});

export const config: Config = {
  namespace: 'web-components',
  watchIgnoredRegex: /utilities/,
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'dist-hydrate-script',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    reactOutputTarget({
      componentCorePackage: '@salable/web-components',
      proxiesFile: '../react-web-components/lib/components/stencil-generated/index.ts',
    }),
  ],
  testing: {
    browserHeadless: "new",
  },
  plugins : [
    postcss({
      plugins: [
        require("postcss-import"),
        require("tailwindcss")("./tailwind.config.js"),
        autoprefixer(),
        ...(process.env.NODE_ENV === "production"
            ? [purgecss, require('cssnano')]
            : [])
      ]
    }),
    dotenv()
  ],
};
