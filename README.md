# hexo-helper-qrcode-adv

Advanced QR code helper for Hexo that generates QR codes for page sharing with extensive styling options.

## Installation

```bash
npm install hexo-helper-qrcode-adv
```

## Usage

Use the `renderQRCodeShare()` helper in your EJS templates:

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
  type: svg  # Only 'svg' supported (canvas requires additional dependencies)
  shape: square  # 'square' or 'circle'
  margin: 4
  image: https://example.com/logo.png
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
  imageOptions:
    hideBackgroundDots: true
    imageSize: 0.4  # 0-1, recommended max 0.5
    margin: 0
    crossOrigin: anonymous  # 'anonymous' or 'use-credentials'
    saveAsBlob: true
```

## Helper Options

The helper accepts these options (override config defaults):

- `url` (string): URL to encode. Defaults to current page URL
- `size` (number): Sets both width and height. Overrides config width/height
- `margin` (number): Margin around QR code
- `color` (object): Quick color setup
  - `dark` (string): Foreground color (overrides dotsOptions.color)
  - `light` (string): Background color (overrides backgroundOptions.color)
- `image` (string): Center image URL
- `imageOptions` (object): Image-specific options

## Examples

### Basic with custom colors
```ejs
<%- renderQRCodeShare({
  color: { dark: '#4267b2', light: '#e9ebee' }
}) %>
```

### With center image
```ejs
<%- renderQRCodeShare({
  image: 'https://example.com/logo.png',
  size: 300
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

## Configuration Options Reference

### Basic Options
- `width/height` (number): Canvas size in pixels
- `type` (string): Only 'svg' supported (canvas requires canvas dependency)
- `shape` (string): 'square' or 'circle'
- `margin` (number): Margin around canvas
- `image` (string): Center image URL

### QR Options
- `qrOptions.typeNumber` (0-40): QR code version
- `qrOptions.mode` (string): Data encoding mode
- `qrOptions.errorCorrectionLevel` (string): Error correction level

### Styling Options
- `dotsOptions`: QR dot styling (color, type, gradient)
- `backgroundOptions`: Background styling (color, gradient)
- `cornersSquareOptions`: Corner square styling
- `cornersDotOptions`: Corner dot styling
- `imageOptions`: Center image options

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