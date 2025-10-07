# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2024-01-01

### Added
- Initial release
- Advanced QR code generation with qr-code-styling
- Three output modes: inline SVG, canvas PNG, and file-based
- Extensive styling options (gradients, colors, shapes, corners)
- Configurable through _config.yml
- Optional canvas support for PNG output
- Comprehensive unit tests

### Features
- Inline SVG output (default)
- Canvas PNG output with base64 encoding
- File-based output with caching
- Gradient support for dots and backgrounds
- Custom corner styling
- Multiple dot types and shapes
- Error correction level configuration
- Responsive sizing options

### Notes
- Image support intentionally removed due to Node.js compatibility issues
- Canvas dependency is optional for better cross-platform compatibility