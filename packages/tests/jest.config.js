module.exports = {
  preset: './packages/tests/preset.js',
  rootDir: "../../",
  roots: [
    "<rootDir>/packages/tests/src",
    // "<rootDir>/packages/projects/src",
    "<rootDir>/packages/api/tests",
  ],


  globals: {
    "ts-jest": {
      "tsconfig": "<rootDir>/packages/tests/tsconfig.json"
    }
  }
  // transform: {},
  // testEnvironment: 'node',
  // extensionsToTreatAsEsm: [".ts"]
};
