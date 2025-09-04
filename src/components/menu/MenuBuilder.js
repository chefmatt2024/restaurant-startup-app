import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit3, Save, X, DollarSign, TrendingUp, Calculator } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const MenuBuilder = () => {
  const { actions } = useApp();
  const [menuItems, setMenuItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    cost: '',
    preparationTime: '',
    allergens: [],
    dietary: []
  });

  const categories = useMemo(() => [
    'Appetizers',
    'Soups & Salads',
    'Main Courses',
    'Pasta & Risotto',
    'Seafood',
    'Meat & Poultry',
    'Vegetarian',
    'Desserts',
    'Beverages',
    'Wine & Cocktails'
  ], []);

  const allergens = [
    'Dairy', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts', 
    'Peanuts', 'Wheat', 'Soy', 'Gluten'
  ];

  const dietary = [
    'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Low-Carb',
    'Keto-Friendly', 'Low-Sodium', 'Heart-Healthy'
  ];

  const addMenuItem = () => {
    if (!formData.name || !formData.price || !formData.cost) return;

    const newItem = {
      id: Date.now().toString(),
      ...formData,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      profit: parseFloat(formData.price) - parseFloat(formData.cost),
      margin: ((parseFloat(formData.price) - parseFloat(formData.cost)) / parseFloat(formData.price) * 100).toFixed(1)
    };

    setMenuItems([...menuItems, newItem]);
    setFormData({
      name: '',
      category: '',
      description: '',
      price: '',
      cost: '',
      preparationTime: '',
      allergens: [],
      dietary: []
    });
    setShowAddForm(false);
  };

  const updateMenuItem = () => {
    if (!editingItem || !formData.name || !formData.price || !formData.cost) return;

    const updatedItem = {
      ...editingItem,
      ...formData,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      profit: parseFloat(formData.price) - parseFloat(formData.cost),
      margin: ((parseFloat(formData.price) - parseFloat(formData.cost)) / parseFloat(formData.price) * 100).toFixed(1)
    };

    setMenuItems(menuItems.map(item => 
      item.id === editingItem.id ? updatedItem : item
    ));
    setEditingItem(null);
    setFormData({
      name: '',
      category: '',
      description: '',
      price: '',
      cost: '',
      preparationTime: '',
      allergens: [],
      dietary: []
    });
  };

  const deleteMenuItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const editMenuItem = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price.toString(),
      cost: item.cost.toString(),
      preparationTime: item.preparationTime,
      allergens: item.allergens || [],
      dietary: item.dietary || []
    });
  };

  const toggleAllergen = (allergen) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const toggleDietary = (diet) => {
    setFormData(prev => ({
      ...prev,
      dietary: prev.dietary.includes(diet)
        ? prev.dietary.filter(d => d !== diet)
        : [...prev.dietary, diet]
    }));
  };

  // Financial calculations
  const financialSummary = useMemo(() => {
    const totalRevenue = menuItems.reduce((sum, item) => sum + (item.price * 100), 0); // Assuming 100 orders per item
    const totalCost = menuItems.reduce((sum, item) => sum + (item.cost * 100), 0);
    const totalProfit = totalRevenue - totalCost;
    const averageMargin = menuItems.length > 0 
      ? menuItems.reduce((sum, item) => sum + parseFloat(item.margin), 0) / menuItems.length 
      : 0;

    return {
      totalRevenue,
      totalCost,
      totalProfit,
      averageMargin: averageMargin.toFixed(1),
      itemCount: menuItems.length
    };
  }, [menuItems]);

  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    categories.forEach(category => {
      const items = menuItems.filter(item => item.category === category);
      breakdown[category] = {
        count: items.length,
        revenue: items.reduce((sum, item) => sum + (item.price * 100), 0),
        profit: items.reduce((sum, item) => sum + (item.profit * 100), 0)
      };
    });
    return breakdown;
  }, [menuItems, categories]);

  const saveToFinancialProjections = () => {
    // This will integrate with the financial projections component
    const menuData = {
      items: menuItems,
      summary: financialSummary,
      categoryBreakdown,
      lastUpdated: new Date().toISOString()
    };
    
    // Save to context for integration with financial projections
    actions.updateFinancialData('menu', menuData);
    
    // You can also save to Firebase/localStorage here
    // console.log('Menu data saved for financial projections:', menuData);
  }
    // Recipe Calculator State
  const [showRecipeCalculator, setShowRecipeCalculator] = useState(false);
  const [recipeCalculatorData, setRecipeCalculatorData] = useState({
    itemName: '',
    yield: '',
    instructions: '',
    ingredients: [{ name: '', quantity: '', unit: '', cost: '' }],
    prepTime: '',
    costPerServing: ''
  });

  const addIngredient = () => {
    setRecipeCalculatorData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '', cost: '' }]
    }));
  };

  const updateIngredient = (index, field, value) => {
    setRecipeCalculatorData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    }));
  };

  const removeIngredient = (index) => {
    setRecipeCalculatorData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const calculateRecipeCost = () => {
    let totalCost = 0;
    recipeCalculatorData.ingredients.forEach(ingredient => {
      if (ingredient.quantity && ingredient.cost) {
        totalCost += parseFloat(ingredient.quantity) * parseFloat(ingredient.cost);
      }
    });
    return totalCost.toFixed(2);
  };

  const saveRecipeToMenu = () => {
    if (!recipeCalculatorData.itemName || !recipeCalculatorData.yield || !recipeCalculatorData.prepTime) return;

    const newItem = {
      id: Date.now().toString(),
      name: recipeCalculatorData.itemName,
      category: 'Main Courses', // Default category for recipe
      description: recipeCalculatorData.instructions,
      price: parseFloat(recipeCalculatorData.costPerServing), // Use calculated price
      cost: parseFloat(calculateRecipeCost()), // Use calculated cost
      preparationTime: recipeCalculatorData.prepTime,
      allergens: [],
      dietary: [],
      profit: parseFloat(recipeCalculatorData.costPerServing) - parseFloat(calculateRecipeCost()),
      margin: ((parseFloat(recipeCalculatorData.costPerServing) - parseFloat(calculateRecipeCost())) / parseFloat(recipeCalculatorData.costPerServing) * 100).toFixed(1)
    };

    setMenuItems([...menuItems, newItem]);
    setShowRecipeCalculator(false);
    setRecipeCalculatorData({
      itemName: '',
      yield: '',
      instructions: '',
      ingredients: [{ name: '', quantity: '', unit: '', cost: '' }],
      prepTime: '',
      costPerServing: ''
    });
  };

  // Pricing Strategy State
  const [showPricingStrategy, setShowPricingStrategy] = useState(false);
  const [pricingStrategyData, setPricingStrategyData] = useState({
    selectedStrategy: 'cost-plus',
    markup: 300, // Default markup for Cost-Plus
    adjustment: 0, // Default adjustment for Competitive
    multiplier: 1.5 // Default multiplier for Value-Based
  });

  const calculatePricing = () => {
    let price = 0;
    const cost = parseFloat(recipeCalculatorData.costPerServing);

    switch (pricingStrategyData.selectedStrategy) {
      case 'cost-plus':
        price = cost * (1 + pricingStrategyData.markup / 100);
        break;
      case 'competitor':
        price = cost + pricingStrategyData.adjustment;
        break;
      case 'value-based':
        price = cost * pricingStrategyData.multiplier;
        break;
      case 'dynamic':
        // This is a placeholder for dynamic pricing logic
        // In a real app, you'd calculate a base price and then apply a multiplier
        // For simplicity, we'll just return a fixed value or a placeholder
        price = cost * 2; // Example: double cost for dynamic
        break;
      default:
        price = cost;
    }
    return price.toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Menu Builder</h2>
          <p className="text-gray-600">Design your restaurant menu and analyze profitability</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Menu Item
          </button>
          <button
            onClick={() => setShowRecipeCalculator(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Recipe Calculator
          </button>
          <button
            onClick={() => setShowPricingStrategy(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Pricing Strategy
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">${financialSummary.totalRevenue.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calculator className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Cost</dt>
                  <dd className="text-lg font-medium text-gray-900">${financialSummary.totalCost.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Profit</dt>
                  <dd className="text-lg font-medium text-green-600">${financialSummary.totalProfit.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Margin</dt>
                  <dd className="text-lg font-medium text-blue-600">{financialSummary.averageMargin}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingItem) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                  setFormData({
                    name: '',
                    category: '',
                    description: '',
                    price: '',
                    cost: '',
                    preparationTime: '',
                    allergens: [],
                    dietary: []
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Grilled Salmon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe the dish..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Prep Time (minutes)</label>
                <input
                  type="number"
                  value={formData.preparationTime}
                  onChange={(e) => setFormData({...formData, preparationTime: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Allergens</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {allergens.map(allergen => (
                    <label key={allergen} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.allergens.includes(allergen)}
                        onChange={() => toggleAllergen(allergen)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{allergen}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Dietary Options</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {dietary.map(diet => (
                    <label key={diet} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.dietary.includes(diet)}
                        onChange={() => toggleDietary(diet)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{diet}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={editingItem ? updateMenuItem : addMenuItem}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Items Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Menu Items ({menuItems.length})</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your restaurant menu and pricing</p>
          </div>
          <button
            onClick={saveToFinancialProjections}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Save to Financial Projections
          </button>
        </div>
        
        {menuItems.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No menu items</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first menu item.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Menu Item
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500">{item.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">${item.profit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{item.margin}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => editMenuItem(item)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMenuItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      {menuItems.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Category Breakdown</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Revenue and profit analysis by menu category</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              {categories.map(category => {
                const data = categoryBreakdown[category];
                if (!data || data.count === 0) return null;
                
                return (
                  <div key={category} className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">{category}</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="font-medium">Items:</span> {data.count}
                        </div>
                        <div>
                          <span className="font-medium">Revenue:</span> ${data.revenue.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Profit:</span> ${data.profit.toLocaleString()}
                        </div>
                      </div>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      )}

      {/* Recipe Calculator Modal */}
      {showRecipeCalculator && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Recipe Calculator</h3>
              <button
                onClick={() => setShowRecipeCalculator(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  value={recipeCalculatorData.itemName}
                  onChange={(e) => setRecipeCalculatorData({...recipeCalculatorData, itemName: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Classic Margherita Pizza"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Yield (Portions)</label>
                <input
                  type="number"
                  value={recipeCalculatorData.yield}
                  onChange={(e) => setRecipeCalculatorData({...recipeCalculatorData, yield: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Instructions</label>
                <textarea
                  value={recipeCalculatorData.instructions}
                  onChange={(e) => setRecipeCalculatorData({...recipeCalculatorData, instructions: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Bake for 15-20 minutes at 400°F."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                <div className="mt-2">
                  {recipeCalculatorData.ingredients.map((ingredient, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 items-center mb-2">
                      <input
                        type="text"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                        className="col-span-1 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ingredient Name"
                      />
                      <input
                        type="number"
                        value={ingredient.quantity}
                        onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                        className="col-span-1 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Quantity"
                      />
                      <select
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                        className="col-span-1 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Unit</option>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                        <option value="l">l</option>
                        <option value="cups">cups</option>
                        <option value="pieces">pieces</option>
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        value={ingredient.cost}
                        onChange={(e) => updateIngredient(index, 'cost', e.target.value)}
                        className="col-span-1 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Cost per unit"
                      />
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="col-span-1 text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ingredient
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prep Time (minutes)</label>
                <input
                  type="number"
                  value={recipeCalculatorData.prepTime}
                  onChange={(e) => setRecipeCalculatorData({...recipeCalculatorData, prepTime: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cost Per Serving ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={recipeCalculatorData.costPerServing}
                  onChange={(e) => setRecipeCalculatorData({...recipeCalculatorData, costPerServing: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="15.00"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRecipeCalculator(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveRecipeToMenu}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pricing Strategy Modal */}
      {showPricingStrategy && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Pricing Strategy</h3>
              <button
                onClick={() => setShowPricingStrategy(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Strategy</label>
                <select
                  value={pricingStrategyData.selectedStrategy}
                  onChange={(e) => setPricingStrategyData({...pricingStrategyData, selectedStrategy: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="cost-plus">Cost-Plus (Markup)</option>
                  <option value="competitor">Competitor-Based (Adjustment)</option>
                  <option value="value-based">Value-Based (Multiplier)</option>
                  <option value="dynamic">Dynamic (Placeholder)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Markup (%)</label>
                <input
                  type="number"
                  value={pricingStrategyData.markup}
                  onChange={(e) => setPricingStrategyData({...pricingStrategyData, markup: parseFloat(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Adjustment ($)</label>
                <input
                  type="number"
                  value={pricingStrategyData.adjustment}
                  onChange={(e) => setPricingStrategyData({...pricingStrategyData, adjustment: parseFloat(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="5.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Multiplier</label>
                <input
                  type="number"
                  value={pricingStrategyData.multiplier}
                  onChange={(e) => setPricingStrategyData({...pricingStrategyData, multiplier: parseFloat(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Calculated Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={calculatePricing()}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                  disabled
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPricingStrategy(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newItem = {
                      id: Date.now().toString(),
                      name: recipeCalculatorData.itemName,
                      category: 'Main Courses', // Default category for recipe
                      description: recipeCalculatorData.instructions,
                      price: parseFloat(calculatePricing()), // Use calculated price
                      cost: parseFloat(calculateRecipeCost()), // Use calculated cost
                      preparationTime: recipeCalculatorData.prepTime,
                      allergens: [],
                      dietary: [],
                      profit: parseFloat(calculatePricing()) - parseFloat(calculateRecipeCost()),
                      margin: ((parseFloat(calculatePricing()) - parseFloat(calculateRecipeCost())) / parseFloat(calculatePricing()) * 100).toFixed(1)
                    };
                    setMenuItems([...menuItems, newItem]);
                    setShowPricingStrategy(false);
                    setRecipeCalculatorData({
                      itemName: '',
                      yield: '',
                      instructions: '',
                      ingredients: [{ name: '', quantity: '', unit: '', cost: '' }],
                      prepTime: '',
                      costPerServing: ''
                    });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Apply Strategy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuBuilder;
