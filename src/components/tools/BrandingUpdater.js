import React, { useState } from 'react';
import { Eye, Palette, Type, Download, Upload } from 'lucide-react';
import branding from '../../config/branding';

const BrandingUpdater = () => {
  const [brandingConfig, setBrandingConfig] = useState(branding);
  const [previewMode, setPreviewMode] = useState(false);

  const handleColorChange = (category, key, value) => {
    setBrandingConfig(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value
      }
    }));
  };

  const handleFontChange = (key, value) => {
    setBrandingConfig(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [key]: value
      }
    }));
  };

  const handleLogoChange = (key, value) => {
    setBrandingConfig(prev => ({
      ...prev,
      logo: {
        ...prev.logo,
        [key]: value
      }
    }));
  };

  const generateConfigCode = () => {
    return `export const branding = ${JSON.stringify(brandingConfig, null, 2)};`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateConfigCode());
    alert('Configuration copied to clipboard!');
  };

  const downloadConfig = () => {
    const blob = new Blob([generateConfigCode()], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'branding-config.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  const ColorInput = ({ label, value, onChange }) => (
    <div className="flex items-center space-x-3">
      <label className="text-sm font-medium text-gray-700 w-24">{label}:</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm font-mono"
        placeholder="#000000"
      />
    </div>
  );

  const FontInput = ({ label, value, onChange }) => (
    <div className="flex items-center space-x-3">
      <label className="text-sm font-medium text-gray-700 w-24">{label}:</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
        placeholder="Inter, sans-serif"
      />
    </div>
  );

  const TextInput = ({ label, value, onChange }) => (
    <div className="flex items-center space-x-3">
      <label className="text-sm font-medium text-gray-700 w-24">{label}:</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
      />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Branding Configuration</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 ${
                  previewMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{previewMode ? 'Hide Preview' : 'Show Preview'}</span>
              </button>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Copy Config</span>
              </button>
              <button
                onClick={downloadConfig}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Configuration Panel */}
          <div className="flex-1 p-6">
            {/* Colors Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2 text-blue-600" />
                Colors
              </h2>
              <div className="space-y-4">
                <ColorInput
                  label="Primary"
                  value={brandingConfig.colors.primary}
                  onChange={(value) => handleColorChange('colors', 'primary', value)}
                />
                <ColorInput
                  label="Secondary"
                  value={brandingConfig.colors.secondary}
                  onChange={(value) => handleColorChange('colors', 'secondary', value)}
                />
                <ColorInput
                  label="Accent"
                  value={brandingConfig.colors.accent}
                  onChange={(value) => handleColorChange('colors', 'accent', value)}
                />
                <ColorInput
                  label="Text"
                  value={brandingConfig.colors.text}
                  onChange={(value) => handleColorChange('colors', 'text', value)}
                />
                <ColorInput
                  label="Text Light"
                  value={brandingConfig.colors.textLight}
                  onChange={(value) => handleColorChange('colors', 'textLight', value)}
                />
                <ColorInput
                  label="Background"
                  value={brandingConfig.colors.background}
                  onChange={(value) => handleColorChange('colors', 'background', value)}
                />
                <ColorInput
                  label="Background Alt"
                  value={brandingConfig.colors.backgroundAlt}
                  onChange={(value) => handleColorChange('colors', 'backgroundAlt', value)}
                />
              </div>
            </div>

            {/* Fonts Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2 text-blue-600" />
                Typography
              </h2>
              <div className="space-y-4">
                <FontInput
                  label="Heading"
                  value={brandingConfig.fonts.heading}
                  onChange={(value) => handleFontChange('heading', value)}
                />
                <FontInput
                  label="Body"
                  value={brandingConfig.fonts.body}
                  onChange={(value) => handleFontChange('body', value)}
                />
              </div>
            </div>

            {/* Logo Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2 text-blue-600" />
                Logo & Branding
              </h2>
              <div className="space-y-4">
                <TextInput
                  label="Brand Name"
                  value={brandingConfig.logo.text}
                  onChange={(value) => handleLogoChange('text', value)}
                />
                <TextInput
                  label="Tagline"
                  value={brandingConfig.logo.subtext}
                  onChange={(value) => handleLogoChange('subtext', value)}
                />
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          {previewMode && (
            <div className="w-96 border-l border-gray-200 p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
              
              {/* Color Palette Preview */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Color Palette</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <div 
                      className="w-full h-12 rounded mb-1"
                      style={{ backgroundColor: brandingConfig.colors.primary }}
                    ></div>
                    <p className="text-xs text-gray-600">Primary</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-full h-12 rounded mb-1"
                      style={{ backgroundColor: brandingConfig.colors.secondary }}
                    ></div>
                    <p className="text-xs text-gray-600">Secondary</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-full h-12 rounded mb-1"
                      style={{ backgroundColor: brandingConfig.colors.accent }}
                    ></div>
                    <p className="text-xs text-gray-600">Accent</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-full h-12 rounded mb-1"
                      style={{ backgroundColor: brandingConfig.colors.backgroundAlt }}
                    ></div>
                    <p className="text-xs text-gray-600">Background</p>
                  </div>
                </div>
              </div>

              {/* Typography Preview */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Typography</h4>
                <div className="space-y-2">
                  <h1 
                    className="text-xl font-bold"
                    style={{ 
                      color: brandingConfig.colors.text,
                      fontFamily: brandingConfig.fonts.heading
                    }}
                  >
                    Heading Font
                  </h1>
                  <p 
                    className="text-sm"
                    style={{ 
                      color: brandingConfig.colors.textLight,
                      fontFamily: brandingConfig.fonts.body
                    }}
                  >
                    Body font preview text
                  </p>
                </div>
              </div>

              {/* Button Preview */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Buttons</h4>
                <div className="space-y-2">
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ backgroundColor: brandingConfig.colors.primary }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium border"
                    style={{ 
                      borderColor: brandingConfig.colors.primary,
                      color: brandingConfig.colors.primary
                    }}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>

              {/* Brand Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Brand</h4>
                <div className="text-center p-4 rounded-lg border-2 border-dashed border-gray-300">
                  <h2 
                    className="text-lg font-bold"
                    style={{ 
                      color: brandingConfig.colors.primary,
                      fontFamily: brandingConfig.fonts.heading
                    }}
                  >
                    {brandingConfig.logo.text}
                  </h2>
                  <p 
                    className="text-xs"
                    style={{ 
                      color: brandingConfig.colors.textLight,
                      fontFamily: brandingConfig.fonts.body
                    }}
                  >
                    {brandingConfig.logo.subtext}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-t border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Instructions</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Update the colors, fonts, and branding text above</li>
            <li>Use the preview panel to see your changes in real-time</li>
            <li>Copy the configuration code and replace the content in <code>src/config/branding.js</code></li>
            <li>Build and deploy your app to see the changes</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default BrandingUpdater;
