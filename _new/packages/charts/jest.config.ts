import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	roots: ['<rootDir>/src'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	transform: {
		'^.+\\.(ts|tsx)$': [
			'ts-jest',
			{
				tsconfig: '<rootDir>/tsconfig.json',
			},
		],
		'^.+\\.(js)$': 'babel-jest',
	},
	transformIgnorePatterns: [],
	moduleNameMapper: {
		'^@canopy/charts$': '<rootDir>/src',
		'^@canopy/charts/(.*)$': '<rootDir>/src/$1',
	},
};

export default config;

