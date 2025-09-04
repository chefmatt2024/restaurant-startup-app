# 🍽️ Menu Builder Component

## Overview
The Menu Builder is a comprehensive tool for designing restaurant menus with integrated financial analysis. It helps restaurant owners plan their menu items, calculate profitability, and integrate data with financial projections.

## Features

### 🎯 Core Functionality
- **Menu Item Management**: Add, edit, and delete menu items
- **Category Organization**: Organize items by restaurant categories
- **Pricing Analysis**: Set prices and costs with automatic profit margin calculation
- **Allergen Tracking**: Track common allergens for each dish
- **Dietary Options**: Mark items as vegetarian, vegan, halal, etc.
- **Preparation Time**: Track cooking/prep time for kitchen planning

### 💰 Financial Integration
- **Real-time Calculations**: Automatic profit and margin calculations
- **Revenue Projections**: Estimate revenue based on menu pricing
- **Cost Analysis**: Track ingredient and preparation costs
- **Category Breakdown**: Analyze profitability by menu category
- **Financial Export**: Save menu data to financial projections

### 📊 Analytics Dashboard
- **Financial Summary Cards**: Total revenue, costs, profit, and margins
- **Category Performance**: Revenue and profit breakdown by category
- **Item Profitability**: Individual item profit analysis
- **Menu Optimization**: Identify high and low-margin items

## Integration with Financial Projections

The Menu Builder automatically integrates with the Financial Projections component:

### Data Flow
1. **Menu Creation**: Design menu items with pricing and costs
2. **Financial Calculation**: Automatic profit margin calculations
3. **Data Export**: Click "Save to Financial Projections" to export
4. **Financial Analysis**: Menu data appears in revenue projections

### Exported Data Structure
```javascript
{
  items: [
    {
      id: "unique_id",
      name: "Grilled Salmon",
      category: "Main Courses",
      price: 28.00,
      cost: 12.50,
      profit: 15.50,
      margin: "55.4",
      preparationTime: "20",
      allergens: ["Fish"],
      dietary: ["Gluten-Free", "Low-Carb"]
    }
  ],
  summary: {
    totalRevenue: 2800,
    totalCost: 1250,
    totalProfit: 1550,
    averageMargin: "55.4",
    itemCount: 10
  },
  categoryBreakdown: {
    "Main Courses": {
      count: 5,
      revenue: 1400,
      profit: 775
    }
  },
  lastUpdated: "2024-01-15T10:30:00.000Z"
}
```

## Usage

### Adding Menu Items
1. Click "Add Menu Item" button
2. Fill in item details:
   - **Name**: Dish name
   - **Category**: Menu section
   - **Description**: Optional dish description
   - **Price**: Customer price
   - **Cost**: Ingredient/preparation cost
   - **Prep Time**: Minutes to prepare
   - **Allergens**: Check applicable allergens
   - **Dietary**: Select dietary options
3. Click "Add Item"

### Editing Items
1. Click the edit icon (✏️) on any menu item
2. Modify the form data
3. Click "Update Item"

### Financial Analysis
- **Real-time Updates**: Financial summary updates as you add/edit items
- **Category Analysis**: View performance by menu category
- **Export Data**: Save to financial projections for comprehensive analysis

### Menu Optimization
- **High-Margin Items**: Focus on items with >60% profit margin
- **Low-Margin Items**: Consider price increases or cost reduction
- **Category Balance**: Ensure profitable categories are well-represented
- **Seasonal Adjustments**: Modify pricing based on ingredient costs

## Best Practices

### Pricing Strategy
- **Cost-Plus Pricing**: Set prices at 3-4x ingredient costs
- **Competitive Analysis**: Research local restaurant pricing
- **Value Perception**: Price reflects quality and portion size
- **Profit Targets**: Aim for 60-70% gross margins

### Menu Design
- **Category Balance**: Mix of high and low-margin items
- **Seasonal Items**: Rotate based on ingredient availability
- **Signature Dishes**: Premium pricing for unique offerings
- **Combo Deals**: Bundle items for better profitability

### Cost Management
- **Ingredient Tracking**: Monitor supplier costs regularly
- **Waste Reduction**: Minimize food waste through portion control
- **Prep Efficiency**: Optimize kitchen workflow
- **Supplier Relationships**: Negotiate better pricing with volume

## Technical Details

### Component Structure
- **State Management**: Uses React hooks for local state
- **Context Integration**: Integrates with AppContext for data persistence
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Immediate financial calculations

### Data Persistence
- **Local Storage**: Menu data saved locally
- **Context State**: Integrated with app-wide state management
- **Firebase Ready**: Prepared for cloud data sync
- **Export Capability**: Data can be exported to other components

### Performance
- **Memoized Calculations**: Financial summaries use useMemo for efficiency
- **Optimized Rendering**: Only re-renders when necessary
- **Efficient Updates**: Batch updates for multiple changes
- **Memory Management**: Proper cleanup of event listeners

## Future Enhancements

### Planned Features
- **Recipe Management**: Detailed ingredient lists and costs
- **Seasonal Pricing**: Dynamic pricing based on ingredient costs
- **Supplier Integration**: Direct vendor pricing updates
- **Menu Templates**: Pre-built menu structures for different cuisines
- **Analytics Dashboard**: Advanced reporting and trends
- **Mobile App**: Native mobile interface for kitchen staff

### Integration Opportunities
- **Inventory Management**: Track ingredient usage and reorder points
- **POS Integration**: Sync with point-of-sale systems
- **Customer Analytics**: Track popular items and ordering patterns
- **Kitchen Display**: Real-time order management
- **Online Ordering**: Menu display for delivery platforms

## Support

For questions or issues with the Menu Builder:
1. Check the console for error messages
2. Verify all required fields are filled
3. Ensure proper data format for prices and costs
4. Check browser compatibility (Chrome, Firefox, Safari, Edge)

The Menu Builder is designed to be intuitive and user-friendly while providing powerful financial analysis capabilities for restaurant business planning.
