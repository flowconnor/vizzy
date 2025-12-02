import * as fs from 'fs/promises';
import * as path from 'path';

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    framework?: string;
    versions?: Record<string, string>;
}

export class FrameworkValidator {
    private projectPath: string;
    private errors: string[] = [];
    private warnings: string[] = [];

    // Required dependencies for Vizzy
    private vizzyDeps = {
        'd3': '^7.8.5',
        'tailwindcss': '^3.3.0',
        '@types/d3': '^7.4.3'
    };

    private packageJson: any;

    constructor(projectPath: string) {
        this.projectPath = projectPath;
    }

    async validateDependencies(requiredDeps: Record<string, string>): Promise<ValidationResult> {
        try {
            const packageJsonPath = path.join(this.projectPath, 'package.json');
            this.packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                // Package.json doesn't exist - this is expected for new projects
                return {
                    isValid: true,
                    errors: [],
                    warnings: ['No package.json found'],
                    framework: undefined,
                    versions: {}
                };
            } else {
                // Other errors (like permissions) should be treated as errors
                return {
                    isValid: false,
                    errors: [`Failed to read package.json: ${error}`],
                    warnings: [],
                    framework: undefined,
                    versions: {}
                };
            }
        }

        if (!this.packageJson) {
            return {
                isValid: false,
                errors: ['Invalid package.json'],
                warnings: [],
                framework: undefined,
                versions: {}
            };
        }

        const deps = {
            ...this.packageJson.dependencies,
            ...this.packageJson.devDependencies
        };

        const errors: string[] = [];
        const warnings: string[] = [];
        const versions: Record<string, string> = {};

        // Check framework dependencies
        Object.entries(requiredDeps).forEach(([dep, version]) => {
            if (!deps[dep]) {
                errors.push(`Missing required dependency: ${dep}`);
            } else {
                versions[dep] = deps[dep];
                if (!this.isVersionCompatible(deps[dep], version)) {
                    warnings.push(`${dep} version mismatch: required ${version}, found ${deps[dep]}`);
                }
            }
        });

        // Check Vizzy dependencies
        Object.entries(this.vizzyDeps).forEach(([dep, version]) => {
            if (!deps[dep]) {
                warnings.push(`Missing recommended dependency: ${dep} (${version})`);
            } else {
                versions[dep] = deps[dep];
                if (!this.isVersionCompatible(deps[dep], version)) {
                    warnings.push(`${dep} version mismatch: required ${version}, found ${deps[dep]}`);
                }
            }
        });

        // Additional dependencies to check and report
        const additionalDeps = ['typescript', 'react-dom', '@types/react'];
        additionalDeps.forEach(dep => {
            if (deps[dep]) {
                versions[dep] = deps[dep];
            }
        });

        // Detect framework
        let framework: string | undefined = undefined;
        if (deps['next']) {
            framework = 'next.js';
        } else if (deps['vue']) {
            framework = 'vue';
        } else if (deps['@angular/core']) {
            framework = 'angular';
        } else if (deps['@remix-run/react']) {
            framework = 'remix';
        } else if (deps['react']) {
            framework = 'react';
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            framework,
            versions
        };
    }

    private isVersionCompatible(version: string, requiredVersion: string): boolean {
        const versionRegex = new RegExp(requiredVersion.replace(/\^/g, '\\^'));
        return versionRegex.test(version);
    }

    async validateFrameworkConfig(framework: string): Promise<ValidationResult> {
        this.errors = [];
        this.warnings = [];

        const configFiles = {
            'next.js': 'next.config.js',
            'remix': 'remix.config.js'
        };

        const configFile = configFiles[framework as keyof typeof configFiles];
        if (!configFile) {
            this.errors.push(`Unknown framework: ${framework}`);
            return { isValid: false, errors: this.errors, warnings: this.warnings };
        }

        try {
            await fs.access(path.join(this.projectPath, configFile));
        } catch {
            this.errors.push(`Missing framework configuration file: ${configFile}`);
        }

        return {
            isValid: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings
        };
    }

    async validateProjectStructure(framework: string): Promise<ValidationResult> {
        this.errors = [];
        this.warnings = [];

        if (framework === 'next.js') {
            const appDir = path.join(this.projectPath, 'app');
            const pagesDir = path.join(this.projectPath, 'pages');

            try {
                await fs.access(appDir);
            } catch {
                try {
                    await fs.access(pagesDir);
                } catch {
                    this.errors.push('Missing both app/ and pages/ directories');
                }
            }
        }

        return {
            isValid: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings
        };
    }

    async validateTypeScript(): Promise<ValidationResult> {
        this.errors = [];
        this.warnings = [];

        try {
            const packageJsonPath = path.join(this.projectPath, 'package.json');
            const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
            const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

            const requiredTypes = ['@types/react', '@types/node'];
            for (const type of requiredTypes) {
                if (!deps[type]) {
                    this.errors.push(`Missing ${type}`);
                }
            }

            try {
                await fs.access(path.join(this.projectPath, 'tsconfig.json'));
            } catch {
                this.errors.push('Missing tsconfig.json');
            }
        } catch (error) {
            this.errors.push(`Failed to validate TypeScript setup: ${error}`);
        }

        return {
            isValid: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings
        };
    }

    static formatResults(results: ValidationResult): string {
        const lines: string[] = [];

        if (results.errors.length > 0) {
            lines.push('\nErrors:');
            results.errors.forEach(error => lines.push(`  ❌ ${error}`));
        }

        if (results.warnings.length > 0) {
            lines.push('\nWarnings:');
            results.warnings.forEach(warning => lines.push(`  ⚠️ ${warning}`));
        }

        if (results.framework) {
            lines.push(`\nDetected Framework: ${results.framework}`);
        }

        if (results.versions && Object.keys(results.versions).length > 0) {
            lines.push('\nDependency Versions:');
            Object.entries(results.versions).forEach(([dep, version]) =>
                lines.push(`  ${dep}: ${version}`)
            );
        }

        return lines.join('\n');
    }
}

export function satisfiesVersion(current: string, required: string): boolean {
    try {
        // Remove ^ or ~ from versions
        const clean = (version: string) => version.replace(/[\^~]/, '');
        const currentVersion = clean(current);
        const requiredVersion = clean(required);
    
        const currentParts = currentVersion.split('.').map(Number);
        const requiredParts = requiredVersion.split('.').map(Number);
    
        // Check for invalid version format
        if (currentParts.length !== 3 || requiredParts.length !== 3 || 
            currentParts.some(isNaN) || requiredParts.some(isNaN)) {
            return false;
        }
    
        // Compare major version
        if (currentParts[0] !== requiredParts[0]) {
            return false;
        }
    
        // If minor version specified, compare it
        if (requiredParts[1] !== undefined && currentParts[1] < requiredParts[1]) {
            return false;
        }
    
        // If patch version specified, compare it
        if (requiredParts[2] !== undefined && currentParts[2] < requiredParts[2]) {
            return false;
        }
    
        return true;
    } catch (error) {
        // Handle any other parsing errors
        return false;
    }
}
