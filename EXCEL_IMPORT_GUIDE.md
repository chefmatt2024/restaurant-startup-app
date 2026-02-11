# 📊 Excel Financial Projections Import Guide

## Overview

You can now upload Excel files (`.xlsx` or `.xls`) containing your financial projections and automatically import them into your restaurant business plan!

## ✅ Supported File Types

- **Excel 2007+** (`.xlsx`) - Recommended
- **Excel 97-2003** (`.xls`) - Supported

**Maximum file size:** 10MB

## 📋 What Gets Imported

The Excel importer can extract and map the following financial data:

### Revenue
- Food Sales
- Beverage Sales
- Merchandise Sales
- Catering Sales
- Other Revenue

### Cost of Goods Sold (COGS)
- Food Cost % (as percentage or decimal)
- Beverage Cost % (as percentage or decimal)
- Merchandise Cost %
- Catering Cost %

### Operating Expenses
- Rent
- Utilities
- Insurance
- Marketing/Advertising
- Legal & Accounting
- Repairs & Maintenance
- Supplies
- Admin/Office
- Other Operating Expenses
- Owner Salary
- Full-Time Staff Costs
- Part-Time Staff Costs
- Payroll Tax Rate

### Startup Costs
- Leasehold Improvements
- Kitchen Equipment
- Furniture & Fixtures
- Initial Inventory
- Pre-Opening Salaries
- Deposits & Licenses
- Initial Marketing
- Contingency

### Restaurant Operations
- Number of Seats
- Square Footage

## 🚀 How to Use

### Step 1: Prepare Your Excel File

1. **Use clear column headers** - The AI will automatically identify columns based on header names
2. **Recommended headers:**
   - "Food Sales" or "Food Revenue"
   - "Beverage Sales" or "Bar Sales"
   - "Rent" or "Rental"
   - "Kitchen Equipment"
   - "Seats" or "Capacity"
   - etc.

3. **Format your data:**
   - Use numbers (not text) for financial values
   - Percentages can be entered as:
     - `28` (will be interpreted as 28%)
     - `0.28` (will be interpreted as 28%)
   - Dollar amounts should be numbers without currency symbols

### Step 2: Upload Your File

1. Navigate to **Financial Projections** tab
2. Scroll down to **"Import Financial Projections from Excel"** section
3. Click the upload area or **"Click to upload Excel file"**
4. Select your Excel file (e.g., `Quartermaster projection.xlsx`)

### Step 3: Review the Import

1. Wait for processing (usually 10-30 seconds)
2. The AI will:
   - Parse your Excel file
   - Identify column headers
   - Map columns to financial fields
   - Extract data values

3. Click **"Show Preview"** to review what was extracted
4. Verify the data looks correct

### Step 4: Import the Data

1. Click **"Import Financial Data"** button
2. Data will be populated into your financial plan
3. Navigate to the relevant sections to review and adjust as needed

## 💡 Tips for Best Results

### Column Headers
Use clear, descriptive headers. The AI recognizes variations like:
- "Food Sales", "Food Revenue", "Food"
- "Rent", "Rental", "Lease"
- "Kitchen Equipment", "Equipment"
- "Seats", "Capacity"

### Data Format
- **Revenue/Expenses:** Enter as numbers (e.g., `120000` for $120,000)
- **Percentages:** Can be `28` (28%) or `0.28` (28%)
- **First row:** Should contain your actual data (not totals or summaries)

### Multiple Worksheets
- The importer uses the **first worksheet** by default
- If your data is in a different sheet, move it to the first sheet or reorganize

### Partial Data
- You don't need all fields - import what you have
- You can manually fill in missing fields later
- The importer will only import fields it can identify

## 🔍 Example Excel Structure

```
| Food Sales | Beverage Sales | Rent | Utilities | Kitchen Equipment | Seats |
|------------|----------------|------|-----------|-------------------|-------|
| 850000     | 280000         | 120000 | 18000   | 110000           | 65    |
```

This would import:
- Revenue: Food Sales = $850,000, Beverage Sales = $280,000
- Operating Expenses: Rent = $120,000, Utilities = $18,000
- Startup Costs: Kitchen Equipment = $110,000
- Restaurant Operations: Seats = 65

## ⚠️ Troubleshooting

### "File is too large"
- Maximum file size is 10MB
- Try removing unnecessary worksheets or data

### "Excel file appears to be empty"
- Ensure your file has data in the first worksheet
- Check that cells contain actual values (not formulas that evaluate to empty)

### "No data to import"
- Verify your column headers are clear and recognizable
- Try renaming headers to match common terms (see "Column Headers" section)
- Check that your data row contains actual numbers

### Data not mapping correctly
- Review the preview before importing
- Manually adjust column headers to be more descriptive
- You can always edit imported data manually after import

## 🎯 Use Cases

### Scenario 1: Existing Financial Model
You have a detailed Excel financial model from another tool (like Quartermaster). Upload it to quickly populate your business plan.

### Scenario 2: Quick Start
You've created a simple Excel spreadsheet with key numbers. Import it to get started quickly, then use the app's features to expand.

### Scenario 3: Multiple Scenarios
Import different Excel files for different scenarios (conservative, optimistic, etc.) by creating separate drafts.

## 📝 After Import

1. **Review imported data** in each section
2. **Use AI features** to get recommendations and insights
3. **Generate documents** (Business Plan, Pitch Deck, Financial Projections)
4. **Export** your complete plan

## 🔄 Re-importing

- You can import multiple times - new data will merge with existing data
- To start fresh, create a new draft
- Imported data can always be manually edited

---

**Ready to import? Navigate to Financial Projections and look for "Import Financial Projections from Excel"!**

