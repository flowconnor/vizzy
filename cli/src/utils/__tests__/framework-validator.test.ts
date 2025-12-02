import { describe, expect, it, beforeEach } from '@jest/globals';
import { createMockProject, cleanupMockProject } from '../../test/helpers/mock-projects';
import { FrameworkValidator, ValidationResult, satisfiesVersion } from '../framework-validator';
import * as fs from 'fs';
import * as path from 'path';

describe('FrameworkValidator', () => {
    beforeEach(() => {
        cleanupMockProject();
    });

    describe('validateDependencies', () => {
        it('should validate Next.js project dependencies', async () => {
            const { root } = createMockProject({
                framework: 'next.js',
                dependencies: {
                    'next': '14.1.0',
                    'react': '18.2.0'
                }
            });

            const validator = new FrameworkValidator(root);
            const result = await validator.validateDependencies({
                'next': '14.1.0',
                'react': '18.2.0'
            });

            expect(result.isValid).toBe(true);
            expect(result.framework).toBe('next.js');
            expect(result.versions?.react).toBe('18.2.0');
            expect(result.versions?.next).toBe('14.1.0');
        });

        it('should fail validation with missing dependencies', async () => {
            const { root } = createMockProject({
                framework: 'next.js'
            });

            const validator = new FrameworkValidator(root);
            const result = await validator.validateDependencies({
                'next': '14.1.0',
                'react': '18.2.0'
            });

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Missing required dependency: next');
            expect(result.errors).toContain('Missing required dependency: react');
        });
    });

    describe('validateFrameworkConfig', () => {
        it('should validate Next.js config', async () => {
            const { root } = createMockProject({
                framework: 'next.js',
                files: {
                    'next.config.js': 'module.exports = { /* config */ };'
                }
            });

            const validator = new FrameworkValidator(root);
            const result = await validator.validateFrameworkConfig('next.js');

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should detect missing config file', async () => {
            const { root } = createMockProject({
                framework: 'next.js'
            });

            const validator = new FrameworkValidator(root);
            const result = await validator.validateFrameworkConfig('next.js');

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Missing framework configuration file: next.config.js');
        });
    });

    describe('validateProjectStructure', () => {
        it('should validate Next.js app directory', async () => {
            const { root } = createMockProject({
                framework: 'next.js',
                files: {
                    'app/page.tsx': 'export default function Page() { return <div>Hello</div> }'
                }
            });

            const validator = new FrameworkValidator(root);
            const result = await validator.validateProjectStructure('next.js');

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should detect missing app and pages directories', async () => {
            const { root } = createMockProject({
                framework: 'next.js'
            });

            const validator = new FrameworkValidator(root);
            const result = await validator.validateProjectStructure('next.js');

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Missing both app/ and pages/ directories');
        });
    });

    describe('validateTypeScript', () => {
        it('should validate TypeScript setup', async () => {
            const { root } = createMockProject({
                framework: 'next.js',
                typescript: true,
                devDependencies: {
                    '@types/react': '18.2.0',
                    '@types/node': '20.0.0'
                }
            });

            const validator = new FrameworkValidator(root);
            const result = await validator.validateTypeScript();

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should detect missing TypeScript types', async () => {
            const { root } = createMockProject({
                framework: 'next.js',
                typescript: true
            });

            const validator = new FrameworkValidator(root);
            const result = await validator.validateTypeScript();

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Missing @types/react');
            expect(result.errors).toContain('Missing @types/node');
        });
    });

    describe('Framework Auto-Detection', () => {
        it('correctly identifies Next.js projects', async () => {
            const { root } = createMockProject({
                framework: 'next.js',
                dependencies: {
                    'next': '14.1.0'
                }
            });

            const validator = new FrameworkValidator(root);
            const results = await validator.validateDependencies({
                'next': '14.1.0'
            });

            expect(results.framework).toBe('next.js');
        });

        it('correctly identifies Remix projects', async () => {
            const { root } = createMockProject({
                framework: 'next.js',
                dependencies: {
                    '@remix-run/react': '2.5.0'
                }
            });

            const validator = new FrameworkValidator(root);
            const results = await validator.validateDependencies({
                '@remix-run/react': '2.5.0'
            });

            expect(results.framework).toBe('remix');
        });

        it('correctly identifies Vue projects', async () => {
            const { root } = createMockProject({
                framework: 'next.js',
                dependencies: {
                    'vue': '3.0.0'
                }
            });

            const validator = new FrameworkValidator(root);
            const results = await validator.validateDependencies({
                'vue': '3.0.0'
            });

            expect(results.framework).toBe('vue');
        });

        it('correctly identifies Angular projects', async () => {
            const { root } = createMockProject({
                framework: 'next.js',
                dependencies: {
                    '@angular/core': '16.0.0'
                }
            });

            const validator = new FrameworkValidator(root);
            const results = await validator.validateDependencies({
                '@angular/core': '16.0.0'
            });

            expect(results.framework).toBe('angular');
        });

        it('correctly identifies React projects', async () => {
            const { root } = createMockProject({
                framework: 'next.js',
                dependencies: {
                    'react': '18.2.0'
                }
            });

            const validator = new FrameworkValidator(root);
            const results = await validator.validateDependencies({
                'react': '18.2.0'
            });

            expect(results.framework).toBe('react');
        });
    });

    describe('Error Handling', () => {
        it('handles missing package.json gracefully', async () => {
            const validator = new FrameworkValidator('/nonexistent');

            const result = await validator.validateDependencies({
                'next': '14.1.0',
                'react': '18.2.0'
            });

            expect(result.isValid).toBe(true);
            expect(result.warnings).toContain('No package.json found');
            expect(result.errors).toHaveLength(0);
        });

        it('handles empty dependencies in package.json', async () => {
            const { root } = createMockProject({
                framework: 'next.js',
                dependencies: {}
            });

            const validator = new FrameworkValidator(root);
            const result = await validator.validateDependencies({
                'next': '14.1.0'
            });

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Missing required dependency: next');
        });

        it('handles non-ENOENT errors when reading package.json', async () => {
            const { root } = createMockProject({
                framework: 'next.js'
            });

            // Simulate a permission error by making package.json unreadable
            await fs.promises.chmod(path.join(root, 'package.json'), 0);

            const validator = new FrameworkValidator(root);
            const result = await validator.validateDependencies({
                'next': '14.1.0'
            });

            expect(result.isValid).toBe(false);
            expect(result.errors[0]).toMatch(/Failed to read package.json/);
        });

        it('handles invalid framework type', async () => {
            const { root } = createMockProject({
                framework: 'next.js'
            });

            const validator = new FrameworkValidator(root);
            const result = await validator.validateFrameworkConfig('invalid-framework');

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Unknown framework: invalid-framework');
        });

        it('handles dependency version mismatches', async () => {
            const { root } = createMockProject({
                framework: 'next.js',
                dependencies: {
                    'next': '13.0.0',
                    'react': '17.0.0'
                }
            });

            const validator = new FrameworkValidator(root);
            const result = await validator.validateDependencies({
                'next': '14.1.0',
                'react': '18.2.0'
            });

            expect(result.warnings).toContain('next version mismatch: required 14.1.0, found 13.0.0');
            expect(result.warnings).toContain('react version mismatch: required 18.2.0, found 17.0.0');
        });

        it('handles missing tsconfig.json', async () => {
            const { root } = createMockProject({
                framework: 'next.js',
                typescript: false,
                devDependencies: {
                    '@types/react': '18.2.0',
                    '@types/node': '20.0.0'
                }
            });

            const validator = new FrameworkValidator(root);
            const result = await validator.validateTypeScript();

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Missing tsconfig.json');
        });
    });

    describe('Result Formatting', () => {
        it('formats validation results with all fields', () => {
            const results: ValidationResult = {
                isValid: false,
                errors: ['Missing dependency', 'Invalid config'],
                warnings: ['Outdated version'],
                framework: 'next.js',
                versions: {
                    'next': '14.1.0',
                    'react': '18.2.0'
                }
            };

            const formatted = FrameworkValidator.formatResults(results);

            expect(formatted).toContain('Errors:');
            expect(formatted).toContain('❌ Missing dependency');
            expect(formatted).toContain('❌ Invalid config');
            expect(formatted).toContain('Warnings:');
            expect(formatted).toContain('⚠️ Outdated version');
            expect(formatted).toContain('Detected Framework: next.js');
            expect(formatted).toContain('next: 14.1.0');
            expect(formatted).toContain('react: 18.2.0');
        });

        it('formats validation results with minimal fields', () => {
            const results: ValidationResult = {
                isValid: true,
                errors: [],
                warnings: []
            };

            const formatted = FrameworkValidator.formatResults(results);
            expect(formatted).not.toContain('Errors:');
            expect(formatted).not.toContain('Warnings:');
            expect(formatted).not.toContain('Detected Framework:');
            expect(formatted).not.toContain('Dependency Versions:');
        });
    });

    describe('Version Validation', () => {
        it('handles invalid version formats', () => {
            expect(satisfiesVersion('invalid', '^1.0.0')).toBe(false);
            expect(satisfiesVersion('1.0.0', 'invalid')).toBe(false);
            expect(satisfiesVersion('1.0', '^1.0.0')).toBe(false); // not enough parts
            expect(satisfiesVersion('1.0.0.0', '^1.0.0')).toBe(false); // too many parts
            expect(satisfiesVersion('1.x.0', '^1.0.0')).toBe(false); // non-numeric part
        });

        it('compares versions correctly', () => {
            // Major version differences
            expect(satisfiesVersion('2.0.0', '^1.0.0')).toBe(false);
            expect(satisfiesVersion('1.0.0', '^1.0.0')).toBe(true);

            // Minor version differences
            expect(satisfiesVersion('1.1.0', '^1.2.0')).toBe(false);
            expect(satisfiesVersion('1.2.0', '^1.2.0')).toBe(true);
            expect(satisfiesVersion('1.3.0', '^1.2.0')).toBe(true);

            // Patch version differences
            expect(satisfiesVersion('1.2.1', '^1.2.2')).toBe(false);
            expect(satisfiesVersion('1.2.2', '^1.2.2')).toBe(true);
            expect(satisfiesVersion('1.2.3', '^1.2.2')).toBe(true);
        });

        it('handles version parsing errors', () => {
            expect(satisfiesVersion(null as any, '^1.0.0')).toBe(false);
            expect(satisfiesVersion('1.0.0', null as any)).toBe(false);
            expect(satisfiesVersion(undefined as any, '^1.0.0')).toBe(false);
        });
    });

    describe('Package Validation', () => {
        it('handles malformed package.json', async () => {
            const { root } = createMockProject({
                framework: 'next.js'
            });

            // Write invalid JSON to package.json
            await fs.promises.writeFile(
                path.join(root, 'package.json'),
                'invalid json'
            );

            const validator = new FrameworkValidator(root);
            const result = await validator.validateDependencies({
                'next': '14.1.0'
            });

            expect(result.isValid).toBe(false);
            expect(result.errors[0]).toMatch(/Failed to read package.json/);
        });

        it('handles empty package.json', async () => {
            const { root } = createMockProject({
                framework: 'next.js'
            });

            // Write empty object to package.json
            await fs.promises.writeFile(
                path.join(root, 'package.json'),
                '{}'
            );

            const validator = new FrameworkValidator(root);
            const result = await validator.validateDependencies({
                'next': '14.1.0'
            });

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Missing required dependency: next');
        });

        it('handles additional dependencies check', async () => {
            const { root } = createMockProject({
                framework: 'next.js',
                dependencies: {
                    'typescript': '^5.0.0',
                    'react-dom': '^18.0.0',
                    '@types/react': '^18.0.0'
                }
            });

            const validator = new FrameworkValidator(root);
            const result = await validator.validateDependencies({
                'next': '14.1.0'
            });

            expect(result.versions).toHaveProperty('typescript', '^5.0.0');
            expect(result.versions).toHaveProperty('react-dom', '^18.0.0');
            expect(result.versions).toHaveProperty('@types/react', '^18.0.0');
        });

        it('handles Vizzy dependencies check', async () => {
            const { root } = createMockProject({
                framework: 'next.js',
                dependencies: {
                    'd3': '^7.8.5',
                    'tailwindcss': '^3.2.0', // older version
                    '@types/d3': '^7.4.3'
                }
            });

            const validator = new FrameworkValidator(root);
            const result = await validator.validateDependencies({});

            expect(result.warnings).toContain('tailwindcss version mismatch: required ^3.3.0, found ^3.2.0');
        });
    });

    describe('TypeScript Validation', () => {
        it('handles TypeScript validation errors', async () => {
            const { root } = createMockProject({
                framework: 'next.js'
            });

            // Make the directory unreadable to simulate errors
            await fs.promises.chmod(root, 0);

            const validator = new FrameworkValidator(root);
            const result = await validator.validateTypeScript();

            expect(result.isValid).toBe(false);
            expect(result.errors[0]).toMatch(/Failed to validate TypeScript setup/);

            // Restore permissions for cleanup
            await fs.promises.chmod(root, 0o777);
        });
    });
});
