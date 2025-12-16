# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.7.0] - 2025-12-16

### Added
- **CLI Flags & Options**:
  - `--help` flag with comprehensive documentation and examples
  - `--version` (-v) flag with proper version display
  - `--template <name>` flag with 6 predefined template presets
  - `--no-install` flag to skip dependency installation
  - `--package-manager <pm>` flag for npm/yarn/pnpm support
  - `--dry-run` mode to preview project setup without creating files
  - `--verbose` flag for detailed progress logging
  - `--debug` flag for maximum detail debugging output

- **Template Presets**:
  - `typescript-full` - TypeScript with all features enabled
  - `typescript-minimal` - TypeScript with Tailwind CSS only
  - `javascript-full` - JavaScript with all features enabled
  - `javascript-minimal` - JavaScript with Tailwind CSS only
  - `basic-ts` - TypeScript without any styling
  - `basic-js` - JavaScript without any styling

- **Enhanced Validation**:
  - Project name validation following npm package naming rules
  - Check for invalid characters in project names
  - Prevent names starting with `.` or `_`
  - Directory existence validation before creation

- **Developer Experience**:
  - Logger utility with 5 verbosity levels (ERROR, WARN, INFO, VERBOSE, DEBUG)
  - Color-coded console output for better readability
  - Detailed error messages with context
  - Smart command suggestions based on selected options

### Changed
- **Package Manager Support**: All installation functions now respect the selected package manager
- **Installation Flow**: Made dependency installation optional with `--no-install` flag
- **README**: Complete overhaul with comprehensive CLI documentation, examples, and troubleshooting guide
- **Help Output**: Enhanced with examples, template descriptions, and better formatting

### Fixed
- Project name validation edge cases
- Directory conflict detection
- Error handling and user feedback improvements

---

## [3.6.9] and earlier

See commit history for changes prior to 3.7.0.
