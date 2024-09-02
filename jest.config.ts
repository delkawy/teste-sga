import { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
    '.module.ts',
    '.eslintrc.js',
    'jest.config.ts',
    '<rootDir>/src/main.ts',
    '<rootDir>/src/application/base',
    '<rootDir>/src/application/domain',
    '<rootDir>/src/configs',
    '<rootDir>/src/infra/database',
    '<rootDir>/src/infra/http/dto',
    '<rootDir>/src/infra/http/pipes',
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};

export default config;
