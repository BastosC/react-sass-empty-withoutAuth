// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------   TOGGLE SERVICES
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const IS_SENTRY_ENABLED = !!process.env.NEXT_PUBLIC_ENABLE_SENTRY;
const IS_ANALYZE_ENABLED = !!process.env.NEXT_PUBLIC_ENABLE_ANALYZE;

const NODE_ENV = process.env.NODE_ENV;

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------  INIT CONFIG
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
console.log(" --__-- NEXT CONFIG INIT :");
const withBaseConfig = require("./config/config.base");

let plugins = [withBaseConfig];

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------  ENABLE SERVICES
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

if (IS_SENTRY_ENABLED || IS_ANALYZE_ENABLED) console.log(" --__-- TOOLS ENABLED LIST");
else console.log(" --__-- ALL TOOLS DISABLED");

// Sentry
if (IS_SENTRY_ENABLED) {
  console.log("--__-- SENTRY_ENABLED");
  const withCustomSentryConfig = require("./config/config.sentry");
  plugins.push(withCustomSentryConfig);
}

// Analyze build
if (IS_ANALYZE_ENABLED) {
  console.log("--__-- ANALYZE_ENABLED");
  const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      analyzerPort: isServer ? 8888 : 8889,
      openAnalyzer: true,
    })
  );
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------  ENVIRONNEMENTS
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Dev
if (NODE_ENV === "development") {
  console.log("--__-- DEVELOPEMENT CONFIG LOADED");
  const withDevConfig = require("./config/config.dev");
  plugins.push([withDevConfig]);
}

// Production
if (NODE_ENV === "production") {
  console.log("--__-- PRODUCTION CONFIG LOADED");
  const withProdConfig = require("./config/config.prod");
  plugins.push([withProdConfig]);
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------  SEND CONFIG TO COMPILER
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const withPlugins = require("next-compose-plugins");

const CompletedConfig = withPlugins(plugins);
if (IS_SENTRY_ENABLED) {
  const { withSentryConfig } = require("@sentry/nextjs");
  const sentryWebpackPluginOptions = {
    // For all available options, see: https://github.com/getsentry/sentry-webpack-plugin#options.
    silent: false, // Suppresses all logs
  };
  console.log("--__-- COMPLETE CONFIG");
  module.exports = withSentryConfig(CompletedConfig, sentryWebpackPluginOptions);
} else {
  console.log("--__-- COMPLETE CONFIG");
  module.exports = CompletedConfig;
}