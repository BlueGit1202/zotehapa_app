module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["nativewind/babel", { mode: "transformOnly" }],
      ["react-native-reanimated/plugin", { relativeSourceLocation: true }],
      ["@babel/plugin-transform-modules-commonjs", { allowTopLevelThis: true }]
    ]
  };
};
