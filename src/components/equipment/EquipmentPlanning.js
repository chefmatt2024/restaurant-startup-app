import React, { useState, useMemo, useEffect, useRef } from 'react';
import SectionCard from '../ui/SectionCard';
import { 
  Package, ChefHat, Coffee, Refrigerator, Zap, 
  CheckCircle, Utensils, Armchair, Music, Shield, Printer, Wifi,
  Search, Download, FileText, Globe, ShoppingCart,
  Plus, Trash2, ExternalLink, SortAsc, SortDesc, Upload, FileUp, X
} from 'lucide-react';

const EquipmentPlanning = () => {
  const [activeCategory, setActiveCategory] = useState('kitchen');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [bidSheet, setBidSheet] = useState([]);
  const [customEquipment, setCustomEquipment] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [showPdfImport, setShowPdfImport] = useState(false);
  const [importedVendors, setImportedVendors] = useState([]);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [plateStyles, setPlateStyles] = useState([]);
  const [showAddPlateStyle, setShowAddPlateStyle] = useState(false);
  const [editingPlateStyle, setEditingPlateStyle] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showBudgetTracker, setShowBudgetTracker] = useState(false);
  const [budget, setBudget] = useState({ total: 50000, spent: 0, remaining: 50000 });
  const [showUrlImport, setShowUrlImport] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importedEquipment, setImportedEquipment] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showVendorCardImport, setShowVendorCardImport] = useState(false);
  const [vendorCardImage, setVendorCardImage] = useState(null);
  const [extractedVendorData, setExtractedVendorData] = useState(null);
  const [isProcessingCard, setIsProcessingCard] = useState(false);
  const fileInputRef = useRef(null);
  const vendorCardInputRef = useRef(null);

  // Equipment Templates for Quick Setup
  const equipmentTemplates = [
    {
      id: 'basic-restaurant',
      name: 'Basic Restaurant Setup',
      description: 'Essential equipment for a small restaurant',
      budget: 25000,
      equipment: [
        'commercial-range', 'commercial-refrigerator', 'commercial-freezer',
        'dishwasher', 'pos-system', 'dining-tables', 'dining-chairs',
        'coffee-maker', 'ice-machine', 'food-prep-table'
      ]
    },
    {
      id: 'fine-dining',
      name: 'Fine Dining Restaurant',
      description: 'Premium equipment for upscale dining',
      budget: 75000,
      equipment: [
        'commercial-range', 'commercial-refrigerator', 'commercial-freezer',
        'dishwasher', 'pos-system', 'dining-tables', 'dining-chairs',
        'coffee-maker', 'ice-machine', 'food-prep-table', 'wine-cooler',
        'chafing-dishes', 'silverware', 'fine-china', 'linen-service'
      ]
    },
    {
      id: 'fast-casual',
      name: 'Fast Casual Restaurant',
      description: 'High-volume equipment for quick service',
      budget: 40000,
      equipment: [
        'commercial-range', 'commercial-refrigerator', 'commercial-freezer',
        'dishwasher', 'pos-system', 'dining-tables', 'dining-chairs',
        'coffee-maker', 'ice-machine', 'food-prep-table', 'soda-fountain',
        'display-case', 'microwave', 'toaster'
      ]
    },
    {
      id: 'cafe-bakery',
      name: 'Cafe & Bakery',
      description: 'Equipment for coffee shop and bakery',
      budget: 30000,
      equipment: [
        'commercial-refrigerator', 'commercial-freezer', 'dishwasher',
        'pos-system', 'dining-tables', 'dining-chairs', 'coffee-maker',
        'ice-machine', 'food-prep-table', 'display-case', 'microwave',
        'toaster', 'blender', 'mixer', 'oven'
      ]
    }
  ];

  // Quick Add Equipment Templates
  const quickAddTemplates = [
    {
      category: 'Kitchen Essentials',
      items: [
        { name: 'Commercial Range', cost: 3500, essential: true },
        { name: 'Commercial Refrigerator', cost: 4500, essential: true },
        { name: 'Commercial Freezer', cost: 2500, essential: true },
        { name: 'Dishwasher', cost: 3000, essential: true }
      ]
    },
    {
      category: 'Front of House',
      items: [
        { name: 'POS System', cost: 2500, essential: true },
        { name: 'Dining Tables (4)', cost: 1200, essential: true },
        { name: 'Dining Chairs (16)', cost: 1600, essential: true },
        { name: 'Coffee Maker', cost: 800, essential: true }
      ]
    },
    {
      category: 'Bar Equipment',
      items: [
        { name: 'Ice Machine', cost: 2000, essential: true },
        { name: 'Beer Cooler', cost: 1500, essential: false },
        { name: 'Wine Cooler', cost: 1200, essential: false },
        { name: 'Blender', cost: 300, essential: false }
      ]
    }
  ];

  // Add/Edit Plate Style Modal
  const renderAddPlateStyleModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {editingPlateStyle ? 'Edit Plate Style' : 'Add Plate Style'}
          </h3>
          <button
            onClick={() => {
              setShowAddPlateStyle(false);
              setEditingPlateStyle(null);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          
          const plateStyleData = {
            name: formData.get('name'),
            category: formData.get('category'),
            material: formData.get('material'),
            size: formData.get('size'),
            color: formData.get('color'),
            pattern: formData.get('pattern'),
            pricePerPiece: parseFloat(formData.get('pricePerPiece')) || 0,
            quantity: parseInt(formData.get('quantity')) || 0,
            description: formData.get('description'),
            sampleImageUrl: formData.get('sampleImageUrl'),
            vendor: formData.get('vendor'),
            vendorUrl: formData.get('vendorUrl'),
            notes: formData.get('notes')
          };
          
          if (editingPlateStyle) {
            const updatedStyles = plateStyles.map(item => 
              item.id === editingPlateStyle.id ? { ...item, ...plateStyleData } : item
            );
            setPlateStyles(updatedStyles);
          } else {
            const newPlateStyle = {
              id: Date.now().toString(),
              ...plateStyleData,
              createdAt: new Date().toISOString()
            };
            setPlateStyles([...plateStyles, newPlateStyle]);
          }
          
          setShowAddPlateStyle(false);
          setEditingPlateStyle(null);
        }}>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plate Style Name *</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingPlateStyle?.name || ''}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Classic White Dinner Plate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    defaultValue={editingPlateStyle?.category || 'Dinnerware'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Dinnerware">Dinnerware</option>
                    <option value="Appetizer Plates">Appetizer Plates</option>
                    <option value="Dessert Plates">Dessert Plates</option>
                    <option value="Bowls">Bowls</option>
                    <option value="Cups & Mugs">Cups & Mugs</option>
                    <option value="Glassware">Glassware</option>
                    <option value="Flatware">Flatware</option>
                    <option value="Serving Pieces">Serving Pieces</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                  <input
                    type="text"
                    name="material"
                    defaultValue={editingPlateStyle?.material || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Porcelain, Ceramic, Stoneware"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <input
                    type="text"
                    name="size"
                    defaultValue={editingPlateStyle?.size || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 10 inches, 8 inches"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    name="color"
                    defaultValue={editingPlateStyle?.color || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., White, Black, Blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
                  <input
                    type="text"
                    name="pattern"
                    defaultValue={editingPlateStyle?.pattern || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Solid, Floral, Geometric"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Quantity */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Pricing & Quantity</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Piece ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="pricePerPiece"
                    defaultValue={editingPlateStyle?.pricePerPiece || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Needed</label>
                  <input
                    type="number"
                    name="quantity"
                    defaultValue={editingPlateStyle?.quantity || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Sample & Vendor Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Sample & Vendor Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sample Image URL</label>
                  <input
                    type="url"
                    name="sampleImageUrl"
                    defaultValue={editingPlateStyle?.sampleImageUrl || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/sample-image.jpg"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
                    <input
                      type="text"
                      name="vendor"
                      defaultValue={editingPlateStyle?.vendor || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Restaurant Supply Co."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendor URL</label>
                    <input
                      type="url"
                      name="vendorUrl"
                      defaultValue={editingPlateStyle?.vendorUrl || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://vendor-website.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingPlateStyle?.description || ''}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional details about this plate style..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    defaultValue={editingPlateStyle?.notes || ''}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Special notes or considerations..."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddPlateStyle(false);
                  setEditingPlateStyle(null);
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingPlateStyle ? 'Update Plate Style' : 'Add Plate Style'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  // Quick Add Modal
  const renderQuickAddModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Quick Add Equipment</h3>
          <button
            onClick={() => setShowQuickAdd(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Equipment Templates */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Restaurant Templates</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipmentTemplates.map(template => (
                <div key={template.id} className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-gray-900">{template.name}</h5>
                    <span className="text-sm text-gray-600">${template.budget.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <button
                    onClick={() => applyTemplate(template)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Template
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Add Categories */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Quick Add by Category</h4>
            <div className="space-y-4">
              {quickAddTemplates.map(category => (
                <div key={category.category} className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3">{category.category}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {category.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`${category.category}-${index}`}
                            className="rounded"
                          />
                          <label htmlFor={`${category.category}-${index}`} className="text-sm">
                            {item.name}
                          </label>
                        </div>
                        <span className="text-sm font-medium">${item.cost.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => quickAddEquipment(category.items)}
                    className="mt-3 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add All {category.category}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Business Card Import Modal
  const renderVendorCardImportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Add Vendor from Business Card</h3>
          <button
            onClick={() => {
              setShowVendorCardImport(false);
              setVendorCardImage(null);
              setExtractedVendorData(null);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Card Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Business Card Photo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {vendorCardImage ? (
                <div className="space-y-4">
                  <img
                    src={URL.createObjectURL(vendorCardImage)}
                    alt="Business card preview"
                    className="mx-auto max-h-48 rounded-lg shadow-md"
                  />
                  <p className="text-sm text-gray-600">
                    {isProcessingCard ? 'Processing business card...' : 'Card uploaded successfully'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">Upload Business Card</p>
                    <p className="text-sm text-gray-600">Take a photo or upload an image of the business card</p>
                  </div>
                  <button
                    onClick={() => vendorCardInputRef.current?.click()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Choose File
                  </button>
                </div>
              )}
              
              <input
                ref={vendorCardInputRef}
                type="file"
                accept="image/*"
                onChange={handleVendorCardUpload}
                className="hidden"
              />
            </div>
            
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h5 className="font-medium text-green-900 mb-2">Tips for best results:</h5>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Ensure good lighting and clear text</li>
                <li>• Keep the card flat and avoid shadows</li>
                <li>• Include the entire card in the frame</li>
                <li>• Supported formats: JPG, PNG, PDF</li>
              </ul>
            </div>
          </div>

          {/* Extracted Vendor Data Preview */}
          {extractedVendorData && (
            <div className="border rounded-lg p-6 bg-gray-50">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Extracted Vendor Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={extractedVendorData.name}
                      onChange={(e) => setExtractedVendorData({
                        ...extractedVendorData,
                        name: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={extractedVendorData.contact.person}
                      onChange={(e) => setExtractedVendorData({
                        ...extractedVendorData,
                        contact: { ...extractedVendorData.contact, person: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={extractedVendorData.contact.title}
                      onChange={(e) => setExtractedVendorData({
                        ...extractedVendorData,
                        contact: { ...extractedVendorData.contact, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={extractedVendorData.contact.phone}
                      onChange={(e) => setExtractedVendorData({
                        ...extractedVendorData,
                        contact: { ...extractedVendorData.contact, phone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={extractedVendorData.contact.email}
                      onChange={(e) => setExtractedVendorData({
                        ...extractedVendorData,
                        contact: { ...extractedVendorData.contact, email: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="text"
                      value={extractedVendorData.contact.website}
                      onChange={(e) => setExtractedVendorData({
                        ...extractedVendorData,
                        contact: { ...extractedVendorData.contact, website: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      value={`${extractedVendorData.address.street}, ${extractedVendorData.address.city}, ${extractedVendorData.address.state} ${extractedVendorData.address.zip}`}
                      onChange={(e) => {
                        const addressParts = e.target.value.split(', ');
                        setExtractedVendorData({
                          ...extractedVendorData,
                          address: {
                            street: addressParts[0] || '',
                            city: addressParts[1] || '',
                            state: addressParts[2]?.split(' ')[0] || '',
                            zip: addressParts[2]?.split(' ')[1] || ''
                          }
                        });
                      }}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
                    <input
                      type="text"
                      value={extractedVendorData.specialties.join(', ')}
                      onChange={(e) => setExtractedVendorData({
                        ...extractedVendorData,
                        specialties: e.target.value.split(', ').filter(s => s.trim())
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Kitchen Equipment, Refrigeration, Installation"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={extractedVendorData.notes}
                      onChange={(e) => setExtractedVendorData({
                        ...extractedVendorData,
                        notes: e.target.value
                      })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowVendorCardImport(false);
                    setVendorCardImage(null);
                    setExtractedVendorData(null);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addExtractedVendor}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Vendor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // URL Import Modal
  const renderUrlImportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Import Equipment from URL</h3>
          <button
            onClick={() => {
              setShowUrlImport(false);
              setImportUrl('');
              setImportedEquipment(null);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipment URL
            </label>
            <div className="flex space-x-3">
              <input
                type="url"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="Paste Amazon, WebstaurantStore, or RestaurantSupply.com URL here"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => parseEquipmentUrl(importUrl)}
                disabled={!importUrl || isImporting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isImporting ? 'Importing...' : 'Import'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Supported sites: Amazon, WebstaurantStore, RestaurantSupply.com
            </p>
            
            {/* Example URLs */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Example URLs to try:</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">•</span>
                  <span className="text-gray-700">Amazon: https://amazon.com/dp/B08XYZ123</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">•</span>
                  <span className="text-gray-700">WebstaurantStore: https://webstaurantstore.com/12345.html</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">•</span>
                  <span className="text-gray-700">RestaurantSupply: https://restaurantsupply.com/product/123</span>
                </div>
              </div>
            </div>
          </div>

          {/* Imported Equipment Preview */}
          {importedEquipment && (
            <div className="border rounded-lg p-6 bg-gray-50">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Imported Equipment Preview</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Equipment Image */}
                <div>
                  <img
                    src={importedEquipment.imageUrl}
                    alt={importedEquipment.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-medium">Rating:</span>
                    <span>{importedEquipment.rating}/5</span>
                    <span>({importedEquipment.reviews} reviews)</span>
                  </div>
                </div>

                {/* Equipment Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={importedEquipment.name}
                      onChange={(e) => setImportedEquipment({...importedEquipment, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={importedEquipment.category}
                        onChange={(e) => setImportedEquipment({...importedEquipment, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="Cooking">Cooking</option>
                        <option value="Refrigeration">Refrigeration</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Front of House">Front of House</option>
                        <option value="Bar">Bar</option>
                        <option value="Storage">Storage</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input
                        type="number"
                        value={importedEquipment.estimatedCost}
                        onChange={(e) => setImportedEquipment({...importedEquipment, estimatedCost: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={importedEquipment.description}
                      onChange={(e) => setImportedEquipment({...importedEquipment, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
                    <textarea
                      value={importedEquipment.specifications}
                      onChange={(e) => setImportedEquipment({...importedEquipment, specifications: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                      <input
                        type="text"
                        value={importedEquipment.brand}
                        onChange={(e) => setImportedEquipment({...importedEquipment, brand: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                      <input
                        type="text"
                        value={importedEquipment.model}
                        onChange={(e) => setImportedEquipment({...importedEquipment, model: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowUrlImport(false);
                    setImportUrl('');
                    setImportedEquipment(null);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addImportedEquipment}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add to Equipment List
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Budget Tracker Modal
  const renderBudgetTrackerModal = () => {
    const budgetStatus = calculateBudgetStatus();
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Budget Tracker</h3>
            <button
              onClick={() => setShowBudgetTracker(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Budget Overview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Budget Overview</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Budget</label>
                  <input
                    type="number"
                    value={budget.total}
                    onChange={(e) => updateBudget({ ...budget, total: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Spent</label>
                  <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-900">
                    ${budgetStatus.spent.toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remaining</label>
                  <div className={`px-3 py-2 rounded-md ${
                    budgetStatus.isOverBudget ? 'bg-red-100 text-red-900' : 'bg-green-100 text-green-900'
                  }`}>
                    ${budgetStatus.remaining.toLocaleString()}
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Budget Usage</span>
                  <span className="text-sm text-gray-600">{budgetStatus.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      budgetStatus.isOverBudget ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(budgetStatus.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Equipment Breakdown */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Equipment Breakdown</h4>
              <div className="space-y-2">
                {bidSheet.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-gray-600 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">
                      ${(item.estimatedCost * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Add/Edit Equipment Modal
  const renderAddEquipmentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {editingEquipment ? 'Edit Equipment' : 'Add Custom Equipment'}
          </h3>
          <button
            onClick={() => {
              setShowAddEquipment(false);
              setEditingEquipment(null);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          
          // Parse online sources from form data
          const onlineSources = [];
          const sourceNames = formData.getAll('sourceName').filter(name => name.trim());
          const sourceUrls = formData.getAll('sourceUrl').filter(url => url.trim());
          const sourcePrices = formData.getAll('sourcePrice').filter(price => price.trim());
          const sourceRatings = formData.getAll('sourceRating').filter(rating => rating.trim());
          
          sourceNames.forEach((name, index) => {
            if (name && sourceUrls[index]) {
              onlineSources.push({
                name: name.trim(),
                url: sourceUrls[index].trim(),
                price: sourcePrices[index] ? parseFloat(sourcePrices[index]) : null,
                rating: sourceRatings[index] ? parseFloat(sourceRatings[index]) : null
              });
            }
          });
          
          const equipmentData = {
            name: formData.get('name'),
            category: formData.get('category'),
            estimatedCost: parseInt(formData.get('estimatedCost')),
            description: formData.get('description'),
            specifications: formData.get('specifications'),
            vendors: formData.get('vendors').split(',').map(v => v.trim()).filter(v => v),
            maintenance: formData.get('maintenance'),
            energyType: formData.get('energyType'),
            leadTime: formData.get('leadTime'),
            warranty: formData.get('warranty'),
            energyEfficiency: formData.get('energyEfficiency'),
            certifications: formData.get('certifications').split(',').map(c => c.trim()).filter(c => c),
            onlineSources: onlineSources,
            essential: formData.get('essential') === 'on'
          };
          
          if (editingEquipment) {
            const updatedEquipment = customEquipment.map(item => 
              item.id === editingEquipment.id ? { ...item, ...equipmentData } : item
            );
            setCustomEquipment(updatedEquipment);
          } else {
            addCustomEquipment(equipmentData);
          }
          
          setShowAddEquipment(false);
          setEditingEquipment(null);
        }}>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Name *</label>
                  <div>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingEquipment?.name || ''}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Commercial Refrigerator"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div>
                    <select
                      name="category"
                      defaultValue={editingEquipment?.category || 'Kitchen'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Kitchen">Kitchen Equipment</option>
                      <option value="Front of House">Front of House</option>
                      <option value="Bar">Bar Equipment</option>
                      <option value="Storage">Storage</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Food Prep">Food Prep</option>
                      <option value="Cooking">Cooking</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost ($)</label>
                  <div>
                    <input
                      type="number"
                      name="estimatedCost"
                      defaultValue={editingEquipment?.estimatedCost || ''}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Energy Type</label>
                  <div>
                    <input
                      type="text"
                      name="energyType"
                      defaultValue={editingEquipment?.energyType || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <div>
                    <textarea
                      name="description"
                      defaultValue={editingEquipment?.description || ''}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
                  <div>
                    <textarea
                      name="specifications"
                      defaultValue={editingEquipment?.specifications || ''}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendors (comma-separated)</label>
                  <div>
                    <input
                      type="text"
                      name="vendors"
                      defaultValue={editingEquipment?.vendors?.join(', ') || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Requirements</label>
                  <div>
                    <input
                      type="text"
                      name="maintenance"
                      defaultValue={editingEquipment?.maintenance || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Online Sources */}
              <div className="bg-green-50 p-4 rounded-lg mt-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Online Sources & Pricing</h4>
                <div id="onlineSources">
                  {editingEquipment?.onlineSources?.length > 0 ? (
                    editingEquipment.onlineSources.map((source, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-white rounded border">
                        <input
                          type="text"
                          name="sourceName"
                          defaultValue={source.name}
                          placeholder="Source Name"
                          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="url"
                          name="sourceUrl"
                          defaultValue={source.url}
                          placeholder="Website URL"
                          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          name="sourcePrice"
                          defaultValue={source.price}
                          placeholder="Price ($)"
                          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          name="sourceRating"
                          defaultValue={source.rating}
                          placeholder="Rating (1-5)"
                          min="1"
                          max="5"
                          step="0.1"
                          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-white rounded border">
                      <input
                        type="text"
                        name="sourceName"
                        placeholder="Source Name"
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="url"
                        name="sourceUrl"
                        placeholder="Website URL"
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        name="sourcePrice"
                        placeholder="Price ($)"
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        name="sourceRating"
                        placeholder="Rating (1-5)"
                        min="1"
                        max="5"
                        step="0.1"
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const container = document.getElementById('onlineSources');
                    const newSource = document.createElement('div');
                    newSource.className = 'grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-white rounded border';
                    newSource.innerHTML = `
                      <input type="text" name="sourceName" placeholder="Source Name" class="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="url" name="sourceUrl" placeholder="Website URL" class="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="number" name="sourcePrice" placeholder="Price ($)" class="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="number" name="sourceRating" placeholder="Rating (1-5)" min="1" max="5" step="0.1" class="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    `;
                    container.appendChild(newSource);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Online Source</span>
                </button>
              </div>

              {/* Equipment Options */}
              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Equipment Options</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="essential"
                    defaultChecked={editingEquipment?.essential || false}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <label className="text-sm font-medium text-gray-700">Mark as Essential Equipment</label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowAddEquipment(false);
                  setEditingEquipment(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingEquipment ? 'Update Equipment' : 'Add Equipment'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  // PDF Import Modal
  const renderPdfImportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Import Vendors from PDF</h3>
          <button
            onClick={() => setShowPdfImport(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Vendor PDF</h4>
            <p className="text-gray-600 mb-4">
              Upload a PDF file containing vendor information. The system will extract vendor details including contact information, specialties, and services.
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handlePdfUpload}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingPdf}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              <Upload className="h-4 w-4" />
              <span>{isProcessingPdf ? 'Processing...' : 'Choose PDF File'}</span>
            </button>
            
            <p className="text-sm text-gray-500 mt-2">
              Supported format: PDF files only
            </p>
          </div>

          {isProcessingPdf && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-blue-800">Processing PDF and extracting vendor information...</span>
              </div>
            </div>
          )}

          {importedVendors.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Extracted Vendors</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {importedVendors.map((vendor) => (
                  <div key={vendor.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">{vendor.name}</h5>
                        <p className="text-sm text-gray-600">{vendor.type}</p>
                        <p className="text-sm text-gray-500">{vendor.contact.phone} • {vendor.contact.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Rating: {vendor.rating}/5</span>
                        <button
                          onClick={() => addImportedVendor(vendor)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={addAllImportedVendors}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add All Vendors
                </button>
                <button
                  onClick={() => setImportedVendors([])}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Enhanced Equipment Data with Online Sources
  const kitchenEquipment = useMemo(() => [
    // COOKING EQUIPMENT
    {
      id: 'commercial-range',
      name: 'Commercial Gas Range',
      category: 'Cooking',
      
      icon: ChefHat,
      essential: true,
      estimatedCost: 3500,
      description: '6-burner commercial range with oven',
      specifications: '36" wide, BTU 180,000',
      vendors: ['Boston Showcase Company', 'Supplies on the Fly'],
      maintenance: 'Annual cleaning and calibration',
      energyType: 'Gas',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 3200, rating: 4.5 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 3400, rating: 4.3 },
        { name: 'Restaurant Equipment World', url: 'https://www.restaurantequipmentworld.com', price: 3300, rating: 4.4 }
      ],
      leadTime: '2-3 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'commercial-oven',
      name: 'Commercial Convection Oven',
      category: 'Cooking',
      icon: ChefHat,
      essential: true,
      estimatedCost: 4200,
      description: 'Double-stack convection oven for baking and roasting',
      specifications: 'Full-size, 10 rack capacity, 350°F max',
      vendors: ['Boston Showcase Company', 'Supplies on the Fly'],
      maintenance: 'Monthly cleaning, quarterly calibration',
      energyType: 'Gas/Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 4000, rating: 4.6 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 4100, rating: 4.4 }
      ],
      leadTime: '2-3 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'pizza-oven',
      name: 'Wood-Fired Pizza Oven',
      category: 'Cooking',
      icon: ChefHat,
      essential: false,
      estimatedCost: 8500,
      description: 'Traditional wood-fired pizza oven',
      specifications: '36" cooking surface, 800-900°F',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily ash removal, monthly deep clean',
      energyType: 'Wood',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 8000, rating: 4.7 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 8200, rating: 4.5 }
      ],
      leadTime: '4-6 weeks',
      warranty: '2 years',
      energyEfficiency: 'Medium',
      certifications: ['NSF']
    },
    {
      id: 'salamander-broiler',
      name: 'Salamander Broiler',
      category: 'Cooking',
      icon: ChefHat,
      essential: false,
      estimatedCost: 1800,
      description: 'Overhead broiler for finishing dishes',
      specifications: '24" wide, 2000°F max temperature',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Weekly cleaning, monthly calibration',
      energyType: 'Gas',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 1700, rating: 4.4 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 1750, rating: 4.2 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'steam-jacket-kettle',
      name: 'Steam Jacket Kettle',
      category: 'Cooking',
      icon: ChefHat,
      essential: false,
      estimatedCost: 3200,
      description: 'Steam-heated kettle for soups and sauces',
      specifications: '40 quart capacity, steam jacket heating',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning, monthly descaling',
      energyType: 'Steam',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 3000, rating: 4.5 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 3100, rating: 4.3 }
      ],
      leadTime: '2-3 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'commercial-microwave',
      name: 'Commercial Microwave',
      category: 'Cooking',
      icon: ChefHat,
      essential: true,
      estimatedCost: 800,
      description: 'High-power commercial microwave',
      specifications: '1.6 cu ft, 1500W, stainless steel',
      vendors: ['Boston Showcase Company', 'Supplies on the Fly'],
      maintenance: 'Daily cleaning, monthly filter replacement',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 750, rating: 4.3 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 780, rating: 4.1 }
      ],
      leadTime: '1 week',
      warranty: '1 year',
      energyEfficiency: 'Medium',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'deep-fryer',
      name: 'Commercial Deep Fryer',
      category: 'Cooking',
      icon: ChefHat,
      essential: true,
      estimatedCost: 2200,
      description: 'Dual-basket deep fryer',
      specifications: '40-50 lb oil capacity',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily oil filtering, weekly deep clean',
      energyType: 'Gas/Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 2100, rating: 4.6 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 2150, rating: 4.4 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'Medium',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'commercial-grill',
      name: 'Commercial Flat Top Grill',
      category: 'Cooking',
      icon: ChefHat,
      essential: false,
      estimatedCost: 2800,
      description: 'Flat top grill for burgers and sandwiches',
      specifications: '36" wide, temperature range 200-550°F',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily seasoning, weekly deep clean',
      energyType: 'Gas',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 2600, rating: 4.5 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 2700, rating: 4.3 }
      ],
      leadTime: '2-3 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'char-broiler',
      name: 'Char Broiler',
      category: 'Cooking',
      icon: ChefHat,
      essential: false,
      estimatedCost: 3200,
      description: 'Gas char broiler for steaks and grilled items',
      specifications: '36" wide, adjustable height, 2000°F max',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning, weekly deep clean',
      energyType: 'Gas',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 3000, rating: 4.4 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 3100, rating: 4.2 }
      ],
      leadTime: '2-3 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'plancha-grill',
      name: 'Plancha Grill',
      category: 'Cooking',
      icon: ChefHat,
      essential: false,
      estimatedCost: 2400,
      description: 'Flat top plancha for searing and cooking',
      specifications: '30" wide, 400-500°F, cast iron surface',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily seasoning, weekly deep clean',
      energyType: 'Gas',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 2200, rating: 4.3 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 2300, rating: 4.1 }
      ],
      leadTime: '2-3 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'wok-station',
      name: 'Wok Station',
      category: 'Cooking',
      icon: ChefHat,
      essential: false,
      estimatedCost: 1800,
      description: 'High-BTU wok station for Asian cooking',
      specifications: '200,000 BTU, 24" wok ring, gas',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning, monthly calibration',
      energyType: 'Gas',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 1700, rating: 4.5 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 1750, rating: 4.3 }
      ],
      leadTime: '2-3 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'pasta-cooker',
      name: 'Pasta Cooker',
      category: 'Cooking',
      icon: ChefHat,
      essential: false,
      estimatedCost: 1500,
      description: 'Dedicated pasta cooking station',
      specifications: '3 compartments, 20L each, 200°F',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning, weekly descaling',
      energyType: 'Gas/Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 1400, rating: 4.2 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 1450, rating: 4.0 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'rice-cooker',
      name: 'Commercial Rice Cooker',
      category: 'Cooking',
      icon: ChefHat,
      essential: false,
      estimatedCost: 1200,
      description: 'Large capacity commercial rice cooker',
      specifications: '40 cup capacity, automatic keep warm',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning, monthly descaling',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 1100, rating: 4.4 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 1150, rating: 4.2 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'sous-vide-circulator',
      name: 'Sous Vide Circulator',
      category: 'Cooking',
      icon: ChefHat,
      essential: false,
      estimatedCost: 800,
      description: 'Precision temperature water circulator',
      specifications: 'Temperature range 68-194°F, 16L capacity',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Weekly cleaning, monthly calibration',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 750, rating: 4.6 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 780, rating: 4.4 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'walk-in-cooler',
      name: 'Walk-in Cooler',
      category: 'Refrigeration',
      icon: Refrigerator,
      essential: true,
      estimatedCost: 8500,
      description: 'Walk-in refrigeration unit',
      specifications: '8x8x8 ft, 35-38°F',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Monthly coil cleaning, annual service',
      energyType: 'Electric'
    },
    {
      id: 'reach-in-freezer',
      name: 'Reach-in Freezer',
      category: 'Refrigeration',
      icon: Refrigerator,
      essential: true,
      estimatedCost: 3200,
      description: '2-door commercial freezer',
      specifications: '54" wide, 0-10°F',
      vendors: ['Boston Showcase Company', 'Supplies on the Fly'],
      maintenance: 'Monthly defrost, quarterly service',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 3000, rating: 4.4 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 3100, rating: 4.2 }
      ],
      leadTime: '2-3 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'Energy Star']
    },
    {
      id: 'reach-in-refrigerator',
      name: 'Reach-in Refrigerator',
      category: 'Refrigeration',
      icon: Refrigerator,
      essential: true,
      estimatedCost: 2800,
      description: '2-door commercial refrigerator',
      specifications: '54" wide, 35-38°F',
      vendors: ['Boston Showcase Company', 'Supplies on the Fly'],
      maintenance: 'Monthly cleaning, quarterly service',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 2600, rating: 4.5 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 2700, rating: 4.3 }
      ],
      leadTime: '2-3 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'Energy Star']
    },
    {
      id: 'undercounter-refrigerator',
      name: 'Undercounter Refrigerator',
      category: 'Refrigeration',
      icon: Refrigerator,
      essential: true,
      estimatedCost: 1200,
      description: 'Undercounter prep refrigerator',
      specifications: '24" wide, 35-38°F, 2 compartments',
      vendors: ['Boston Showcase Company', 'Supplies on the Fly'],
      maintenance: 'Weekly cleaning, monthly service',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 1100, rating: 4.3 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 1150, rating: 4.1 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'Energy Star']
    },
    {
      id: 'walk-in-freezer',
      name: 'Walk-in Freezer',
      category: 'Refrigeration',
      icon: Refrigerator,
      essential: true,
      estimatedCost: 12000,
      description: 'Walk-in freezer for bulk storage',
      specifications: '8x8x8 ft, -10 to 0°F',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Monthly coil cleaning, annual service',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 11500, rating: 4.6 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 11800, rating: 4.4 }
      ],
      leadTime: '4-6 weeks',
      warranty: '2 years',
      energyEfficiency: 'High',
      certifications: ['NSF', 'Energy Star']
    },
    {
      id: 'wine-refrigerator',
      name: 'Wine Refrigerator',
      category: 'Refrigeration',
      icon: Refrigerator,
      essential: false,
      estimatedCost: 1800,
      description: 'Dual-zone wine refrigerator',
      specifications: '50 bottle capacity, dual temperature zones',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Monthly cleaning',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 1700, rating: 4.3 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 1750, rating: 4.1 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'Energy Star']
    },
    {
      id: 'ice-machine',
      name: 'Commercial Ice Machine',
      category: 'Refrigeration',
      icon: Refrigerator,
      essential: true,
      estimatedCost: 4500,
      description: 'Undercounter ice machine for bar service',
      specifications: '500 lbs ice production per day',
      vendors: ['Boston Showcase Company', 'Supplies on the Fly'],
      maintenance: 'Monthly cleaning and sanitizing',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 4200, rating: 4.4 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 4400, rating: 4.2 }
      ],
      leadTime: '2-3 weeks',
      warranty: '2 years',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'blast-chiller',
      name: 'Blast Chiller',
      category: 'Refrigeration',
      icon: Refrigerator,
      essential: false,
      estimatedCost: 8500,
      description: 'Rapid cooling unit for food safety',
      specifications: '20 rack capacity, 0-3°F in 90 minutes',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Weekly cleaning, monthly service',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 8000, rating: 4.5 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 8200, rating: 4.3 }
      ],
      leadTime: '4-6 weeks',
      warranty: '2 years',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'prep-tables',
      name: 'Stainless Steel Prep Tables',
      category: 'Prep',
      icon: Utensils,
      essential: true,
      estimatedCost: 800,
      description: 'Set of 3 prep tables with storage',
      specifications: '30" x 72" each, with undershelf',
      vendors: ['Boston Showcase Company', 'Supplies on the Fly'],
      maintenance: 'Daily sanitizing',
      energyType: 'None',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 750, rating: 4.4 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 780, rating: 4.2 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'N/A',
      certifications: ['NSF']
    },
    {
      id: 'food-processor',
      name: 'Commercial Food Processor',
      category: 'Prep',
      icon: Utensils,
      essential: true,
      estimatedCost: 1200,
      description: 'High-capacity food processor for prep work',
      specifications: '12 cup capacity, 2 HP motor',
      vendors: ['Boston Showcase Company', 'Supplies on the Fly'],
      maintenance: 'Daily cleaning, weekly deep clean',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 1100, rating: 4.5 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 1150, rating: 4.3 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'meat-slicer',
      name: 'Commercial Meat Slicer',
      category: 'Prep',
      icon: Utensils,
      essential: true,
      estimatedCost: 1800,
      description: 'Heavy-duty meat slicer for deli and charcuterie',
      specifications: '12" blade, 1/2 HP motor, auto sharpening',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning, weekly blade sharpening',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 1700, rating: 4.6 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 1750, rating: 4.4 }
      ],
      leadTime: '2-3 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'mandoline-slicer',
      name: 'Commercial Mandoline Slicer',
      category: 'Prep',
      icon: Utensils,
      essential: false,
      estimatedCost: 300,
      description: 'Adjustable mandoline for precise slicing',
      specifications: 'Stainless steel, 6 blade settings',
      vendors: ['Supplies on the Fly'],
      maintenance: 'Daily cleaning, weekly sharpening',
      energyType: 'Manual',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 280, rating: 4.4 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 290, rating: 4.2 }
      ],
      leadTime: '3-5 days',
      warranty: '6 months',
      energyEfficiency: 'N/A',
      certifications: ['NSF']
    },
    {
      id: 'mixer-stand',
      name: 'Commercial Stand Mixer',
      category: 'Prep',
      icon: Utensils,
      essential: true,
      estimatedCost: 1500,
      description: 'Heavy-duty stand mixer for dough and batters',
      specifications: '20 quart capacity, 1 HP motor',
      vendors: ['Boston Showcase Company', 'Supplies on the Fly'],
      maintenance: 'Daily cleaning, monthly lubrication',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 1400, rating: 4.7 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 1450, rating: 4.5 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'immersion-blender',
      name: 'Commercial Immersion Blender',
      category: 'Prep',
      icon: Utensils,
      essential: true,
      estimatedCost: 400,
      description: 'High-power immersion blender for soups and sauces',
      specifications: '1000W motor, stainless steel shaft',
      vendors: ['Boston Showcase Company', 'Supplies on the Fly'],
      maintenance: 'Daily cleaning, weekly deep clean',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 380, rating: 4.5 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 390, rating: 4.3 }
      ],
      leadTime: '3-5 days',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'knife-set',
      name: 'Professional Knife Set',
      category: 'Prep',
      icon: Utensils,
      essential: true,
      estimatedCost: 800,
      description: 'Complete professional knife set',
      specifications: '12 knives, honing steel, knife block',
      vendors: ['Supplies on the Fly'],
      maintenance: 'Daily cleaning, weekly sharpening',
      energyType: 'Manual',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 750, rating: 4.6 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 780, rating: 4.4 }
      ],
      leadTime: '3-5 days',
      warranty: 'Lifetime',
      energyEfficiency: 'N/A',
      certifications: ['NSF']
    },
    {
      id: 'cutting-boards',
      name: 'Commercial Cutting Boards',
      category: 'Prep',
      icon: Utensils,
      essential: true,
      estimatedCost: 200,
      description: 'Set of color-coded cutting boards',
      specifications: '6 boards, HDPE material, 18" x 24"',
      vendors: ['Supplies on the Fly'],
      maintenance: 'Daily sanitizing, monthly replacement',
      energyType: 'None',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 180, rating: 4.4 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 190, rating: 4.2 }
      ],
      leadTime: '3-5 days',
      warranty: '6 months',
      energyEfficiency: 'N/A',
      certifications: ['NSF']
    },
    {
      id: 'scale-digital',
      name: 'Digital Scale',
      category: 'Prep',
      icon: Utensils,
      essential: true,
      estimatedCost: 150,
      description: 'Precision digital scale for portioning',
      specifications: '50 lb capacity, 0.1 oz accuracy',
      vendors: ['Supplies on the Fly'],
      maintenance: 'Daily cleaning, monthly calibration',
      energyType: 'Battery',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 140, rating: 4.5 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 145, rating: 4.3 }
      ],
      leadTime: '3-5 days',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF']
    },
    {
      id: 'thermometer-pen',
      name: 'Digital Thermometer',
      category: 'Prep',
      icon: Utensils,
      essential: true,
      estimatedCost: 80,
      description: 'Instant-read digital thermometer',
      specifications: 'Temperature range -58 to 572°F, 1 second read',
      vendors: ['Supplies on the Fly'],
      maintenance: 'Daily cleaning, monthly calibration',
      energyType: 'Battery',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 75, rating: 4.6 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 78, rating: 4.4 }
      ],
      leadTime: '3-5 days',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF']
    },
    {
      id: 'commercial-dishwasher',
      name: 'Commercial Dishwasher',
      category: 'Cleaning',
      icon: Package,
      essential: true,
      estimatedCost: 4500,
      description: 'High-temp door-type dishwasher',
      specifications: '24" rack size, 180°F sanitizing',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning, monthly descaling',
      energyType: 'Electric + Water'
    },
    {
      id: 'hood-system',
      name: 'Kitchen Ventilation Hood',
      category: 'Ventilation',
      icon: Zap,
      essential: true,
      estimatedCost: 7500,
      description: 'Commercial kitchen exhaust hood with fire suppression',
      specifications: '12 ft hood with Type K suppression',
      vendors: ['CS Ventilation'],
      maintenance: 'Quarterly cleaning, annual inspection',
      energyType: 'Electric'
    },
    {
      id: 'espresso-machine',
      name: 'Commercial Espresso Machine',
      category: 'Beverage',
      icon: Coffee,
      essential: false,
      estimatedCost: 5500,
      description: '2-group espresso machine',
      specifications: 'Semi-automatic, steam wand',
      vendors: ['Espresso Plus', 'Intelligentsia Coffee'],
      maintenance: 'Daily cleaning, weekly descaling',
      energyType: 'Electric + Water'
    },
    {
      id: 'commercial-oven',
      name: 'Commercial Convection Oven',
      category: 'Cooking',
      icon: ChefHat,
      essential: true,
      estimatedCost: 4200,
      description: 'Double-stack convection oven',
      specifications: 'Full-size, 6-pan capacity each',
      vendors: ['Boston Showcase Company', 'Supplies on the Fly'],
      maintenance: 'Monthly cleaning and calibration',
      energyType: 'Gas/Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 4000, rating: 4.4 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 4100, rating: 4.2 }
      ],
      leadTime: '2-3 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'commercial-mixer',
      name: 'Commercial Stand Mixer',
      category: 'Food Prep',
      icon: ChefHat,
      essential: true,
      estimatedCost: 1800,
      description: 'Heavy-duty commercial mixer',
      specifications: '60-quart capacity, 3 HP motor',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Weekly cleaning and lubrication',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 1700, rating: 4.6 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 1750, rating: 4.4 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'food-processor',
      name: 'Commercial Food Processor',
      category: 'Food Prep',
      icon: ChefHat,
      essential: true,
      estimatedCost: 1200,
      description: 'Heavy-duty food processor',
      specifications: '12-cup capacity, multiple blades',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 1100, rating: 4.5 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 1150, rating: 4.3 }
      ],
      leadTime: '1 week',
      warranty: '1 year',
      energyEfficiency: 'Medium',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'commercial-slicer',
      name: 'Commercial Meat Slicer',
      category: 'Food Prep',
      icon: ChefHat,
      essential: false,
      estimatedCost: 2500,
      description: 'Automatic meat and cheese slicer',
      specifications: '12" blade, variable thickness',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning and blade sharpening',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 2300, rating: 4.4 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 2400, rating: 4.2 }
      ],
      leadTime: '2-3 weeks',
      warranty: '1 year',
      energyEfficiency: 'Medium',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'commercial-griddle',
      name: 'Commercial Griddle',
      category: 'Cooking',
      icon: ChefHat,
      essential: true,
      estimatedCost: 2800,
      description: 'Heavy-duty commercial griddle',
      specifications: '36" x 24" cooking surface',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning and seasoning',
      energyType: 'Gas',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 2600, rating: 4.5 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 2700, rating: 4.3 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'commercial-steamer',
      name: 'Commercial Steamer',
      category: 'Cooking',
      icon: ChefHat,
      essential: false,
      estimatedCost: 3200,
      description: 'Convection steamer for vegetables and rice',
      specifications: '4-pan capacity, programmable',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Weekly descaling and cleaning',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 3000, rating: 4.3 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 3100, rating: 4.1 }
      ],
      leadTime: '2-3 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'commercial-refrigerator',
      name: 'Commercial Refrigerator',
      category: 'Storage',
      icon: Refrigerator,
      essential: true,
      estimatedCost: 3500,
      description: 'Reach-in commercial refrigerator',
      specifications: '72" height, 3-door, glass front',
      vendors: ['Boston Showcase Company', 'Supplies on the Fly'],
      maintenance: 'Monthly cleaning and gasket inspection',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 3300, rating: 4.4 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 3400, rating: 4.2 }
      ],
      leadTime: '2-3 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'Energy Star']
    },
    {
      id: 'commercial-freezer',
      name: 'Commercial Freezer',
      category: 'Storage',
      icon: Refrigerator,
      essential: true,
      estimatedCost: 2800,
      description: 'Reach-in commercial freezer',
      specifications: '72" height, 2-door, solid front',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Monthly cleaning and defrosting',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 2600, rating: 4.3 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 2700, rating: 4.1 }
      ],
      leadTime: '2-3 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'Energy Star']
    },
    {
      id: 'commercial-dishwasher',
      name: 'Commercial Dishwasher',
      category: 'Cleaning',
      icon: ChefHat,
      essential: true,
      estimatedCost: 4500,
      description: 'High-temperature commercial dishwasher',
      specifications: 'Rack conveyor, 180°F final rinse',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning and chemical refill',
      energyType: 'Electric/Gas',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 4200, rating: 4.5 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 4300, rating: 4.3 }
      ],
      leadTime: '2-3 weeks',
      warranty: '1 year',
      energyEfficiency: 'Medium',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'three-compartment-sink',
      name: 'Three-Compartment Sink',
      category: 'Cleaning',
      icon: ChefHat,
      essential: true,
      estimatedCost: 800,
      description: 'Stainless steel three-compartment sink',
      specifications: '24" x 20" x 8" deep each compartment',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily sanitizing',
      energyType: 'Plumbing',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 750, rating: 4.5 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 780, rating: 4.3 }
      ],
      leadTime: '1 week',
      warranty: '1 year',
      energyEfficiency: 'N/A',
      certifications: ['NSF']
    }
  ], []);

  // Front of House Equipment
  const frontOfHouseEquipment = useMemo(() => [
    {
      id: 'pos-system',
      name: 'Point of Sale System',
      category: 'Technology',
      icon: Printer,
      essential: true,
      estimatedCost: 2500,
      description: 'Complete POS system with terminals',
      specifications: '2 terminals, payment processing',
      vendors: ['Toast POS'],
      maintenance: 'Software updates, annual service',
      energyType: 'Electric + Internet'
    },
    {
      id: 'dining-tables',
      name: 'Dining Tables',
      category: 'Furniture',
      icon: Armchair,
      essential: true,
      estimatedCost: 3000,
      description: 'Restaurant dining tables (set of 12)',
      specifications: '30" x 30" and 24" x 42" tops',
      vendors: ['Boston Showcase Company', 'Wayfair'],
      maintenance: 'Daily cleaning, annual refinishing',
      energyType: 'None'
    },
    {
      id: 'dining-chairs',
      name: 'Dining Chairs',
      category: 'Furniture',
      icon: Armchair,
      essential: true,
      estimatedCost: 2400,
      description: 'Restaurant chairs (set of 48)',
      specifications: 'Commercial-grade, stackable',
      vendors: ['Boston Showcase Company', 'Wayfair'],
      maintenance: 'Weekly inspection, annual reupholstering',
      energyType: 'None'
    },
    {
      id: 'sound-system',
      name: 'Sound System',
      category: 'Audio/Visual',
      icon: Music,
      essential: false,
      estimatedCost: 1800,
      description: 'Background music and announcement system',
      specifications: 'Wireless, multi-zone control',
      vendors: ['Crutchfield', 'Rockbot'],
      maintenance: 'Annual inspection',
      energyType: 'Electric'
    },
    {
      id: 'security-system',
      name: 'Security System',
      category: 'Security',
      icon: Shield,
      essential: true,
      estimatedCost: 2200,
      description: 'Cameras and alarm system',
      specifications: '8 cameras, 24/7 monitoring',
      vendors: ['Frontpoint Security'],
      maintenance: 'Monthly testing, annual service',
      energyType: 'Electric + Internet'
    },
    {
      id: 'internet-phone',
      name: 'Internet & Phone System',
      category: 'Technology',
      icon: Wifi,
      essential: true,
      estimatedCost: 800,
      description: 'Business internet and phone setup',
      specifications: 'High-speed internet, VoIP phones',
      vendors: ['Comcast', 'Verizon Wireless'],
      maintenance: 'Annual contract renewal',
      energyType: 'Electric'
    },
    {
      id: 'host-stand',
      name: 'Host Stand',
      category: 'Furniture',
      icon: Armchair,
      essential: true,
      estimatedCost: 800,
      description: 'Reception desk for host station',
      specifications: '36" height, storage drawers',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning',
      energyType: 'N/A',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 750, rating: 4.3 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 780, rating: 4.1 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'N/A',
      certifications: ['Commercial Grade']
    },
    {
      id: 'wait-station',
      name: 'Wait Station',
      category: 'Furniture',
      icon: Armchair,
      essential: true,
      estimatedCost: 1200,
      description: 'Service station for waitstaff',
      specifications: 'Storage, beverage station, POS terminal',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 1100, rating: 4.4 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 1150, rating: 4.2 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'N/A',
      certifications: ['Commercial Grade']
    },
    {
      id: 'beverage-station',
      name: 'Beverage Station',
      category: 'Furniture',
      icon: Coffee,
      essential: true,
      estimatedCost: 1500,
      description: 'Self-service beverage station',
      specifications: 'Coffee, tea, water, ice',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning and refilling',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 1400, rating: 4.3 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 1450, rating: 4.1 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF']
    },
    {
      id: 'display-case',
      name: 'Display Case',
      category: 'Furniture',
      icon: Armchair,
      essential: false,
      estimatedCost: 2000,
      description: 'Refrigerated display case for desserts',
      specifications: 'Glass front, LED lighting',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 1800, rating: 4.4 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 1900, rating: 4.2 }
      ],
      leadTime: '2-3 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'Energy Star']
    },
    {
      id: 'bread-warming-station',
      name: 'Bread Warming Station',
      category: 'Furniture',
      icon: ChefHat,
      essential: false,
      estimatedCost: 600,
      description: 'Heated display for bread and pastries',
      specifications: 'Temperature controlled, glass front',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 550, rating: 4.3 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 580, rating: 4.1 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'Medium',
      certifications: ['NSF']
    },
    {
      id: 'condiment-station',
      name: 'Condiment Station',
      category: 'Furniture',
      icon: Armchair,
      essential: true,
      estimatedCost: 400,
      description: 'Self-service condiment station',
      specifications: 'Multiple dispensers, easy refill',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning and refilling',
      energyType: 'N/A',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 350, rating: 4.4 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 380, rating: 4.2 }
      ],
      leadTime: '1 week',
      warranty: '1 year',
      energyEfficiency: 'N/A',
      certifications: ['NSF']
    },
    {
      id: 'utensil-station',
      name: 'Utensil Station',
      category: 'Furniture',
      icon: Armchair,
      essential: true,
      estimatedCost: 300,
      description: 'Self-service utensil and napkin station',
      specifications: 'Multiple compartments, easy access',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning and restocking',
      energyType: 'N/A',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 280, rating: 4.3 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 290, rating: 4.1 }
      ],
      leadTime: '1 week',
      warranty: '1 year',
      energyEfficiency: 'N/A',
      certifications: ['Commercial Grade']
    },
    {
      id: 'trash-station',
      name: 'Trash Station',
      category: 'Furniture',
      icon: Armchair,
      essential: true,
      estimatedCost: 500,
      description: 'Waste management station',
      specifications: 'Recycling and trash separation',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning and emptying',
      energyType: 'N/A',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 450, rating: 4.2 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 480, rating: 4.0 }
      ],
      leadTime: '1 week',
      warranty: '1 year',
      energyEfficiency: 'N/A',
      certifications: ['Commercial Grade']
    }
  ], []);

  // Bar Equipment
  const barEquipment = useMemo(() => [
    {
      id: 'commercial-ice-machine',
      name: 'Commercial Ice Machine',
      category: 'Bar Equipment',
      icon: Coffee,
      essential: true,
      estimatedCost: 4500,
      description: 'Undercounter ice machine for bar service',
      specifications: '500 lbs ice production per day',
      vendors: ['Boston Showcase Company', 'Supplies on the Fly'],
      maintenance: 'Monthly cleaning and sanitizing',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 4200, rating: 4.4 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 4400, rating: 4.2 }
      ],
      leadTime: '2-3 weeks',
      warranty: '2 years',
      energyEfficiency: 'High',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'beer-draft-system',
      name: 'Beer Draft System',
      category: 'Bar Equipment',
      icon: Coffee,
      essential: true,
      estimatedCost: 3200,
      description: 'Complete draft beer system with taps',
      specifications: '4-tap system with CO2 regulator',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Weekly line cleaning',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 3000, rating: 4.5 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 3100, rating: 4.3 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'Medium',
      certifications: ['NSF']
    },
    {
      id: 'wine-refrigerator',
      name: 'Wine Refrigerator',
      category: 'Bar Equipment',
      icon: Coffee,
      essential: false,
      estimatedCost: 1800,
      description: 'Dual-zone wine refrigerator',
      specifications: '50 bottle capacity, dual temperature zones',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Monthly cleaning',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 1700, rating: 4.3 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 1750, rating: 4.1 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF', 'Energy Star']
    },
    {
      id: 'cocktail-shaker-set',
      name: 'Professional Cocktail Shaker Set',
      category: 'Bar Equipment',
      icon: Coffee,
      essential: true,
      estimatedCost: 150,
      description: 'Complete cocktail making set',
      specifications: 'Boston shakers, strainers, jiggers, muddlers',
      vendors: ['Supplies on the Fly'],
      maintenance: 'Daily sanitizing',
      energyType: 'Manual',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 140, rating: 4.6 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 145, rating: 4.4 }
      ],
      leadTime: '3-5 days',
      warranty: '6 months',
      energyEfficiency: 'N/A',
      certifications: ['NSF']
    },
    {
      id: 'blender-commercial',
      name: 'Commercial Blender',
      category: 'Bar Equipment',
      icon: Coffee,
      essential: true,
      estimatedCost: 800,
      description: 'High-speed commercial blender for smoothies and cocktails',
      specifications: '64 oz capacity, 2 HP motor',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Weekly deep cleaning',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 750, rating: 4.5 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 780, rating: 4.3 }
      ],
      leadTime: '1 week',
      warranty: '1 year',
      energyEfficiency: 'Medium',
      certifications: ['NSF', 'UL Listed']
    },
    {
      id: 'juice-extractor',
      name: 'Commercial Juice Extractor',
      category: 'Bar Equipment',
      icon: Coffee,
      essential: false,
      estimatedCost: 1200,
      description: 'Cold-press juice extractor',
      specifications: 'High yield, minimal oxidation',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily cleaning',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 1150, rating: 4.2 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 1180, rating: 4.0 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'High',
      certifications: ['NSF']
    },
    {
      id: 'soda-dispenser',
      name: 'Post-Mix Soda Dispenser',
      category: 'Bar Equipment',
      icon: Coffee,
      essential: true,
      estimatedCost: 2500,
      description: 'Multi-flavor soda dispensing system',
      specifications: '8-flavor system with ice',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Weekly line cleaning',
      energyType: 'Electric',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 2300, rating: 4.4 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 2400, rating: 4.2 }
      ],
      leadTime: '1-2 weeks',
      warranty: '1 year',
      energyEfficiency: 'Medium',
      certifications: ['NSF']
    },
    {
      id: 'bar-sink',
      name: 'Three-Compartment Bar Sink',
      category: 'Bar Equipment',
      icon: Coffee,
      essential: true,
      estimatedCost: 600,
      description: 'Stainless steel bar sink with faucet',
      specifications: '24" x 20" x 8" deep',
      vendors: ['Boston Showcase Company'],
      maintenance: 'Daily sanitizing',
      energyType: 'Plumbing',
      onlineSources: [
        { name: 'WebstaurantStore', url: 'https://www.webstaurantstore.com', price: 550, rating: 4.5 },
        { name: 'KaTom Restaurant Supply', url: 'https://www.katom.com', price: 580, rating: 4.3 }
      ],
      leadTime: '1 week',
      warranty: '1 year',
      energyEfficiency: 'N/A',
      certifications: ['NSF']
    }
  ], []);

  // Small Equipment & Supplies
  const smallEquipment = useMemo(() => [
    { id: 'knives', name: 'Professional Knife Set', cost: 500, essential: true },
    { id: 'cutting-boards', name: 'Commercial Cutting Boards', cost: 200, essential: true },
    { id: 'pots-pans', name: 'Commercial Cookware Set', cost: 800, essential: true },
    { id: 'serving-plates', name: 'Dinnerware Set (100 place settings)', cost: 600, essential: true },
    { id: 'glassware', name: 'Glassware Set', cost: 400, essential: true },
    { id: 'utensils', name: 'Flatware Set', cost: 300, essential: true },
    { id: 'cleaning-supplies', name: 'Initial Cleaning Supplies', cost: 350, essential: true },
    { id: 'uniforms', name: 'Staff Uniforms (Initial Set)', cost: 800, essential: true },
    { id: 'first-aid', name: 'First Aid Station', cost: 150, essential: true },
    { id: 'office-supplies', name: 'Office Supplies', cost: 200, essential: false }
  ], []);

  // Opening Day Checklist
  const openingChecklist = [
    { category: 'Kitchen Setup', items: [
      'All cooking equipment tested and calibrated',
      'Refrigeration units at proper temperatures',
      'Fire suppression system tested',
      'Ventilation system operational',
      'All small wares organized and accessible',
      'Initial food inventory stocked',
      'Cleaning supplies fully stocked'
    ]},
    { category: 'Front of House Setup', items: [
      'POS system configured and tested',
      'All furniture arranged per floor plan',
      'Sound system tested',
      'Security system armed and tested',
      'Internet and phone systems operational',
      'Emergency lighting tested',
      'All signage installed and lit'
    ]},
    { category: 'Safety & Compliance', items: [
      'Fire extinguishers checked and accessible',
      'First aid kit stocked and accessible',
      'Safety data sheets organized',
      'Emergency procedures posted',
      'Maximum occupancy signs posted',
      'Handwashing stations stocked',
      'All permits and licenses displayed'
    ]},
    { category: 'Staff Preparation', items: [
      'All equipment operation training completed',
      'POS system training completed',
      'Safety procedures training completed',
      'Menu and preparation training completed',
      'Service standards training completed',
      'Emergency procedures reviewed',
      'Uniforms distributed and fitted'
    ]}
  ];

  // Filter and sort equipment
  const filteredEquipment = useMemo(() => {
    let filtered = [...kitchenEquipment, ...frontOfHouseEquipment, ...barEquipment];
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    filtered = filtered.filter(item => 
      item.estimatedCost >= priceRange.min && item.estimatedCost <= priceRange.max
    );
    
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'price':
          aValue = a.estimatedCost;
          bValue = b.estimatedCost;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }, [searchTerm, priceRange, sortBy, sortOrder, kitchenEquipment, frontOfHouseEquipment, barEquipment]);

  // Bid Sheet Management
  const addToBidSheet = (equipment) => {
    if (!bidSheet.find(item => item.id === equipment.id)) {
      setBidSheet([...bidSheet, { ...equipment, quantity: 1, notes: '' }]);
    }
  };

  const removeFromBidSheet = (equipmentId) => {
    setBidSheet(bidSheet.filter(item => item.id !== equipmentId));
  };

  const updateBidSheetItem = (equipmentId, field, value) => {
    setBidSheet(bidSheet.map(item => 
      item.id === equipmentId ? { ...item, [field]: value } : item
    ));
  };

  const generateBidSheet = () => {
    const csvContent = [
      ['Equipment Name', 'Category', 'Estimated Cost', 'Quantity', 'Total Cost', 'Vendors', 'Notes'],
      ...bidSheet.map(item => [
        item.name,
        item.category,
        `$${item.estimatedCost}`,
        item.quantity,
        `$${item.estimatedCost * item.quantity}`,
        item.vendors?.join(', ') || 'Various',
        item.notes
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'restaurant-equipment-bid-sheet.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generatePDFBidSheet = () => {
    // This would integrate with a PDF library like jsPDF
    // console.log('Generating PDF bid sheet...');
    // Implementation would go here
  };

  // Custom Equipment Management
  const addCustomEquipment = (equipment) => {
    const newEquipment = {
      ...equipment,
      id: `custom-${Date.now()}`,
      isCustom: true
    };
    setCustomEquipment([...customEquipment, newEquipment]);
    setShowAddEquipment(false);
    setEditingEquipment(null);
  };

  const editCustomEquipment = (equipment) => {
    setEditingEquipment(equipment);
    setShowAddEquipment(true);
  };

  const deleteCustomEquipment = (equipmentId) => {
    setCustomEquipment(customEquipment.filter(item => item.id !== equipmentId));
  };

  // Quick Add Functions
  const applyTemplate = (template) => {
    const templateEquipment = template.equipment.map(equipmentId => {
      const equipment = allEquipment.find(e => e.id === equipmentId);
      return equipment ? { ...equipment, quantity: 1, notes: '' } : null;
    }).filter(Boolean);
    
    setBidSheet([...bidSheet, ...templateEquipment]);
    setBudget(prev => ({ ...prev, total: template.budget }));
    setSelectedTemplate(template);
  };

  const quickAddEquipment = (categoryItems) => {
    const newEquipment = categoryItems.map(item => ({
      id: `quick-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: item.name,
      category: 'Custom',
      estimatedCost: item.cost,
      essential: item.essential,
      description: `Quick added: ${item.name}`,
      isCustom: true,
      quantity: 1,
      notes: ''
    }));
    
    setCustomEquipment([...customEquipment, ...newEquipment]);
    setBidSheet([...bidSheet, ...newEquipment]);
  };

  const updateBudget = (newBudget) => {
    setBudget(newBudget);
  };

  const calculateBudgetStatus = () => {
    const totalSpent = bidSheet.reduce((sum, item) => sum + (item.estimatedCost * item.quantity), 0);
    const remaining = budget.total - totalSpent;
    const percentage = (totalSpent / budget.total) * 100;
    
    return {
      spent: totalSpent,
      remaining,
      percentage: Math.min(percentage, 100),
      isOverBudget: remaining < 0
    };
  };

  // URL Import Functions
  const parseEquipmentUrl = async (url) => {
    setIsImporting(true);
    try {
      // Simulate API call to extract product data
      // In a real implementation, you'd use a web scraping service or API
      const mockData = await simulateUrlParsing(url);
      setImportedEquipment(mockData);
    } catch (error) {
      console.error('Error parsing URL:', error);
      alert('Error parsing URL. Please try again or add manually.');
    } finally {
      setIsImporting(false);
    }
  };

  const simulateUrlParsing = async (url) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock data based on URL patterns
    if (url.includes('amazon.com')) {
      return {
        name: 'Commercial Gas Range 6-Burner',
        category: 'Cooking',
        estimatedCost: 3299,
        description: 'Professional 6-burner commercial gas range with oven. Perfect for high-volume cooking.',
        specifications: '36" wide, 180,000 BTU total, Stainless steel construction, 2 ovens',
        vendor: 'Amazon',
        vendorUrl: url,
        imageUrl: 'https://via.placeholder.com/300x200?text=Commercial+Range',
        brand: 'Vulcan',
        model: 'V36G',
        dimensions: '36" W x 30" D x 36" H',
        energyType: 'Gas',
        warranty: '1 year',
        leadTime: '1-2 weeks',
        rating: 4.5,
        reviews: 127
      };
    } else if (url.includes('webstaurantstore.com')) {
      return {
        name: 'Commercial Refrigerator 2-Door',
        category: 'Refrigeration',
        estimatedCost: 2899,
        description: 'Energy-efficient commercial refrigerator with digital temperature control.',
        specifications: '72" H x 30" W x 30" D, 15.5 cu ft capacity, Digital thermostat',
        vendor: 'WebstaurantStore',
        vendorUrl: url,
        imageUrl: 'https://via.placeholder.com/300x200?text=Commercial+Refrigerator',
        brand: 'True',
        model: 'T-72F',
        dimensions: '72" H x 30" W x 30" D',
        energyType: 'Electric',
        warranty: '2 years',
        leadTime: '3-5 business days',
        rating: 4.7,
        reviews: 89
      };
    } else if (url.includes('restaurantsupply.com')) {
      return {
        name: 'Commercial Dishwasher Undercounter',
        category: 'Cleaning',
        estimatedCost: 1899,
        description: 'High-temperature undercounter commercial dishwasher with sanitizing cycle.',
        specifications: '18" rack capacity, 180°F sanitizing, 1.5 HP motor',
        vendor: 'Restaurant Supply',
        vendorUrl: url,
        imageUrl: 'https://via.placeholder.com/300x200?text=Commercial+Dishwasher',
        brand: 'Hobart',
        model: 'AM-14',
        dimensions: '18" W x 24" D x 34" H',
        energyType: 'Electric',
        warranty: '1 year',
        leadTime: '1-2 weeks',
        rating: 4.3,
        reviews: 45
      };
    } else {
      // Generic parsing for other sites
      return {
        name: 'Imported Equipment',
        category: 'Custom',
        estimatedCost: 0,
        description: 'Equipment imported from external source. Please review and update details.',
        specifications: 'Please add specifications',
        vendor: 'External Source',
        vendorUrl: url,
        imageUrl: 'https://via.placeholder.com/300x200?text=Equipment',
        brand: 'Unknown',
        model: 'Unknown',
        dimensions: 'Unknown',
        energyType: 'Unknown',
        warranty: 'Unknown',
        leadTime: 'Unknown',
        rating: 0,
        reviews: 0
      };
    }
  };

  const addImportedEquipment = () => {
    if (importedEquipment) {
      const newEquipment = {
        ...importedEquipment,
        id: `imported-${Date.now()}`,
        isCustom: true,
        quantity: 1,
        notes: `Imported from ${importedEquipment.vendor}`,
        createdAt: new Date().toISOString()
      };
      
      setCustomEquipment([...customEquipment, newEquipment]);
      setBidSheet([...bidSheet, newEquipment]);
      setShowUrlImport(false);
      setImportUrl('');
      setImportedEquipment(null);
    }
  };

  // Business Card Processing Functions
  const handleVendorCardUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVendorCardImage(file);
      processBusinessCard(file);
    }
  };

  const processBusinessCard = async (file) => {
    setIsProcessingCard(true);
    try {
      // Simulate OCR processing
      const extractedData = await simulateOCRProcessing(file);
      setExtractedVendorData(extractedData);
    } catch (error) {
      console.error('Error processing business card:', error);
      alert('Error processing business card. Please try again.');
    } finally {
      setIsProcessingCard(false);
    }
  };

  const simulateOCRProcessing = async (file) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock OCR results - in a real implementation, you'd use a service like Google Vision API
    const mockVendorData = {
      name: 'Boston Restaurant Supply Co.',
      contact: {
        person: 'John Smith',
        title: 'Sales Manager',
        phone: '(617) 555-0123',
        email: 'john@bostonrestaurantsupply.com',
        website: 'www.bostonrestaurantsupply.com'
      },
      address: {
        street: '123 Commercial Street',
        city: 'Boston',
        state: 'MA',
        zip: '02109'
      },
      specialties: ['Kitchen Equipment', 'Refrigeration', 'Installation'],
      notes: 'Family-owned business since 1985',
      rating: 4.6,
      leadTime: '1-2 weeks',
      paymentTerms: 'Net 30',
      warranty: '1-3 years',
      services: ['Installation', 'Training', 'Maintenance', 'Repair']
    };
    
    return mockVendorData;
  };

  const addExtractedVendor = () => {
    if (extractedVendorData) {
      const newVendor = {
        ...extractedVendorData,
        id: `vendor-${Date.now()}`,
        type: 'Equipment Specialist',
        createdAt: new Date().toISOString(),
        isFromCard: true
      };
      
      setVendors([...vendors, newVendor]);
      setShowVendorCardImport(false);
      setVendorCardImage(null);
      setExtractedVendorData(null);
    }
  };

  // Online Sourcing Integration
  const searchOnlineSources = (equipmentName) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(equipmentName + ' commercial restaurant equipment')}`;
    window.open(searchUrl, '_blank');
  };

  const comparePrices = (equipment) => {
    if (equipment.onlineSources && equipment.onlineSources.length > 0) {
      return (
        <div className="mt-2 p-2 bg-blue-50 rounded">
          <h5 className="font-medium text-blue-900 mb-2">Online Price Comparison:</h5>
          {equipment.onlineSources.map((source, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center"
              >
                {source.name} <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <span className="font-medium">${source.price}</span>
              <span className="text-gray-500">⭐ {source.rating}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Enhanced Equipment Card
  const renderEquipmentCard = (equipment) => (
    <div 
      key={equipment.id}
      className={`border rounded-xl p-5 cursor-pointer transition-all shadow-sm hover:shadow-md ${
        selectedItems.has(equipment.id) 
          ? 'border-blue-500 bg-blue-50 shadow-blue-100' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <div className="p-2 bg-gray-100 rounded-lg">
            <equipment.icon className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-gray-900 text-lg">{equipment.name}</h4>
              {equipment.essential && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Essential
                </span>
              )}
              {equipment.isCustom && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Custom
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{equipment.description}</p>
            {equipment.specifications && (
              <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded border-l-2 border-gray-200">
                {equipment.specifications}
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600 mb-1">
            ${equipment.estimatedCost?.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {equipment.energyType}
          </div>
        </div>
      </div>
            
      {/* Enhanced Equipment Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {equipment.vendors && equipment.vendors.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-blue-800 mb-1">Vendors</p>
            <p className="text-xs text-blue-700">{equipment.vendors.join(', ')}</p>
          </div>
        )}
        {equipment.leadTime && (
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-orange-800 mb-1">Lead Time</p>
            <p className="text-xs text-orange-700">{equipment.leadTime}</p>
          </div>
        )}
        {equipment.warranty && (
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-green-800 mb-1">Warranty</p>
            <p className="text-xs text-green-700">{equipment.warranty}</p>
          </div>
        )}
        {equipment.maintenance && (
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-yellow-800 mb-1">Maintenance</p>
            <p className="text-xs text-yellow-700">{equipment.maintenance}</p>
          </div>
        )}
      </div>

      {/* Online Price Comparison */}
      {comparePrices(equipment)}

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 mt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSelection(equipment.id);
          }}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            selectedItems.has(equipment.id)
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {selectedItems.has(equipment.id) ? 'Selected' : 'Select'}
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToBidSheet(equipment);
          }}
          className="px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
        >
          Add to Bid Sheet
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            searchOnlineSources(equipment.name);
          }}
          className="px-3 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors flex items-center"
        >
          <Globe className="h-3 w-3 mr-1" />
          Search Online
        </button>

        {equipment.isCustom && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                editCustomEquipment(equipment);
              }}
              className="px-3 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteCustomEquipment(equipment.id);
              }}
              className="px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {/* Selection Indicator */}
      <div className="mt-4 flex justify-end">
        {selectedItems.has(equipment.id) ? (
          <CheckCircle className="h-6 w-6 text-blue-600" />
        ) : (
          <div className="h-6 w-6 border-2 border-gray-300 rounded-full" />
        )}
      </div>
    </div>
  );

  // Bid Sheet Component
  const renderBidSheet = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Equipment Bid Sheet</h3>
        <div className="flex space-x-2">
          <button
            onClick={generateBidSheet}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={generatePDFBidSheet}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {bidSheet.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No equipment added to bid sheet yet.</p>
          <p className="text-sm">Select equipment and click "Add to Bid Sheet" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bidSheet.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <label className="text-xs text-gray-500">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateBidSheetItem(item.id, 'quantity', parseInt(e.target.value))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                    />
                  </div>
                  <div className="text-center">
                    <label className="text-xs text-gray-500">Unit Cost</label>
                    <div className="font-medium">${item.estimatedCost}</div>
                  </div>
                  <div className="text-center">
                    <label className="text-xs text-gray-500">Total</label>
                    <div className="font-bold text-green-600">
                      ${item.estimatedCost * item.quantity}
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Notes..."
                    value={item.notes}
                    onChange={(e) => updateBidSheetItem(item.id, 'notes', e.target.value)}
                    className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={() => removeFromBidSheet(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="border-t pt-4">
            <div className="text-xl font-bold text-gray-900">
              Total Bid Sheet Value: ${bidSheet.reduce((sum, item) => sum + (item.estimatedCost * item.quantity), 0)}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Vendor Directory Component
  const renderVendorDirectory = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Vendor Directory</h3>
        <button
          onClick={() => setShowPdfImport(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <FileUp className="h-4 w-4" />
          <span>Import from PDF</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendors.map((vendor) => (
          <div key={vendor.id || vendor.name} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{vendor.name}</h4>
                <p className="text-sm text-gray-600">{vendor.description}</p>
                <div className="mt-2 space-y-1">
                  {vendor.specialties && (
                    <p className="text-xs text-gray-500">
                      <strong>Specialties:</strong> {vendor.specialties.join(', ')}
                    </p>
                  )}
                  {vendor.rating && (
                    <p className="text-xs text-gray-500">
                      <strong>Rating:</strong> ⭐ {vendor.rating}
                    </p>
                  )}
                  {vendor.contact && (
                    <div className="text-xs text-gray-500 space-y-1">
                      <p><strong>Phone:</strong> {vendor.contact.phone}</p>
                      <p><strong>Email:</strong> {vendor.contact.email}</p>
                      <p><strong>Address:</strong> {vendor.contact.address}</p>
                    </div>
                  )}
                  {vendor.leadTime && (
                    <p className="text-xs text-gray-500">
                      <strong>Lead Time:</strong> {vendor.leadTime}
                    </p>
                  )}
                  {vendor.paymentTerms && (
                    <p className="text-xs text-gray-500">
                      <strong>Payment Terms:</strong> {vendor.paymentTerms}
                    </p>
                  )}
                </div>
              </div>
              <div className="ml-4">
                {vendor.url ? (
                  <a
                    href={vendor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit Site
                  </a>
                ) : (
                  <div className="text-sm text-gray-500">Local Vendor</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // PDF Import Functions
  const processPdfFile = async (file) => {
    // Simulate PDF processing - in a real implementation, you would use a PDF parsing library
    // like pdf-parse or pdf2pic to extract text from the PDF
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock extracted vendor data - replace with actual PDF parsing
        const mockVendors = [
          {
            id: 'imported-1',
            name: 'ABC Restaurant Supply',
            type: 'Full Service',
            specialties: ['Kitchen Equipment', 'Installation'],
            contact: {
              phone: '(555) 123-4567',
              email: 'sales@abcrestaurant.com',
              address: '123 Main St, Boston, MA 02101'
            },
            rating: 4.5,
            leadTime: '1-2 weeks',
            paymentTerms: 'Net 30',
            warranty: '1 year',
            services: ['Installation', 'Training', 'Maintenance']
          },
          {
            id: 'imported-2',
            name: 'Metro Food Service',
            type: 'Equipment Specialist',
            specialties: ['Refrigeration', 'Cooking Equipment'],
            contact: {
              phone: '(555) 987-6543',
              email: 'info@metrofoodservice.com',
              address: '456 Commercial Ave, Boston, MA 02102'
            },
            rating: 4.3,
            leadTime: '2-3 weeks',
            paymentTerms: 'Net 15',
            warranty: '2 years',
            services: ['Installation', 'Repair', 'Parts']
          },
          {
            id: 'imported-3',
            name: 'Boston Bar & Beverage',
            type: 'Beverage Specialist',
            specialties: ['Bar Equipment', 'Beverage Systems'],
            contact: {
              phone: '(555) 456-7890',
              email: 'orders@bostonbar.com',
              address: '789 Bar St, Boston, MA 02103'
            },
            rating: 4.7,
            leadTime: '1 week',
            paymentTerms: 'Net 30',
            warranty: '1 year',
            services: ['Installation', 'Training', 'Maintenance']
          }
        ];
        resolve(mockVendors);
      }, 2000); // Simulate processing time
    });
  };



  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file.');
      return;
    }

    setIsProcessingPdf(true);
    try {
      const extractedVendors = await processPdfFile(file);
      setImportedVendors(extractedVendors);
    } catch (error) {
      // console.error('Error processing PDF:', error);
      alert('Error processing PDF file. Please try again.');
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const addImportedVendor = (vendor) => {
    setVendors(prev => [...prev, vendor]);
    setImportedVendors(prev => prev.filter(v => v.id !== vendor.id));
  };

  const addAllImportedVendors = () => {
    setVendors(prev => [...prev, ...importedVendors]);
    setImportedVendors([]);
  };

  // Online Equipment Sources
  const onlineSources = useMemo(() => [
    {
      name: 'WebstaurantStore',
      url: 'https://www.webstaurantstore.com',
      description: 'Largest online restaurant supply store',
      specialties: ['Kitchen Equipment', 'Small Wares', 'Furniture'],
      rating: 4.6,
      shipping: 'Free shipping on orders over $199',
      returnPolicy: '30-day returns'
    },
    {
      name: 'KaTom Restaurant Supply',
      url: 'https://www.katom.com',
      description: 'Professional restaurant equipment supplier',
      specialties: ['Commercial Kitchen', 'Food Service', 'Beverage'],
      rating: 4.4,
      shipping: 'Free shipping on orders over $299',
      returnPolicy: '45-day returns'
    },
    {
      name: 'Restaurant Equipment World',
      url: 'https://www.restaurantequipmentworld.com',
      description: 'Specialized restaurant equipment',
      specialties: ['Custom Equipment', 'Installation', 'Service'],
      rating: 4.3,
      shipping: 'Variable shipping costs',
      returnPolicy: '15-day returns'
    },
    {
      name: 'Amazon Business',
      url: 'https://business.amazon.com',
      description: 'Business-focused marketplace',
      specialties: ['General Equipment', 'Office Supplies', 'Technology'],
      rating: 4.2,
      shipping: 'Prime shipping available',
      returnPolicy: '30-day returns'
    }
  ], []);

  // Vendor Management
  const localVendors = useMemo(() => [
    {
      id: 'boston-showcase',
      name: 'Boston Showcase Company',
      type: 'Full Service',
      specialties: ['Kitchen Equipment', 'Installation', 'Service'],
      contact: {
        phone: '(617) 555-0123',
        email: 'sales@bostonshowcase.com',
        address: '123 Commercial St, Boston, MA 02109'
      },
      rating: 4.7,
      leadTime: '1-3 weeks',
      paymentTerms: 'Net 30',
      warranty: '1-3 years',
      services: ['Installation', 'Training', 'Maintenance', 'Repair']
    },
    {
      id: 'supplies-fly',
      name: 'Supplies on the Fly',
      type: 'Supply Store',
      specialties: ['Small Wares', 'Consumables', 'Quick Delivery'],
      contact: {
        phone: '(617) 555-0456',
        email: 'orders@suppliesfly.com',
        address: '456 Market St, Boston, MA 02110'
      },
      rating: 4.5,
      leadTime: 'Same day - 1 week',
      paymentTerms: 'Net 15',
      warranty: '30 days',
      services: ['Delivery', 'Returns', 'Product Support']
    }
  ], []);

  useEffect(() => {
    setVendors([...localVendors, ...onlineSources]);
  }, [localVendors, onlineSources]);

  // Calculate costs including custom equipment
  const allEquipment = useMemo(() => [...kitchenEquipment, ...frontOfHouseEquipment, ...barEquipment, ...customEquipment], [kitchenEquipment, frontOfHouseEquipment, barEquipment, customEquipment]);
  
  const calculations = useMemo(() => {
    const selectedEquipment = allEquipment.filter(item => selectedItems.has(item.id));
    const essentialEquipment = allEquipment.filter(item => item.essential);
    const smallEquipmentCost = smallEquipment
      .filter(item => item.essential)
      .reduce((sum, item) => sum + item.cost, 0);
    const bidSheetTotal = bidSheet.reduce((sum, item) => sum + (item.estimatedCost * item.quantity), 0);
    const budgetStatus = calculateBudgetStatus();

    return {
      selectedTotal: selectedEquipment.reduce((sum, item) => sum + item.estimatedCost, 0),
      essentialTotal: essentialEquipment.reduce((sum, item) => sum + item.estimatedCost, 0),
      smallEquipmentTotal: smallEquipmentCost,
      grandTotal: essentialEquipment.reduce((sum, item) => sum + item.estimatedCost, 0) + smallEquipmentCost,
      bidSheetTotal,
      budgetStatus
    };
  }, [selectedItems, allEquipment, smallEquipment, bidSheet, budget]);

  const categories = [
    { id: 'kitchen', name: 'Kitchen Equipment', icon: ChefHat, equipment: kitchenEquipment },
    { id: 'front-house', name: 'Front of House', icon: Armchair, equipment: frontOfHouseEquipment },
    { id: 'bar', name: 'Bar Equipment', icon: Coffee, equipment: barEquipment },
    { id: 'plate-styles', name: 'Plate Styles', icon: Utensils, equipment: plateStyles },
    { id: 'small-equipment', name: 'Small Equipment', icon: Package, equipment: smallEquipment },
    { id: 'custom', name: 'Custom Equipment', icon: Plus, equipment: customEquipment },
    { id: 'bid-sheet', name: 'Bid Sheet', icon: FileText, equipment: [] },
    { id: 'vendors', name: 'Vendor Directory', icon: ShoppingCart, equipment: [] },
    { id: 'checklist', name: 'Opening Checklist', icon: CheckCircle, equipment: [] }
  ];

  // Missing functions
  const toggleSelection = (itemId) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };

  const selectAllEssential = () => {
    const essentialIds = allEquipment.filter(item => item.essential).map(item => item.id);
    setSelectedItems(new Set(essentialIds));
  };

  const renderSmallEquipment = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {smallEquipment.map(item => (
        <div key={item.id} className="border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{item.name}</h4>
              <span className="text-sm font-semibold text-green-600">
                ${item.cost}
              </span>
            </div>
            {item.essential && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Essential
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderChecklist = () => (
    <div className="space-y-6">
      {openingChecklist.map((section, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            {section.category}
          </h4>
          <div className="space-y-2">
            {section.items.map((item, itemIndex) => (
              <label key={itemIndex} className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header with Enhanced Stats */}
      <SectionCard 
        title="Restaurant Equipment Planning" 
        description="Comprehensive equipment planning with online sourcing, bid sheet creation, and vendor management"
        color="purple"
      >
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setShowQuickAdd(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Quick Add Equipment
          </button>
          <button
            onClick={() => setShowUrlImport(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Import from URL
          </button>
          <button
            onClick={() => setShowBudgetTracker(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <Package className="h-4 w-4 mr-2" />
            Budget Tracker
          </button>
          <button
            onClick={() => setShowVendorCardImport(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <FileUp className="h-4 w-4 mr-2" />
            Add Vendor from Card
          </button>
          <button
            onClick={() => setShowAddEquipment(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Equipment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-purple-100 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Essential Equipment</h4>
            <div className="text-2xl font-bold text-purple-700">
              ${calculations.essentialTotal.toLocaleString()}
            </div>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Bid Sheet Total</h4>
            <div className="text-2xl font-bold text-blue-700">
              ${calculations.bidSheetTotal.toLocaleString()}
            </div>
          </div>
          <div className={`p-4 rounded-lg ${calculations.budgetStatus?.isOverBudget ? 'bg-red-100' : 'bg-green-100'}`}>
            <h4 className={`font-semibold mb-2 ${calculations.budgetStatus?.isOverBudget ? 'text-red-800' : 'text-green-800'}`}>
              Budget Status
            </h4>
            <div className={`text-2xl font-bold ${calculations.budgetStatus?.isOverBudget ? 'text-red-700' : 'text-green-700'}`}>
              {calculations.budgetStatus?.percentage.toFixed(1)}%
            </div>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Small Equipment</h4>
            <div className="text-2xl font-bold text-blue-700">
              ${calculations.smallEquipmentTotal}
            </div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Total Investment</h4>
            <div className="text-2xl font-bold text-green-700">
              ${calculations.grandTotal}
            </div>
          </div>
          <div className="bg-orange-100 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2">Selected Items</h4>
            <div className="text-2xl font-bold text-orange-700">
              {selectedItems.size}
            </div>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Bid Sheet Value</h4>
            <div className="text-2xl font-bold text-red-700">
              ${calculations.bidSheetTotal}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={selectAllEssential}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Select All Essential
          </button>
          <button
            onClick={() => setSelectedItems(new Set())}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Clear Selection
          </button>
          <button
            onClick={() => setShowAddEquipment(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Equipment
          </button>
        </div>
      </SectionCard>

      {/* Search and Filter Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Price Range:</label>
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 10000 })}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="category">Category</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <category.icon className="h-5 w-5" />
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {activeCategory === 'kitchen' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kitchen Equipment (Back of House)</h3>
            {filteredEquipment.filter(item => item.category === 'Cooking' || item.category === 'Refrigeration' || item.category === 'Prep' || item.category === 'Cleaning' || item.category === 'Ventilation' || item.category === 'Beverage').map(renderEquipmentCard)}
          </div>
        )}

        {activeCategory === 'front-house' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Front of House Equipment</h3>
            {filteredEquipment.filter(item => item.category === 'Technology' || item.category === 'Furniture' || item.category === 'Audio/Visual' || item.category === 'Security').map(renderEquipmentCard)}
          </div>
        )}

        {activeCategory === 'plate-styles' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Plate Styles & Dinnerware</h3>
              <button
                onClick={() => setShowAddPlateStyle(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Plate Style</span>
              </button>
            </div>
            
            {plateStyles.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Plate Styles Added Yet</h3>
                <p className="text-gray-500 mb-4">Start building your dinnerware collection by adding plate styles.</p>
                <button
                  onClick={() => setShowAddPlateStyle(true)}
                  className="btn-primary"
                >
                  Add Your First Plate Style
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plateStyles.map((plateStyle) => (
                  <div key={plateStyle.id} className="modern-card p-6 hover-lift">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{plateStyle.name}</h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {plateStyle.category}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            {plateStyle.material}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setEditingPlateStyle(plateStyle)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setPlateStyles(plateStyles.filter(item => item.id !== plateStyle.id))}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {plateStyle.sampleImageUrl && (
                      <div className="mb-4">
                        <img
                          src={plateStyle.sampleImageUrl}
                          alt={plateStyle.name}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Size:</span>
                        <span className="text-sm font-medium text-gray-900">{plateStyle.size || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Color:</span>
                        <span className="text-sm font-medium text-gray-900">{plateStyle.color || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Pattern:</span>
                        <span className="text-sm font-medium text-gray-900">{plateStyle.pattern || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price per Piece:</span>
                        <span className="text-sm font-medium text-gray-900">${plateStyle.pricePerPiece?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <span className="text-sm font-medium text-gray-900">{plateStyle.quantity || 0}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span className="text-sm text-gray-600">Total Cost:</span>
                        <span className="text-sm text-green-600">
                          ${((plateStyle.pricePerPiece || 0) * (plateStyle.quantity || 0)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    {plateStyle.vendor && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{plateStyle.vendor}</p>
                            {plateStyle.vendorUrl && (
                              <a
                                href={plateStyle.vendorUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                              >
                                <span>View Vendor</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {plateStyle.description && (
                      <p className="text-sm text-gray-600 mb-2">{plateStyle.description}</p>
                    )}
                    
                    {plateStyle.notes && (
                      <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                        <p className="text-xs text-yellow-800">{plateStyle.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeCategory === 'small-equipment' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Small Equipment & Supplies</h3>
            {renderSmallEquipment()}
          </div>
        )}

        {activeCategory === 'custom' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Equipment</h3>
            {customEquipment.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No custom equipment added yet.</p>
                <p className="text-sm">Click "Add Custom Equipment" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {customEquipment.map(renderEquipmentCard)}
              </div>
            )}
          </div>
        )}

        {activeCategory === 'bid-sheet' && renderBidSheet()}

        {activeCategory === 'vendors' && renderVendorDirectory()}

        {activeCategory === 'checklist' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Opening Day Checklist</h3>
             {renderChecklist()}
           </div>
         )}


      </div>

      {/* Selected Items Summary */}
      {selectedItems.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Selected Equipment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allEquipment
              .filter(item => selectedItems.has(item.id))
              .map(item => (
                <div key={item.id} className="bg-white border border-blue-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <span className="text-sm font-semibold text-green-600">
                    ${item.estimatedCost}
                  </span>
                </div>
              ))
            }
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="text-xl font-bold text-blue-900">
              Total Selected: ${calculations.selectedTotal}
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Modal */}
      {showQuickAdd && renderQuickAddModal()}

      {/* URL Import Modal */}
      {showUrlImport && renderUrlImportModal()}

      {/* Business Card Import Modal */}
      {showVendorCardImport && renderVendorCardImportModal()}

      {/* Budget Tracker Modal */}
      {showBudgetTracker && renderBudgetTrackerModal()}

      {/* Add/Edit Equipment Modal */}
      {showAddEquipment && renderAddEquipmentModal()}

      {/* Plate Styles Modal */}
      {showAddPlateStyle && renderAddPlateStyleModal()}

      {/* PDF Import Modal */}
      {showPdfImport && renderPdfImportModal()}
    </div>
  );
};

export default EquipmentPlanning; 