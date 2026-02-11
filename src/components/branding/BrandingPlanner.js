import React, { useState, useMemo } from 'react';
import { 
  Palette, 
  Globe, 
  Image, 
  Printer, 
  CheckCircle,
  Search,
  Share2,
  ExternalLink,
  Eye,
  Download,
  Target,
  Users,
  Star,
  Award,
  Zap,
  Lightbulb,
  Heart,
  Sparkles,
  Camera,
  Type,
  Upload,
  Settings
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import FormField from '../ui/FormField';
import SectionCard from '../ui/SectionCard';
import branding from '../../config/branding';

const BrandingPlanner = () => {
  const { state, actions } = useApp();
  const [brandingData, setBrandingData] = useState({
    brandIdentity: {
      restaurantName: '',
      tagline: '',
      brandStory: '',
      targetAudience: '',
      brandPersonality: '',
      brandValues: [],
      competitiveAdvantage: '',
      uniqueSellingPoints: [],
      differentiationStrategy: '',
      marketPositioning: ''
    },
    visualIdentity: {
      logo: null,
      colorPalette: {
        primary: '#000000',
        secondary: '#ffffff',
        accent1: '#ff6b35',
        accent2: '#f7931e',
        neutral1: '#6b7280',
        neutral2: '#f3f4f6'
      },
      typography: {
        primaryFont: '',
        secondaryFont: '',
        headingFont: ''
      },
      imagery: {
        photographyStyle: '',
        illustrationStyle: '',
        moodBoard: []
      }
    },
    printedMaterials: {
      businessCards: {
        needed: false,
        quantity: 0,
        designNotes: '',
        specifications: ''
      },
      menus: {
        needed: false,
        types: [],
        quantity: 0,
        designNotes: '',
        specifications: ''
      },
      flyers: {
        needed: false,
        purpose: '',
        quantity: 0,
        designNotes: '',
        specifications: ''
      },
      signage: {
        needed: false,
        types: [],
        locations: [],
        designNotes: '',
        specifications: ''
      },
      packaging: {
        needed: false,
        types: [],
        designNotes: '',
        specifications: ''
      }
    },
    digitalPresence: {
      website: {
        needed: false,
        type: '',
        features: [],
        designNotes: '',
        contentRequirements: []
      },
      socialMedia: {
        platforms: [],
        contentStrategy: '',
        postingSchedule: '',
        engagementGoals: []
      },
      onlineMarketing: {
        seoStrategy: '',
        contentMarketing: '',
        emailMarketing: '',
        paidAdvertising: ''
      }
    }
  });

  const [activeTab, setActiveTab] = useState('brand-identity');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editingColor, setEditingColor] = useState(null);

  // Brand personality options with icons and descriptions
  const brandPersonalities = [
    { value: 'sophisticated', label: 'Sophisticated', icon: Star, color: 'purple', description: 'Elegant, refined, upscale' },
    { value: 'friendly', label: 'Friendly', icon: Heart, color: 'pink', description: 'Warm, welcoming, approachable' },
    { value: 'innovative', label: 'Innovative', icon: Zap, color: 'blue', description: 'Creative, cutting-edge, modern' },
    { value: 'authentic', label: 'Authentic', icon: Award, color: 'green', description: 'Genuine, traditional, heritage' },
    { value: 'energetic', label: 'Energetic', icon: Sparkles, color: 'orange', description: 'Vibrant, dynamic, exciting' }
  ];

  // Brand values with visual representations
  const brandValueOptions = [
    { value: 'quality', label: 'Quality', icon: Star, color: 'yellow' },
    { value: 'authenticity', label: 'Authenticity', icon: Heart, color: 'red' },
    { value: 'innovation', label: 'Innovation', icon: Zap, color: 'blue' },
    { value: 'sustainability', label: 'Sustainability', icon: Globe, color: 'green' },
    { value: 'community', label: 'Community', icon: Users, color: 'purple' },
    { value: 'excellence', label: 'Excellence', icon: Award, color: 'orange' }
  ];

  // Font options for typography
  const fontOptions = [
    { value: 'serif', label: 'Serif', preview: 'Times New Roman' },
    { value: 'sans-serif', label: 'Sans Serif', preview: 'Arial' },
    { value: 'display', label: 'Display', preview: 'Playfair Display' },
    { value: 'handwriting', label: 'Handwriting', preview: 'Dancing Script' }
  ];

  const [brandingConfig, setBrandingConfig] = useState(branding);
  const [previewMode, setPreviewMode] = useState(false);

  const tabs = [
    { id: 'brand-identity', label: 'Brand Identity', icon: Target, color: 'blue' },
    { id: 'visual-identity', label: 'Visual Identity', icon: Palette, color: 'purple' },
    { id: 'printed-materials', label: 'Printed Materials', icon: Printer, color: 'green' },
    { id: 'digital-presence', label: 'Digital Presence', icon: Globe, color: 'orange' },
    { id: 'app-config', label: 'App Configuration', icon: Settings, color: 'indigo' }
  ];

  const handleFieldChange = (section, field, value) => {
    setBrandingData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleColorChange = (colorKey, value) => {
    setBrandingData(prev => ({
      ...prev,
      visualIdentity: {
        ...prev.visualIdentity,
        colorPalette: {
          ...prev.visualIdentity.colorPalette,
          [colorKey]: value
        }
      }
    }));
  };

  const toggleBrandValue = (value) => {
    const currentValues = brandingData.brandIdentity.brandValues;
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    handleFieldChange('brandIdentity', 'brandValues', newValues);
  };

  const renderBrandIdentity = () => (
    <div className="space-y-6">
      {/* Brand Overview Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-900">Brand Foundation</h3>
            <p className="text-blue-700">Define your restaurant's core identity and positioning</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Restaurant Name"
          value={brandingData.brandIdentity.restaurantName}
          onChange={(value) => handleFieldChange('brandIdentity', 'restaurantName', value)}
          placeholder="Enter your restaurant name"
          icon={Star}
        />
        
        <FormField
          label="Tagline"
          value={brandingData.brandIdentity.tagline}
          onChange={(value) => handleFieldChange('brandIdentity', 'tagline', value)}
          placeholder="Your restaurant's memorable tagline"
          icon={Sparkles}
        />
      </div>

      <FormField
        label="Brand Story"
        value={brandingData.brandIdentity.brandStory}
        onChange={(value) => handleFieldChange('brandIdentity', 'brandStory', value)}
        placeholder="Tell the story behind your restaurant..."
        multiline
        rows={4}
        icon={Heart}
      />

      <FormField
        label="Target Audience"
        value={brandingData.brandIdentity.targetAudience}
        onChange={(value) => handleFieldChange('brandIdentity', 'targetAudience', value)}
        placeholder="Describe your ideal customers..."
        multiline
        rows={3}
        icon={Users}
      />

      {/* Brand Personality Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Palette className="h-5 w-5 mr-2 text-purple-500" />
          Brand Personality
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brandPersonalities.map((personality) => (
            <button
              key={personality.value}
              onClick={() => handleFieldChange('brandIdentity', 'brandPersonality', personality.value)}
              className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                brandingData.brandIdentity.brandPersonality === personality.value
                  ? `border-${personality.color}-500 bg-${personality.color}-50`
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center mb-2">
                <personality.icon className={`h-5 w-5 mr-2 text-${personality.color}-500`} />
                <span className="font-medium text-gray-900">{personality.label}</span>
              </div>
              <p className="text-sm text-gray-600">{personality.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Brand Values Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-yellow-500" />
          Core Brand Values
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {brandValueOptions.map((value) => (
            <button
              key={value.value}
              onClick={() => toggleBrandValue(value.value)}
              className={`p-3 border-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                brandingData.brandIdentity.brandValues.includes(value.value)
                  ? `border-${value.color}-500 bg-${value.color}-50 text-${value.color}-700`
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <value.icon className="h-4 w-4 mr-2" />
              {value.label}
            </button>
          ))}
        </div>
      </div>

      <FormField
        label="Competitive Advantage"
        value={brandingData.brandIdentity.competitiveAdvantage}
        onChange={(value) => handleFieldChange('brandIdentity', 'competitiveAdvantage', value)}
        placeholder="What makes your restaurant unique?"
        multiline
        rows={3}
        icon={Zap}
      />

      <FormField
        label="Market Positioning"
        value={brandingData.brandIdentity.marketPositioning}
        onChange={(value) => handleFieldChange('brandIdentity', 'marketPositioning', value)}
        placeholder="How do you want to be perceived in the market?"
        multiline
        rows={3}
        icon={Target}
      />
    </div>
  );

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      actions.showMessage('Error', 'Please upload an image file (JPG, PNG, etc.)', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      actions.showMessage('Error', 'Image file is too large. Maximum size is 5MB.', 'error');
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const logoData = {
        file: file,
        name: file.name,
        url: reader.result,
        uploadedAt: new Date().toISOString()
      };
      
      handleFieldChange('visualIdentity', 'logo', logoData);
      actions.showMessage('Success', 'Logo uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleLogoRemove = () => {
    handleFieldChange('visualIdentity', 'logo', null);
    actions.showMessage('Success', 'Logo removed', 'success');
  };

  const renderVisualIdentity = () => (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Image className="h-5 w-5 mr-2 text-blue-500" />
          Logo Upload
        </h4>
        <div className="space-y-4">
          {brandingData.visualIdentity.logo ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={brandingData.visualIdentity.logo.url}
                    alt="Logo preview"
                    className="max-w-xs max-h-48 object-contain border-2 border-gray-200 rounded-lg p-4 bg-gray-50"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {brandingData.visualIdentity.logo.name}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Uploaded {new Date(brandingData.visualIdentity.logo.uploadedAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={handleLogoRemove}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Remove Logo
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Replace Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Image className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-1">Upload Your Logo</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload your restaurant logo (JPG, PNG, SVG). Max size: 5MB
                  </p>
                </div>
                <label className="inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <span className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium">
                    <Image className="w-5 h-5 mr-2" />
                    Choose Logo File
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Color Palette Visualizer */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Palette className="h-5 w-5 mr-2 text-purple-500" />
          Color Palette
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(brandingData.visualIdentity.colorPalette).map(([key, color]) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setEditingColor(key);
                    setShowColorPicker(true);
                  }}
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Color Preview */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-900 mb-3">Color Preview</h5>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: brandingData.visualIdentity.colorPalette.primary }}
              />
              <span className="text-sm text-gray-700">Primary - Main brand color</span>
            </div>
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: brandingData.visualIdentity.colorPalette.accent1 }}
              />
              <span className="text-sm text-gray-700">Accent 1 - Highlight color</span>
            </div>
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: brandingData.visualIdentity.colorPalette.neutral1 }}
              />
              <span className="text-sm text-gray-700">Neutral - Text and borders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Typography Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Image className="h-5 w-5 mr-2 text-blue-500" />
          Typography
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fontOptions.map((font) => (
            <div key={font.value} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{font.label}</label>
              <select
                value={brandingData.visualIdentity.typography[font.value] || ''}
                onChange={(e) => handleFieldChange('visualIdentity', 'typography', {
                  ...brandingData.visualIdentity.typography,
                  [font.value]: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Select font...</option>
                <option value="serif">Serif</option>
                <option value="sans-serif">Sans Serif</option>
                <option value="display">Display</option>
                <option value="handwriting">Handwriting</option>
              </select>
              <div className="text-xs text-gray-500" style={{ fontFamily: font.preview }}>
                {font.preview} Preview
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Imagery Style */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Image className="h-5 w-5 mr-2 text-green-500" />
          Visual Style
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Photography Style"
            value={brandingData.visualIdentity.imagery.photographyStyle}
            onChange={(value) => handleFieldChange('visualIdentity', 'imagery', {
              ...brandingData.visualIdentity.imagery,
              photographyStyle: value
            })}
            placeholder="e.g., Natural, Stylized, Documentary..."
            icon={Camera}
          />
          <FormField
            label="Illustration Style"
            value={brandingData.visualIdentity.imagery.illustrationStyle}
            onChange={(value) => handleFieldChange('visualIdentity', 'imagery', {
              ...brandingData.visualIdentity.imagery,
              illustrationStyle: value
            })}
            placeholder="e.g., Minimalist, Hand-drawn, Geometric..."
            icon={Image}
          />
        </div>
      </div>
    </div>
  );

  const renderPrintedMaterials = () => (
    <div className="space-y-6">
      {/* Materials Overview */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <Printer className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-900">Printed Materials</h3>
            <p className="text-green-700">Plan your physical marketing materials and signage</p>
          </div>
        </div>
      </div>

      {/* Business Cards */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
            Business Cards
          </h4>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={brandingData.printedMaterials.businessCards.needed}
              onChange={(e) => handleFieldChange('printedMaterials', 'businessCards', {
                ...brandingData.printedMaterials.businessCards,
                needed: e.target.checked
              })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Needed</span>
          </label>
        </div>
        
        {brandingData.printedMaterials.businessCards.needed && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Quantity"
              type="number"
              value={brandingData.printedMaterials.businessCards.quantity}
              onChange={(value) => handleFieldChange('printedMaterials', 'businessCards', {
                ...brandingData.printedMaterials.businessCards,
                quantity: parseInt(value) || 0
              })}
              placeholder="500"
            />
            <FormField
              label="Design Notes"
              value={brandingData.printedMaterials.businessCards.designNotes}
              onChange={(value) => handleFieldChange('printedMaterials', 'businessCards', {
                ...brandingData.printedMaterials.businessCards,
                designNotes: value
              })}
              placeholder="Design preferences..."
            />
          </div>
        )}
      </div>

      {/* Menus */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-orange-500" />
            Menus
          </h4>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={brandingData.printedMaterials.menus.needed}
              onChange={(e) => handleFieldChange('printedMaterials', 'menus', {
                ...brandingData.printedMaterials.menus,
                needed: e.target.checked
              })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Needed</span>
          </label>
        </div>
        
        {brandingData.printedMaterials.menus.needed && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Types"
                value={brandingData.printedMaterials.menus.types.join(', ')}
                onChange={(value) => handleFieldChange('printedMaterials', 'menus', {
                  ...brandingData.printedMaterials.menus,
                  types: value.split(',').map(t => t.trim()).filter(t => t)
                })}
                placeholder="Dinner, Lunch, Bar, Dessert..."
              />
              <FormField
                label="Quantity"
                type="number"
                value={brandingData.printedMaterials.menus.quantity}
                onChange={(value) => handleFieldChange('printedMaterials', 'menus', {
                  ...brandingData.printedMaterials.menus,
                  quantity: parseInt(value) || 0
                })}
                placeholder="100"
              />
            </div>
            <FormField
              label="Design Notes"
              value={brandingData.printedMaterials.menus.designNotes}
              onChange={(value) => handleFieldChange('printedMaterials', 'menus', {
                ...brandingData.printedMaterials.menus,
                designNotes: value
              })}
              placeholder="Design preferences, paper quality..."
              multiline
              rows={3}
            />
          </div>
        )}
      </div>

      {/* Signage */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-purple-500" />
            Signage
          </h4>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={brandingData.printedMaterials.signage.needed}
              onChange={(e) => handleFieldChange('printedMaterials', 'signage', {
                ...brandingData.printedMaterials.signage,
                needed: e.target.checked
              })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Needed</span>
          </label>
        </div>
        
        {brandingData.printedMaterials.signage.needed && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Types"
                value={brandingData.printedMaterials.signage.types.join(', ')}
                onChange={(value) => handleFieldChange('printedMaterials', 'signage', {
                  ...brandingData.printedMaterials.signage,
                  types: value.split(',').map(t => t.trim()).filter(t => t)
                })}
                placeholder="Exterior, Interior, Window, A-frame..."
              />
              <FormField
                label="Locations"
                value={brandingData.printedMaterials.signage.locations.join(', ')}
                onChange={(value) => handleFieldChange('printedMaterials', 'signage', {
                  ...brandingData.printedMaterials.signage,
                  locations: value.split(',').map(t => t.trim()).filter(t => t)
                })}
                placeholder="Front door, Street corner, Interior walls..."
              />
            </div>
            <FormField
              label="Design Notes"
              value={brandingData.printedMaterials.signage.designNotes}
              onChange={(value) => handleFieldChange('printedMaterials', 'signage', {
                ...brandingData.printedMaterials.signage,
                designNotes: value
              })}
              placeholder="Size requirements, materials, lighting..."
              multiline
              rows={3}
            />
          </div>
        )}
      </div>
    </div>
  );

  const handleConfigColorChange = (key, value) => {
    setBrandingConfig(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value
      }
    }));
  };

  const handleConfigFontChange = (key, value) => {
    setBrandingConfig(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [key]: value
      }
    }));
  };

  const handleConfigLogoChange = (key, value) => {
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
    actions.showMessage('Success', 'Configuration copied to clipboard!', 'success');
  };

  const downloadConfig = () => {
    const blob = new Blob([generateConfigCode()], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'branding-config.js';
    a.click();
    URL.revokeObjectURL(url);
    actions.showMessage('Success', 'Configuration file downloaded!', 'success');
  };

  const renderDigitalPresence = () => (
    <div className="space-y-6">
      {/* Digital Overview */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-100 border border-orange-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="bg-orange-100 p-3 rounded-full mr-4">
            <Globe className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-orange-900">Digital Presence</h3>
            <p className="text-orange-700">Build your online brand and marketing strategy</p>
          </div>
        </div>
      </div>

      {/* Website Planning */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-blue-500" />
          Website Strategy
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Website Type"
              value={brandingData.digitalPresence.website.type}
              onChange={(value) => handleFieldChange('digitalPresence', 'website', {
                ...brandingData.digitalPresence.website,
                type: value
              })}
              placeholder="e.g., Informational, E-commerce, Blog..."
            />
            <FormField
              label="Key Features"
              value={brandingData.digitalPresence.website.features.join(', ')}
              onChange={(value) => handleFieldChange('digitalPresence', 'website', {
                ...brandingData.digitalPresence.website,
                features: value.split(',').map(t => t.trim()).filter(t => t)
              })}
              placeholder="Online ordering, Menu, Reservations..."
            />
          </div>
          <FormField
            label="Design Notes"
            value={brandingData.digitalPresence.website.designNotes}
            onChange={(value) => handleFieldChange('digitalPresence', 'website', {
              ...brandingData.digitalPresence.website,
              designNotes: value
            })}
            placeholder="Design preferences, user experience goals..."
            multiline
            rows={3}
          />
        </div>
      </div>

      {/* Social Media Strategy */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Share2 className="h-5 w-5 mr-2 text-pink-500" />
          Social Media Strategy
        </h4>
        <div className="space-y-4">
          <FormField
            label="Platforms"
            value={brandingData.digitalPresence.socialMedia.platforms.join(', ')}
            onChange={(value) => handleFieldChange('digitalPresence', 'socialMedia', {
              ...brandingData.digitalPresence.socialMedia,
              platforms: value.split(',').map(t => t.trim()).filter(t => t)
            })}
            placeholder="Instagram, Facebook, TikTok, LinkedIn..."
          />
          <FormField
            label="Content Strategy"
            value={brandingData.digitalPresence.socialMedia.contentStrategy}
            onChange={(value) => handleFieldChange('digitalPresence', 'socialMedia', {
              ...brandingData.digitalPresence.socialMedia,
              contentStrategy: value
            })}
            placeholder="Food photography, behind-the-scenes, customer stories..."
            multiline
            rows={3}
          />
          <FormField
            label="Posting Schedule"
            value={brandingData.digitalPresence.socialMedia.postingSchedule}
            onChange={(value) => handleFieldChange('digitalPresence', 'socialMedia', {
              ...brandingData.digitalPresence.socialMedia,
              postingSchedule: value
            })}
            placeholder="e.g., Daily posts, 3x per week..."
          />
        </div>
      </div>

      {/* Online Marketing */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-green-500" />
          Online Marketing
        </h4>
        <div className="space-y-4">
          <FormField
            label="SEO Strategy"
            value={brandingData.digitalPresence.onlineMarketing.seoStrategy}
            onChange={(value) => handleFieldChange('digitalPresence', 'onlineMarketing', {
              ...brandingData.digitalPresence.onlineMarketing,
              seoStrategy: value
            })}
            placeholder="Local SEO, keyword strategy, content optimization..."
            multiline
            rows={3}
          />
          <FormField
            label="Content Marketing"
            value={brandingData.digitalPresence.onlineMarketing.contentMarketing}
            onChange={(value) => handleFieldChange('digitalPresence', 'onlineMarketing', {
              ...brandingData.digitalPresence.onlineMarketing,
              contentMarketing: value
            })}
            placeholder="Blog posts, videos, infographics..."
            multiline
            rows={3}
          />
          <FormField
            label="Email Marketing"
            value={brandingData.digitalPresence.onlineMarketing.emailMarketing}
            onChange={(value) => handleFieldChange('digitalPresence', 'onlineMarketing', {
              ...brandingData.digitalPresence.onlineMarketing,
              emailMarketing: value
            })}
            placeholder="Newsletter, promotions, customer retention..."
            multiline
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderAppConfig = () => (
    <div className="space-y-6">
      {/* App Configuration Overview */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-100 border border-indigo-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <Settings className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-indigo-900">App Branding Configuration</h3>
            <p className="text-indigo-700">Update the application's visual branding (colors, fonts, logo)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Colors Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2 text-blue-600" />
              Colors
            </h4>
            <div className="space-y-4">
              {Object.entries(brandingConfig.colors).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700 w-32 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </label>
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleConfigColorChange(key, e.target.value)}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleConfigColorChange(key, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                    placeholder="#000000"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Fonts Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Type className="h-5 w-5 mr-2 text-blue-600" />
              Typography
            </h4>
            <div className="space-y-4">
              {Object.entries(brandingConfig.fonts).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700 w-32 capitalize">
                    {key}:
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleConfigFontChange(key, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Inter, sans-serif"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Logo Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Image className="h-5 w-5 mr-2 text-blue-600" />
              Logo & Branding
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700 w-32">Brand Name:</label>
                <input
                  type="text"
                  value={brandingConfig.logo.text}
                  onChange={(e) => handleConfigLogoChange('text', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700 w-32">Tagline:</label>
                <input
                  type="text"
                  value={brandingConfig.logo.subtext}
                  onChange={(e) => handleConfigLogoChange('subtext', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Export Configuration</h4>
                <p className="text-sm text-gray-600">
                  Copy or download the configuration code to update <code className="text-xs bg-gray-100 px-2 py-1 rounded">src/config/branding.js</code>
                </p>
              </div>
              <div className="flex space-x-2">
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
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Live Preview</h4>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 ${
                  previewMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>{previewMode ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            
            {previewMode && (
              <div className="space-y-6">
                {/* Color Palette Preview */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Color Palette</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {['primary', 'secondary', 'accent', 'backgroundAlt'].map((colorKey) => (
                      <div key={colorKey} className="text-center">
                        <div 
                          className="w-full h-12 rounded mb-1 border border-gray-200"
                          style={{ backgroundColor: brandingConfig.colors[colorKey] }}
                        ></div>
                        <p className="text-xs text-gray-600 capitalize">{colorKey}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography Preview */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Typography</h5>
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
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Buttons</h5>
                  <div className="space-y-2">
                    <button
                      className="w-full px-4 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: brandingConfig.colors.primary }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="w-full px-4 py-2 rounded-lg text-sm font-medium border"
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
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Brand</h5>
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
                      className="text-xs mt-1"
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
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <SectionCard 
        title="Branding & Visual Identity Planner" 
        description="Create a compelling brand identity that reflects your restaurant's unique personality and connects with your target audience."
        color="purple"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Palette className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Branding Strategy</h2>
              <p className="text-gray-600">Build a memorable brand that stands out in Boston's competitive dining scene</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export Plan
            </button>
            <button className="bg-white text-purple-600 border border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Tab Navigation */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? `border-${tab.color}-500 text-${tab.color}-600`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </div>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'brand-identity' && renderBrandIdentity()}
          {activeTab === 'visual-identity' && renderVisualIdentity()}
          {activeTab === 'printed-materials' && renderPrintedMaterials()}
          {activeTab === 'digital-presence' && renderDigitalPresence()}
          {activeTab === 'app-config' && renderAppConfig()}
        </div>
      </div>
    </div>
  );
};

export default BrandingPlanner;
