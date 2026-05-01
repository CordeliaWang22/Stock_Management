module.exports = {
  testEnvironment: 'jsdom',          
  transform: {
    '^.+\\.js$': 'babel-jest',       
  },
  moduleNameMapper: {
  },
  collectCoverageFrom: [
    'src/js/**/*.js',                
    '!src/js/tests/**',              
  ],
};