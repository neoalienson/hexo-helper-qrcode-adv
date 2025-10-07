# hexo-helper-qrcode-adv

Advanced QR code helper for Hexo that generates QR codes for page sharing with extensive styling options using qr-code-styling

## Installation

```bash
npm install hexo-helper-qrcode-adv
```

### Canvas Support (Optional)

For canvas/PNG output support, install the canvas dependency:

```bash
npm install canvas
```

**Note**: Canvas installation requires native dependencies. On Windows, you may need Visual Studio Build Tools. If canvas installation fails, the plugin will automatically fall back to SVG output.

## Image Support

**Center images are not supported** in this plugin. Image support was removed due to image handling in qr-code-styling caused hanging and timeouts in Node.js environments. For QR codes with logos, consider using client-side QR generation libraries or external QR code services.

## Usage

Use the `renderQRCodeShare()` helper in your EJS templates. The helper supports three output modes:
- **Inline SVG** (default): Returns SVG markup directly
- **Canvas**: Returns base64 PNG as img tag (requires canvas dependency)
- **File**: Saves to `public/qr/` directory and returns img tag

### Basic Usage
```ejs
<%- renderQRCodeShare() %>
```

### With Options
```ejs
<%- renderQRCodeShare({
  url: 'https://example.com',
  size: 300,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
}) %>
```

## Configuration

Add QR code styling options to your `_config.yml`:

```yaml
qrcode:
  width: 300
  height: 300
  output: inline  # 'inline', 'canvas', or 'file'
  shape: square  # 'square' or 'circle'
  margin: 4
  qrOptions:
    typeNumber: 0  # 0-40
    mode: Byte  # 'Numeric', 'Alphanumeric', 'Byte', 'Kanji'
    errorCorrectionLevel: M  # 'L', 'M', 'Q', 'H'
  dotsOptions:
    color: '#000000'
    type: square  # 'rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded'
    roundSize: true
    gradient:
      type: linear  # 'linear' or 'radial'
      rotation: 0
      colorStops:
        - offset: 0
          color: '#000000'
        - offset: 1
          color: '#333333'
  backgroundOptions:
    color: '#FFFFFF'
    gradient:
      type: radial
      colorStops:
        - offset: 0
          color: '#FFFFFF'
        - offset: 1
          color: '#F0F0F0'
  cornersSquareOptions:
    color: '#000000'
    type: square  # 'dot', 'square', 'extra-rounded', 'rounded', 'dots', 'classy', 'classy-rounded'
    gradient:
      type: linear
      rotation: 0
      colorStops:
        - offset: 0
          color: '#000000'
        - offset: 1
          color: '#333333'
  cornersDotOptions:
    color: '#000000'
    type: square  # 'dot', 'square', 'rounded', 'dots', 'classy', 'classy-rounded', 'extra-rounded'
```

## Helper Options

The helper accepts these options (override config defaults):

- `url` (string): URL to encode. Defaults to current page URL
- `size` (number): Sets both width and height. Overrides config width/height
- `margin` (number): Margin around QR code
- `output` (string): Output mode - 'inline' (SVG), 'canvas' (PNG), or 'file' (saved image)
- `color` (object): Quick color setup
  - `dark` (string): Foreground color (overrides dotsOptions.color)
  - `light` (string): Background color (overrides backgroundOptions.color)

## Examples

### Basic with custom colors
```ejs
<%- renderQRCodeShare({
  color: { dark: '#4267b2', light: '#e9ebee' }
}) %>
```

### Styled QR code
```ejs
<%- renderQRCodeShare({
  url: 'https://example.com',
  size: 250,
  margin: 10
}) %>
```

### Output modes
```ejs
<!-- Inline SVG (default) -->
<%- renderQRCodeShare({ output: 'inline' }) %>

<!-- Canvas PNG -->
<%- renderQRCodeShare({ output: 'canvas' }) %>

<!-- Saved file -->
<%- renderQRCodeShare({ output: 'file' }) %>
```

## Configuration Options Reference

### Basic Options
- `width/height` (number): Canvas size in pixels
- `output` (string): Output mode - 'inline' (SVG), 'canvas' (PNG), or 'file' (saved image)
- `shape` (string): 'square' or 'circle'
- `margin` (number): Margin around canvas

### QR Options
- `qrOptions.typeNumber` (0-40): QR code version
- `qrOptions.mode` (string): Data encoding mode
- `qrOptions.errorCorrectionLevel` (string): Error correction level

### Styling Options
- `dotsOptions`: QR dot styling (color, type, gradient)
- `backgroundOptions`: Background styling (color, gradient)
- `cornersSquareOptions`: Corner square styling
- `cornersDotOptions`: Corner dot styling

### Gradient Structure
```yaml
gradient:
  type: linear  # 'linear' or 'radial'
  rotation: 0   # Rotation in radians
  colorStops:
    - offset: 0    # 0-1 position
      color: '#000'
    - offset: 1
      color: '#333'
```

## License

MIT