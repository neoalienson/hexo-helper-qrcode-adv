const { QRCodeStyling } = require('qr-code-styling/lib/qr-code-styling.common.js');
const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');
const deasync = require('deasync');

hexo.extend.helper.register('renderQRCodeShare', function(options = {}) {
  // Get default config from _config.yml
  const defaultConfig = this.config.qrcode || {};
  
  // Merge options with defaults
  const config = {
    width: options.size || defaultConfig.width || 200,
    height: options.size || defaultConfig.height || 200,
    type: 'svg', // Force SVG type (canvas not supported in Node.js without canvas dependency)
    shape: defaultConfig.shape || 'square',
    margin: options.margin !== undefined ? options.margin : (defaultConfig.margin || 4),
    data: options.url || (this.config.url + this.url),
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
  
  // Handle image with base64 conversion for Node.js compatibility
  const imageUrl = options.image || defaultConfig.image;
  if (imageUrl) {
    console.log('QR: Processing image URL:', imageUrl);
    try {
      // Convert image to base64 synchronously
      let imageData;
      let fetchDone = false;
      
      console.log('QR: Starting image fetch...');
      fetch(imageUrl)
        .then(response => {
          console.log('QR: Image fetch response status:', response.status);
          return response.buffer();
        })
        .then(buffer => {
          console.log('QR: Image buffer received, size:', buffer.length);
          const base64 = buffer.toString('base64');
          const mimeType = imageUrl.includes('.svg') ? 'image/svg+xml' : 'image/png';
          imageData = `data:${mimeType};base64,${base64}`;
          console.log('QR: Image converted to base64, type:', mimeType);
          fetchDone = true;
        })
        .catch(error => {
          console.warn('QR: Failed to fetch image:', error.message);
          fetchDone = true;
        });
      
      deasync.loopWhile(() => !fetchDone);
      
      // Only add image to config if successfully converted to base64
      if (imageData) {
        console.log('QR: Adding image to config');
        config.image = imageData;
        config.imageOptions = {
          hideBackgroundDots: defaultConfig.imageOptions?.hideBackgroundDots !== undefined ? defaultConfig.imageOptions.hideBackgroundDots : true,
          imageSize: defaultConfig.imageOptions?.imageSize || 0.4,
          margin: defaultConfig.imageOptions?.margin || 0,
          saveAsBlob: false,
          ...options.imageOptions
        };
      } else {
        console.log('QR: Image processing failed, proceeding without image');
      }
    } catch (error) {
      console.warn('QR: Image processing failed:', error.message);
    }
  } else {
    console.log('QR: No image URL provided');
  }
  
  try {
    const qrCode = new QRCodeStyling(config);
    console.log('QR: QRCodeStyling instance created successfully');
    
    console.log('QR: Starting getRawData...');
    
    // Use deasync directly on the Promise
    const getRawDataSync = deasync(function(callback) {
      qrCode.getRawData('svg')
        .then(buffer => {
          console.log('QR: getRawData completed, buffer size:', buffer.length);
          callback(null, buffer.toString());
        })
        .catch(error => {
          console.error('QR: getRawData failed:', error);
          callback(error);
        });
    });
    
    try {
      const result = getRawDataSync();
      console.log('QR: Generation completed');
      return result;
    } catch (error) {
      console.error('QR: Sync getRawData failed:', error);
      return `<div class="qr-error">QR Code generation failed</div>`;
    }
  } catch (error) {
    console.error('QR: QRCodeStyling creation failed:', error);
    return `<div class="qr-error">QR Code generation failed</div>`;
  }
});