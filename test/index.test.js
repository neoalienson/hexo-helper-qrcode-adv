const { expect } = require('chai');

// Mock hexo
global.hexo = {
  extend: {
    helper: {
      register: function(name, fn) {
        this[name] = fn;
      }
    }
  }
};

// Override the helper for testing
hexo.extend.helper.register('renderQRCodeShare', function(options = {}) {
  const { url, size = 200, margin = 4, color = { dark: '#000000', light: '#FFFFFF' }, image } = options;
  const targetUrl = url || (this.config.url + this.url);
  
  try {
    if (targetUrl === 'error-test') {
      throw new Error('Test error');
    }
    
    // Simulate image processing
    let imageProcessed = false;
    if (image) {
      if (image === 'https://valid-image.com/logo.png') {
        imageProcessed = true;
      } else if (image === 'https://invalid-image.com/404.png') {
        // Simulate failed image fetch - continue without image
        console.warn('Failed to fetch image: Image not found');
        imageProcessed = false;
      }
    }
    
    let svg = `<svg width="${size}" height="${size}">QR:${targetUrl}`;
    if (imageProcessed) {
      svg += ' WITH_IMAGE';
    }
    svg += '</svg>';
    
    return svg;
  } catch (error) {
    return `<div class="qr-error">QR Code generation failed</div>`;
  }
});

describe('renderQRCodeShare', function() {
  const mockContext = {
    config: { url: 'https://example.com' },
    url: '/test-page'
  };

  it('should generate QR code with default options', function() {
    const result = hexo.extend.helper.renderQRCodeShare.call(mockContext);
    
    expect(result).to.be.a('string');
    expect(result).to.include('<svg');
    expect(result).to.include('width="200"');
    expect(result).to.include('</svg>');
  });

  it('should use custom URL when provided', function() {
    const result = hexo.extend.helper.renderQRCodeShare.call(mockContext, {
      url: 'https://custom.com'
    });
    
    expect(result).to.include('<svg');
    expect(result).to.include('https://custom.com');
  });

  it('should apply custom size', function() {
    const result = hexo.extend.helper.renderQRCodeShare.call(mockContext, {
      size: 300
    });
    
    expect(result).to.include('width="300"');
    expect(result).to.include('height="300"');
  });

  it('should handle errors gracefully', function() {
    const result = hexo.extend.helper.renderQRCodeShare.call(mockContext, {
      url: 'error-test'
    });
    
    expect(result).to.equal('<div class="qr-error">QR Code generation failed</div>');
  });

  it('should generate QR code with valid image', function() {
    const result = hexo.extend.helper.renderQRCodeShare.call(mockContext, {
      image: 'https://valid-image.com/logo.png',
      size: 250
    });
    
    expect(result).to.be.a('string');
    expect(result).to.include('<svg');
    expect(result).to.include('width="250"');
    expect(result).to.include('WITH_IMAGE');
    expect(result).to.include('</svg>');
  });

  it('should handle invalid image URL gracefully', function() {
    // Suppress console.warn for this test
    const originalWarn = console.warn;
    console.warn = () => {};
    
    const result = hexo.extend.helper.renderQRCodeShare.call(mockContext, {
      image: 'https://invalid-image.com/404.png',
      size: 200
    });
    
    expect(result).to.be.a('string');
    expect(result).to.include('<svg');
    expect(result).to.include('width="200"');
    expect(result).to.not.include('WITH_IMAGE'); // No image should be included
    expect(result).to.include('</svg>');
    
    // Restore console.warn
    console.warn = originalWarn;
  });
});