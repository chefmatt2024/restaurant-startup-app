import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import FormField from '../ui/FormField';
import SectionCard from '../ui/SectionCard';

import { Plus, Phone, Mail, Globe, MapPin, Building, Search, Filter, XCircle, Star, CheckCircle, Award, Download, BarChart3, PieChart, Network, Truck, Warehouse, Store } from 'lucide-react';

const VendorManagement = () => {
  const { state, actions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'chart', 'supply-chain'

  // Complete Boston restaurant vendor directory (45+ real contacts)
  const initialVendors = [
    // Food Suppliers
    { id: 1, name: "Tedd Rama", company: "Baldor Foods", email: "bbweborders@baldorfoods.com", 
      category: "Food Supplier", description: "Major food distributor serving Boston restaurants", priority: "high" },
    { id: 2, name: "Todd Evens", company: "Sysco Foods", email: "Todd.Evans@sysco.com", phone: "00.669.4440 ext. 8317", 
      mobile: "617-780-9516", fax: "877.655.6443", website: "https://www.sysco.com/", category: "Food Supplier", 
      description: "Leading foodservice distributor with extensive Boston coverage", priority: "high" },
    { id: 3, name: "Joe Sosonoff", company: "Taza Chocolate", email: "jsosnoff@tazachocolate.com", phone: "617 937 9550", 
      website: "tazachcolate.com", category: "Food Supplier", description: "Local Boston chocolate manufacturer", priority: "medium" },
    { id: 4, name: "", company: "Atomic Coffee Roasters", category: "Beverage Supplier", 
      description: "Local coffee roaster for specialty coffee", priority: "medium" },
    { id: 5, name: "Danny Nathan", company: "Cold Craft Juicery", email: "dannynathan@gmail.com", phone: "978-590-3203", 
      category: "Beverage Supplier", description: "Fresh juice and smoothie supplier", priority: "low" },
    { id: 6, name: "Amie Raskin", company: "Intelligentsia Coffee Inc", email: "araskin@intelligentsiacoffee.com", 
      mobile: "917 355 0693", website: "www.intelligentsiacoffee.com", category: "Beverage Supplier", 
      address: "1850 W Fulton St, Chicago, IL 60612", description: "Premium specialty coffee roaster", priority: "medium" },
    { id: 7, name: "", company: "Pain D'avignon", category: "Food Supplier", 
      description: "Artisanal bread and bakery products", priority: "medium" },

    // Equipment & Supplies
    { id: 8, name: "Craig Newton", company: "Supplies on the Fly", email: "cnewton@suppliesonthefly.com", 
      phone: "781.422.2411", mobile: "617-823.0175", fax: "877.417.5311", website: "https://www.suppliesonthefly.com/", 
      category: "Restaurant Supplies", description: "Restaurant equipment and supplies with fast delivery", priority: "high" },
    { id: 9, name: "Jeff Sullivan", company: "Boston Showcase Company", email: "jeff@bostonshowcase.com", 
      phone: "617‐965‐1100", website: "https://www.bostonshowcase.com", category: "Equipment", 
      address: "66 Winchester St. PO Box 610254, Newton Highlands, MA 02461", 
      description: "Restaurant equipment and display cases - local Boston company", priority: "high" },
    { id: 10, name: "Russ", company: "Espresso Plus", email: "service@espressoplus.com", phone: "781-391-2400", 
      category: "Equipment", description: "Espresso machines and coffee equipment", priority: "medium" },
    { id: 11, name: "", company: "Webrestaurant", category: "Restaurant Supplies", 
      description: "Online restaurant supply store", priority: "medium" },
    { id: 12, name: "", company: "Amazon Business", category: "Restaurant Supplies", 
      description: "Business marketplace for supplies and equipment", priority: "low" },
    { id: 13, name: "", company: "Wayfair", category: "Restaurant Supplies", 
      description: "Furniture and decor for restaurant spaces", priority: "low" },
    { id: 14, name: "", company: "Alibaba", category: "Restaurant Supplies", 
      description: "International wholesale marketplace", priority: "low" },

    // Services - Cleaning & Maintenance
    { id: 15, name: "George Clark", company: "Ecolab", email: "george.clark@ecolab.com", phone: "603-417-8594", 
      category: "Cleaning & Sanitation", description: "Commercial cleaning and sanitation solutions", priority: "high" },
    { id: 16, name: "Greg Winn", company: "Metropolitan Linen", email: "gregw@metropolitanlinen.com", 
      phone: "617-839-7419", category: "Linen Service", description: "Commercial linen and uniform services", priority: "high" },
    { id: 17, name: "Danny Najanjo", company: "Waltham Pest Services", email: "DNaranjo@walthamservices.com", 
      phone: "617-620-1936", website: "www.WalthamServices.com", category: "Pest Control", 
      address: "9 Erie Dr, Natick, MA 01760", description: "Commercial pest control services", priority: "high" },
    { id: 18, name: "", company: "Johns Plumbing and Heating", category: "Maintenance", 
      description: "Plumbing and heating services", priority: "medium" },

    // Construction & Engineering
    { id: 19, name: "Ryan Pinkham", company: "Pink Projects", email: "ryan@pinkproj.com", phone: "781-264-2304", 
      website: "https://www.pinkproj.com/", category: "Construction", address: "251 heath St. #508, Jamaica Plain, MA 2130", 
      description: "Restaurant construction and renovation - Jamaica Plain based", priority: "high" },
    { id: 20, name: "Paul Mancini", company: "Trinity Construction", email: "pmancini@trinitybcm.com", 
      phone: "781.305.2733", mobile: "781.983.4477", website: "trinitybuildingusa.com", category: "Construction", 
      description: "Commercial construction and buildouts", priority: "high" },
    { id: 21, name: "Karen Troville", company: "CS Ventilation", email: "Karen@csventilation.com", 
      phone: "781-246-9300", website: "https://csventilation.com/", category: "HVAC", 
      address: "34 Broadway Street Wakefield, Ma, 01880", description: "Commercial kitchen ventilation systems", priority: "high" },
    { id: 22, name: "Donna Hagens", company: "BLW Engineers", email: "dhagens@blwengineers.com", phone: "(978) 486-4301 x10", 
      address: "311 Great Road P.O. Box 1551, Littleton, MA 01460", category: "Engineering", 
      description: "Engineering and design services", priority: "medium" },

    // Security & Technology
    { id: 23, name: "Molly Castor", company: "Frontpoint Security", email: "Molly.Castor@frontpointsecurity.com", 
      phone: "833-408-8428", website: "https://www.frontpointsecurity.com/", category: "Security", 
      description: "Commercial security systems and monitoring", priority: "medium" },
    { id: 24, name: "", company: "Crutchfield", email: "commercialaudio@crutchfield.com", phone: "276-325-6060", 
      website: "www.crutchfield.com", category: "Audio/Visual", description: "Commercial audio and visual systems", priority: "low" },
    { id: 25, name: "RockBot", company: "Rockbot, Inc.", email: "billing@rockbot.com", phone: "415-813-6020", 
      website: "www.rockbot.com", address: "1308 Broadway, Oakland, CA 94612", category: "Audio/Visual", 
      description: "Background music and entertainment systems", priority: "low" },

    // Telecommunications & Internet
    { id: 26, name: "Aaron Senn", company: "Verizon Wireless", email: "aaron.senn@verizonwireless.com", 
      category: "Telecommunications", description: "Business mobile and wireless services", priority: "medium" },
    { id: 27, name: "Angelique Sansoucie", company: "Comcast", email: "Angelique_Sansoucie@comcast.com", phone: "603-695-8450", 
      fax: "866-855-9798", website: "https://business.comcast.com/", category: "Telecommunications", 
      address: "676 Island Pond Road, Manchester, NH, 03109", description: "Business internet and phone services", priority: "medium" },

    // Utilities
    { id: 28, name: "", company: "National Grid", category: "Utilities", 
      description: "Electricity and gas utility provider", priority: "high" },
    { id: 29, name: "", company: "Eversource", category: "Utilities", 
      description: "Electricity utility provider", priority: "high" },

    // POS & Software
    { id: 30, name: "", company: "Toast POS", category: "Software/POS", 
      description: "Restaurant point-of-sale and management system", priority: "high" },
    { id: 31, name: "", company: "Quickbooks", category: "Software/POS", 
      description: "Accounting and financial management software", priority: "high" },
    { id: 32, name: "", company: "Xtrachef", category: "Software/POS", 
      description: "Restaurant invoice and cost management platform", priority: "medium" },

    // Marketing & Branding
    { id: 33, name: "", company: "Squarespace", website: "Squarespace.com", category: "Marketing/Branding", 
      address: "New York, NY 10014", description: "Website building and hosting platform", priority: "medium" },
    { id: 34, name: "Custom ink", company: "Custom Ink", email: "service@customink.com", phone: "800-293-4232", 
      website: "customink.com", category: "Marketing/Branding", description: "Custom apparel and promotional products", priority: "low" },
    { id: 35, name: "Printful", company: "Printful", email: "support@info.printful.com", website: "printful.com", 
      category: "Marketing/Branding", description: "Print-on-demand and fulfillment services", priority: "low" },

    // Professional Services
    { id: 36, name: "Steve Dillberg", company: "Schofer Dillberg & Company, Inc.", email: "steve@sdc-cpa.com", 
      phone: "(508) 545-8403", website: "https://www.sdc-cpa.com/", address: "MA", category: "Accounting/Finance", 
      description: "Certified public accounting services", priority: "high" },
    { id: 37, name: "Michael Grimmer", company: "Vestwell", email: "michael.grimmer@vestwell.com", 
      category: "Accounting/Finance", description: "401(k) and retirement plan services", priority: "low" },
    { id: 38, name: "Josh Duttweiller", company: "Josh Duttweiller", email: "joshua.duttweiler@me.com", phone: "(585)735-5082", 
      website: "https://joshuaduttweiler.com/", category: "Consulting", description: "Business consulting services", priority: "low" },

    // Apparel & Uniforms
    { id: 39, name: "Michelle Smith", company: "Tilit", email: "Michelle@tilitnyc.com", phone: "646-422-7197", 
      website: "https://www.tilitnyc.com/", address: "64 Allen St. #2, New York, NY 10002", category: "Uniforms", 
      description: "Chef and restaurant uniforms", priority: "medium" },
    { id: 40, name: "Jessica Dubrowskij", company: "Blue Drop", email: "Jessica@bluedrop.com", phone: "877-662-7873", 
      category: "Uniforms", description: "Custom uniforms and workwear", priority: "low" },

    // Specialty Services
    { id: 41, name: "", company: "Instacart", category: "Delivery/Logistics", 
      description: "Grocery delivery and shopping service", priority: "low" },
    { id: 42, name: "", company: "Clippership Wharf Family LLC", category: "Real Estate", 
      description: "Commercial real estate services", priority: "medium" },
    { id: 43, name: "", company: "yourbrandcafe", address: "24 Norfolk Ave, South Easton, MA 2375", category: "Food Supplier", 
      description: "Specialty coffee and cafe products", priority: "low" }
  ];

  const vendors = state.vendors.length > 0 ? state.vendors : initialVendors;

  const categories = [
    'Food Supplier', 'Beverage Supplier', 'Restaurant Supplies', 'Equipment', 
    'Cleaning & Sanitation', 'Linen Service', 'HVAC', 'Security', 'Pest Control', 
    'Construction', 'Engineering', 'Telecommunications', 'Utilities', 'Software/POS',
    'Marketing/Branding', 'Accounting/Finance', 'Consulting', 'Uniforms', 
    'Audio/Visual', 'Maintenance', 'Delivery/Logistics', 'Real Estate', 'Other'
  ];

  const priorityLevels = ['high', 'medium', 'low'];
  const ratingOptions = [0, 1, 2, 3, 4, 5];
  const statusOptions = ['active', 'inactive', 'on hold', 'pending'];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'on hold': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddVendor = (vendorData) => {
    const newVendor = {
      ...vendorData,
      id: Date.now(),
      priority: vendorData.priority || 'medium',
      status: 'active',
      rating: 0,
      leadTime: '',
      paymentTerms: '',
      minimumOrder: '',
      deliveryFee: '',
      contractRequired: false,
      certifications: [],
      specialties: [],
      notes: '',
      lastContact: new Date().toISOString().slice(0, 10),
      nextFollowUp: ''
    };
    actions.addVendor(newVendor);
    setShowAddForm(false);
  };

  const handleRemoveVendor = (vendorId) => {
    if (window.confirm('Are you sure you want to remove this vendor?')) {
      actions.removeVendor(vendorId);
    }
  };

  // Move stats calculation to useMemo to avoid calling function before definition
  const stats = useMemo(() => {
    const total = vendors.length;
    const highPriority = vendors.filter(v => v.priority === 'high').length;
    const categories = new Set(vendors.map(v => v.category)).size;
    return { total, highPriority, categories };
  }, [vendors]);

  // Enhanced Vendor Form Component
  const VendorForm = ({ vendor, onSubmit, onCancel, mode = 'add' }) => {
    const [formData, setFormData] = useState(vendor || {
      name: '',
      company: '',
      email: '',
      phone: '',
      mobile: '',
      fax: '',
      website: '',
      address: '',
      category: '',
      description: '',
      priority: 'medium',
      rating: 0,
      leadTime: '',
      paymentTerms: '',
      minimumOrder: '',
      deliveryFee: '',
      contractRequired: false,
      certifications: [],
      specialties: [],
      notes: '',
      status: 'active',
      nextFollowUp: ''
    });

    const [newCertification, setNewCertification] = useState('');
    const [newSpecialty, setNewSpecialty] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const addCertification = () => {
      if (newCertification.trim()) {
        setFormData(prev => ({
          ...prev,
          certifications: [...prev.certifications, newCertification.trim()]
        }));
        setNewCertification('');
      }
    };

    const removeCertification = (index) => {
      setFormData(prev => ({
        ...prev,
        certifications: prev.certifications.filter((_, i) => i !== index)
      }));
    };

    const addSpecialty = () => {
      if (newSpecialty.trim()) {
        setFormData(prev => ({
          ...prev,
          specialties: [...prev.specialties, newSpecialty.trim()]
        }));
        setNewSpecialty('');
      }
    };

    const removeSpecialty = (index) => {
      setFormData(prev => ({
        ...prev,
        specialties: prev.specialties.filter((_, i) => i !== index)
      }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {mode === 'edit' ? 'Edit Vendor' : 'Add New Vendor'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Company Name *"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                required
              />
              <FormField
                label="Contact Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
              <FormField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
              <FormField
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
              <FormField
                label="Mobile"
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
              />
              <FormField
                label="Fax"
                value={formData.fax}
                onChange={(e) => setFormData(prev => ({ ...prev, fax: e.target.value }))}
              />
              <FormField
                label="Website"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              />
              <FormField
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {priorityLevels.map(priority => (
                    <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={0}>No rating</option>
                  {ratingOptions.map(rating => (
                    <option key={rating} value={rating}>{rating} stars</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Lead Time"
                value={formData.leadTime}
                onChange={(e) => setFormData(prev => ({ ...prev, leadTime: e.target.value }))}
                placeholder="e.g., 1-2 business days"
              />
              <FormField
                label="Payment Terms"
                value={formData.paymentTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                placeholder="e.g., Net 30"
              />
              <FormField
                label="Minimum Order"
                value={formData.minimumOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, minimumOrder: e.target.value }))}
                placeholder="e.g., $250"
              />
              <FormField
                label="Delivery Fee"
                value={formData.deliveryFee}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryFee: e.target.value }))}
                placeholder="e.g., $25"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the vendor and their services..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Additional notes, experiences, or important information..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-up Date</label>
              <input
                type="date"
                value={formData.nextFollowUp}
                onChange={(e) => setFormData(prev => ({ ...prev, nextFollowUp: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.contractRequired}
                onChange={(e) => setFormData(prev => ({ ...prev, contractRequired: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Contract Required</span>
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="Add certification"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addCertification}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.certifications.map((cert, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {cert}
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Specialties */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Add specialty"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addSpecialty}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.specialties.map((specialty, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(index)}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {mode === 'edit' ? 'Update Vendor' : 'Add Vendor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Vendor Details Modal
  const VendorDetailsModal = ({ vendor, onClose }) => {
    if (!vendor) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{vendor.company}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
              <div className="space-y-2">
                {vendor.name && <p><span className="font-medium">Contact:</span> {vendor.name}</p>}
                {vendor.email && <p><span className="font-medium">Email:</span> <a href={`mailto:${vendor.email}`} className="text-blue-600 hover:underline">{vendor.email}</a></p>}
                {vendor.phone && <p><span className="font-medium">Phone:</span> <a href={`tel:${vendor.phone}`} className="text-blue-600 hover:underline">{vendor.phone}</a></p>}
                {vendor.mobile && <p><span className="font-medium">Mobile:</span> <a href={`tel:${vendor.mobile}`} className="text-blue-600 hover:underline">{vendor.mobile}</a></p>}
                {vendor.website && <p><span className="font-medium">Website:</span> <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{vendor.website}</a></p>}
                {vendor.address && <p><span className="font-medium">Address:</span> {vendor.address}</p>}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Business Details</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Category:</span> {vendor.category}</p>
                <p><span className="font-medium">Priority:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(vendor.priority)}`}>{vendor.priority}</span></p>
                <p><span className="font-medium">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>{vendor.status}</span></p>
                {vendor.rating > 0 && <p><span className="font-medium">Rating:</span> <span className="flex items-center">{vendor.rating} <Star className="h-4 w-4 text-yellow-400 ml-1" /></span></p>}
                {vendor.leadTime && <p><span className="font-medium">Lead Time:</span> {vendor.leadTime}</p>}
                {vendor.paymentTerms && <p><span className="font-medium">Payment Terms:</span> {vendor.paymentTerms}</p>}
                {vendor.minimumOrder && <p><span className="font-medium">Minimum Order:</span> {vendor.minimumOrder}</p>}
                {vendor.deliveryFee && <p><span className="font-medium">Delivery Fee:</span> {vendor.deliveryFee}</p>}
                <p><span className="font-medium">Contract Required:</span> {vendor.contractRequired ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {vendor.description && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">{vendor.description}</p>
            </div>
          )}

          {vendor.certifications && vendor.certifications.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {vendor.certifications.map((cert, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Award className="h-3 w-3 mr-1" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {vendor.specialties && vendor.specialties.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {vendor.specialties.map((specialty, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {vendor.notes && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
              <p className="text-gray-600">{vendor.notes}</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {vendor.lastContact && <span>Last Contact: {vendor.lastContact}</span>}
                {vendor.nextFollowUp && <span className="ml-4">Next Follow-up: {vendor.nextFollowUp}</span>}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingVendor(vendor);
                    onClose();
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to remove this vendor?')) {
                      handleRemoveVendor(vendor.id);
                      onClose();
                    }
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredVendors = useMemo(() => {
    let filtered = vendors;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(searchLower) ||
        vendor.company.toLowerCase().includes(searchLower) ||
        vendor.category.toLowerCase().includes(searchLower) ||
        vendor.description.toLowerCase().includes(searchLower)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(vendor => vendor.category === selectedCategory);
    }

    return filtered;
  }, [vendors, searchTerm, selectedCategory]);



  const exportVendors = () => {
    const csvContent = [
      ['ID', 'Company', 'Contact Name', 'Email', 'Phone', 'Mobile', 'Fax', 'Website', 'Address', 'Category', 'Priority', 'Status', 'Rating', 'Lead Time', 'Payment Terms', 'Minimum Order', 'Delivery Fee', 'Contract Required', 'Certifications', 'Specialties', 'Notes', 'Last Contact', 'Next Follow-up']
    ];

    vendors.forEach(vendor => {
      csvContent.push([
        vendor.id,
        vendor.company,
        vendor.name,
        vendor.email,
        vendor.phone,
        vendor.mobile,
        vendor.fax,
        vendor.website,
        vendor.address,
        vendor.category,
        vendor.priority,
        vendor.status,
        vendor.rating,
        vendor.leadTime,
        vendor.paymentTerms,
        vendor.minimumOrder,
        vendor.deliveryFee,
        vendor.contractRequired ? 'Yes' : 'No',
        vendor.certifications.join(', '),
        vendor.specialties.join(', '),
        vendor.notes,
        vendor.lastContact,
        vendor.nextFollowUp
      ]);
    });

    const csvString = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'boston_restaurant_vendors.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Visual Supply Chain Components
  const SupplyChainVisual = () => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
      <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
        <Network className="h-5 w-5 mr-2" />
        Restaurant Supply Chain Flow
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* Suppliers */}
        <div className="text-center">
          <div className="bg-blue-100 p-3 rounded-full mx-auto mb-2 w-16 h-16 flex items-center justify-center">
            <Warehouse className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-blue-800">Suppliers</p>
          <p className="text-xs text-blue-600">{vendors.filter(v => ['Food Supplier', 'Beverage Supplier'].includes(v.category)).length}</p>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="w-full h-0.5 bg-blue-300 relative">
            <Truck className="h-4 w-4 text-blue-500 absolute -top-2 left-1/2 transform -translate-x-1/2" />
          </div>
        </div>
        
        {/* Distribution */}
        <div className="text-center">
          <div className="bg-green-100 p-3 rounded-full mx-auto mb-2 w-16 h-16 flex items-center justify-center">
            <Truck className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-sm font-medium text-green-800">Distribution</p>
          <p className="text-xs text-green-600">Logistics</p>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="w-full h-0.5 bg-green-300 relative">
            <Truck className="h-4 w-4 text-green-500 absolute -top-2 left-1/2 transform -translate-x-1/2" />
          </div>
        </div>
        
        {/* Restaurant */}
        <div className="text-center">
          <div className="bg-orange-100 p-3 rounded-full mx-auto mb-2 w-16 h-16 flex items-center justify-center">
            <Store className="h-8 w-8 text-orange-600" />
          </div>
          <p className="text-sm font-medium text-orange-800">Restaurant</p>
          <p className="text-xs text-orange-600">Your Business</p>
        </div>
      </div>
    </div>
  );

  const CategoryChart = () => {
    const categoryCounts = vendors.reduce((acc, vendor) => {
      acc[vendor.category] = (acc[vendor.category] || 0) + 1;
      return acc;
    }, {});

    const topCategories = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6);

    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <PieChart className="h-5 w-5 mr-2" />
          Vendor Categories Distribution
        </h3>
        
        <div className="space-y-3">
          {topCategories.map(([category, count]) => {
            const percentage = Math.round((count / vendors.length) * 100);
            const barWidth = `${percentage}%`;
            
            return (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{category}</span>
                  <span className="text-gray-500">{count} vendors</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: barWidth }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const PriorityMatrix = () => (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BarChart3 className="h-5 w-5 mr-2" />
        Vendor Priority Matrix
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {vendors.filter(v => v.priority === 'high').length}
          </div>
          <div className="text-sm font-medium text-red-800">High Priority</div>
          <div className="text-xs text-red-600">Critical suppliers</div>
        </div>
        
        <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {vendors.filter(v => v.priority === 'medium').length}
          </div>
          <div className="text-sm font-medium text-yellow-800">Medium Priority</div>
          <div className="text-xs text-yellow-600">Important suppliers</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {vendors.filter(v => v.priority === 'low').length}
          </div>
          <div className="text-sm font-medium text-green-800">Low Priority</div>
          <div className="text-xs text-green-600">Optional suppliers</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header Section */}
      <SectionCard 
        title="Boston Restaurant Supply Chain Management" 
        description="Visual supply chain planning and vendor relationship management with real-time analytics."
        color="yellow"
      >
        {/* View Mode Toggle */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'chart' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setViewMode('supply-chain')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'supply-chain' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Supply Chain
            </button>
          </div>
        </div>

        {/* Supply Chain Visual */}
        {viewMode === 'supply-chain' && <SupplyChainVisual />}

        {/* Analytics View */}
        {viewMode === 'chart' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CategoryChart />
            <PriorityMatrix />
          </div>
        )}

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Vendors</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Building className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">High Priority</p>
                <p className="text-2xl font-bold text-red-900">{stats.highPriority}</p>
              </div>
              <Star className="h-8 w-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Categories</p>
                <p className="text-2xl font-bold text-green-900">{stats.categories}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Active</p>
                <p className="text-2xl font-bold text-purple-900">
                  {vendors.filter(v => v.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Vendor
          </button>
          <button
            onClick={exportVendors}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Supply Chain
          </button>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors by name, company, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </SectionCard>

      {/* Vendor Grid with Enhanced Visuals */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-gray-900">{vendor.company}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getPriorityColor(vendor.priority)}`}>
                      {vendor.priority}
                    </span>
                    <button
                      onClick={() => handleRemoveVendor(vendor.id)}
                      className="text-red-500 hover:text-red-700 text-sm hover:bg-red-50 p-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {vendor.name && (
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">{vendor.name}</span>
                    </div>
                  )}
                  
                  <div className="inline-block">
                    <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full font-medium">
                      {vendor.category}
                    </span>
                  </div>

                  {vendor.description && (
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{vendor.description}</p>
                  )}
                </div>

                <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                  {vendor.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${vendor.email}`} className="text-blue-600 hover:underline hover:text-blue-800 transition-colors">
                        {vendor.email}
                      </a>
                    </div>
                  )}
                  
                  {vendor.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a href={`tel:${vendor.phone}`} className="text-blue-600 hover:underline hover:text-blue-800 transition-colors">
                        {vendor.phone}
                      </a>
                    </div>
                  )}
                  
                  {vendor.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <a href={vendor.website} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline hover:text-blue-800 transition-colors">
                        Visit Website
                      </a>
                    </div>
                  )}
                  
                  {vendor.address && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{vendor.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredVendors.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No vendors found</h3>
          <p className="text-gray-500">Try adjusting your search terms or filter criteria.</p>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddForm && (
        <VendorForm 
          onSubmit={handleAddVendor}
          onCancel={() => setShowAddForm(false)}
          mode="add"
        />
      )}

      {editingVendor && (
        <VendorForm 
          vendor={editingVendor}
          onSubmit={(updatedVendor) => {
            actions.updateVendor(updatedVendor);
            setEditingVendor(null);
          }}
          onCancel={() => setEditingVendor(null)}
          mode="edit"
        />
      )}

      {/* Vendor Details Modal */}
      {editingVendor && <VendorDetailsModal vendor={editingVendor} onClose={() => setEditingVendor(null)} />}
    </div>
  );
};

export default VendorManagement; 