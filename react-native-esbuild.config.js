/**
 * @type {import('@react-native-esbuild/core').Config}
 */

exports.default = {
  cache: true,
  logger: {
    disabled: false,
    timestamp: null,
  },
  resolver: {
    mainFields: RESOLVER_MAIN_FIELDS,
    sourceExtensions: SOURCE_EXTENSIONS,
    assetExtensions: ASSET_EXTENSIONS,
  },
  transformer: {
    stripFlowPackageNames: [
      'react-native',
      'react-native-runtime-transform-plugin',
    ],
    jsc: {
      transform: {
        react: {
          runtime: 'automatic',
        },
      },
    },
    fullyTransformPackageNames: ['@react-native-aria'],

    additionalTransformRules: {
      babel: [
        {
          test: (path, code) => {
            return (
              /node_modules\/react-native-reanimated\//.test(path) ||
              code.includes('react-native-reanimated')
            );
          },
          options: {
            plugins: ['react-native-reanimated/plugin'],
            babelrc: false,
          },
        },
      ],
    },
  },
};

/**
 * @see {@link https://github.com/facebook/metro/blob/0.72.x/docs/Configuration.md#resolvermainfields}
 */
const RESOLVER_MAIN_FIELDS = ['react-native', 'browser', 'main', 'module'];

/**
 * @see {@link https://github.com/facebook/metro/blob/0.72.x/packages/metro-config/src/defaults/defaults.js}
 * @see {@link https://github.com/facebook/metro/blob/0.72.x/packages/metro-file-map/src/workerExclusionList.js}
 */
const SOURCE_EXTENSIONS = [
  '.tsx',
  '.ts',
  '.jsx',
  '.js',
  '.mjs',
  '.cjs',
  '.json',
];

const IMAGE_EXTENSIONS = [
  '.bmp',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.png',
  '.tiff',
  '.tif',
  '.webp',
];

const ASSET_EXTENSIONS = [
  // Video extensions.
  '.avi',
  '.mp4',
  '.mpeg',
  '.mpg',
  '.ogv',
  '.webm',
  '.3gp',
  '.3g2',

  // Audio extensions.
  '.aac',
  '.midi',
  '.mid',
  '.mp3',
  '.oga',
  '.wav',
  '.3gp',
  '.3g2',

  // Font extensions.
  '.eot',
  '.otf',
  '.ttf',
  '.woff',
  '.woff2',

  // Image extensions.
  ...IMAGE_EXTENSIONS,
];
