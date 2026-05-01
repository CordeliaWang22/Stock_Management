module.exports = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.js$": "babel-jest",
  },

  moduleNameMapper: {
  },

  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
  coverageDirectory: "coverage",

  collectCoverageFrom: [
    "src/js/**/*.js",  
    "!src/js/tests/**", 
  ],

  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
};
