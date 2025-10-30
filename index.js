const { QRCodeStyling } = require('qr-code-styling/lib/qr-code-styling.common.js');
const { JSDOM } = require('jsdom');
const deasync = require('deasync');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Try to load canvas, fallback if not available
let nodeCanvas;
try {
  nodeCanvas = require('canvas');
} catch (error) {
  nodeCanvas = null;
}

hexo.extend.helper.register('renderQRCode', function(options = {}) {
  // Get default config from _config.yml
  const defaultConfig = this.config.qrcode || {};
  
  // Check if QR code generation is enabled (default: true)
  if (defaultConfig.enable === false) {
    return '';
  }
  
  // Determine output mode: 'inline', 'canvas', or 'file'
  const outputMode = options.output || defaultConfig.output || 'inline';
  
  // Merge options with defaults
  const config = {
    width: options.size || defaultConfig.width || 200,
    height: options.size || defaultConfig.height || 200,
    type: (outputMode === 'canvas') ? 'canvas' : 'svg',
    shape: defaultConfig.shape || 'square',
    margin: options.margin !== undefined ? options.margin : (defaultConfig.margin || 4),
    data: options.data || options.url || (this.config.url + '/' + this.path),
    qrOptions: {
      typeNumber: defaultConfig.qrOptions?.typeNumber || 0,
      mode: defaultConfig.qrOptions?.mode || 'Byte',
      errorCorrectionLevel: defaultConfig.qrOptions?.errorCorrectionLevel || 'M'
    },
    dotsOptions: {
      color: options.color?.dark || defaultConfig.dotsOptions?.color || '#000000',
      type: defaultConfig.dotsOptions?.type || 'square',
      gradient: defaultConfig.dotsOptions?.gradient,
      roundSize: defaultConfig.dotsOptions?.roundSize !== undefined ? defaultConfig.dotsOptions.roundSize : true
    },
    backgroundOptions: {
      color: options.color?.light || defaultConfig.backgroundOptions?.color || '#FFFFFF',
      gradient: defaultConfig.backgroundOptions?.gradient
    },
    cornersSquareOptions: defaultConfig.cornersSquareOptions,
    cornersDotOptions: defaultConfig.cornersDotOptions,
    jsdom: JSDOM
  };
  
  // Add canvas support if available and type is canvas
  if (config.type === 'canvas') {
    if (nodeCanvas) {
      config.nodeCanvas = nodeCanvas;
    } else {
      console.warn('QR: Canvas type requested but canvas dependency not available, falling back to SVG');
      config.type = 'svg';
    }
  }
  

  
  try {
    const qrCode = new QRCodeStyling(config);
    
    if (outputMode === 'file') {
      // File mode: Generate and save to file
      const configHash = crypto.createHash('md5').update(JSON.stringify(config)).digest('hex');
      const extension = config.type === 'canvas' ? 'png' : 'svg';
      const filename = `qr-${configHash}.${extension}`;
      
      const publicDir = this.config.public_dir || 'public';
      const qrDir = path.join(publicDir, 'qr');
      if (!fs.existsSync(qrDir)) {
        fs.mkdirSync(qrDir, { recursive: true });
      }
      
      const filePath = path.join(qrDir, filename);
      const webPath = `/qr/${filename}`;
      
      if (fs.existsSync(filePath)) {
        return `<img src="${webPath}" width="${config.width}" height="${config.height}" alt="QR Code for ${config.data}" />`;
      }
      
      const getRawDataSync = deasync(function(callback) {
        const outputType = config.type === 'canvas' ? 'png' : 'svg';
        qrCode.getRawData(outputType)
          .then(buffer => {
            fs.writeFileSync(filePath, buffer);
            callback(null, webPath);
          })
          .catch(error => {
            callback(error);
          });
      });
      
      try {
        const savedPath = getRawDataSync();
        return `<img src="${savedPath}" width="${config.width}" height="${config.height}" alt="QR Code for ${config.data}" />`;
      } catch (error) {
        console.error('QR: File save failed:', error);
        return `<div class="qr-error">QR Code generation failed</div>`;
      }
    } else {
      // Inline mode: Return SVG/canvas directly
      const getRawDataSync = deasync(function(callback) {
        const outputType = config.type === 'canvas' ? 'png' : 'svg';
        qrCode.getRawData(outputType)
          .then(buffer => {
            if (config.type === 'canvas') {
              const base64 = buffer.toString('base64');
              callback(null, `<img src="data:image/png;base64,${base64}" width="${config.width}" height="${config.height}" alt="QR Code for ${config.data}" />`);
            } else {
              callback(null, `<!-- QR Code for ${config.data} -->` + buffer.toString());
            }
          })
          .catch(error => {
            callback(error);
          });
      });
      
      try {
        return getRawDataSync();
      } catch (error) {
        console.error('QR: Generation failed:', error);
        return `<div class="qr-error">QR Code generation failed</div>`;
      }
    }
  } catch (error) {
    console.error('QR: QRCodeStyling creation failed:', error);
    return `<div class="qr-error">QR Code generation failed</div>`;
  }
});