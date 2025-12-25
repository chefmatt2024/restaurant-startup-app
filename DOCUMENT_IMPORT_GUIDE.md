# 📄 Document Import Feature Guide

## Overview

The Document Import feature allows you to upload existing business plan documents (PDF, Word, or text files) and automatically extract information to populate your restaurant business plan.

## ✅ What's Included

### **Supported File Formats:**
- ✅ **Word Documents** (.doc, .docx) - Full support
- ✅ **Text Files** (.txt) - Full support  
- ⚠️ **PDF Files** (.pdf) - Limited browser support (see notes below)

### **What Gets Extracted:**

The AI-powered parser extracts information from your document and maps it to:

1. **Executive Summary**
   - Business name
   - Business type
   - Location
   - Mission statement
   - Key success factors
   - Financial summary

2. **Market Analysis**
   - Target market
   - Market size
   - Competitive analysis
   - Market trends
   - Customer demographics

3. **Financial Data**
   - Revenue projections (food sales, beverage sales)
   - Operating expenses (rent, utilities, marketing)
   - Startup costs (build costs, purchase price, equipment, etc.)

4. **Operations Plan**
   - Location details
   - Facility requirements
   - Hours of operation
   - Staffing plan

5. **Management Team**
   - Key personnel information

6. **Marketing Strategy**
   - Marketing mix
   - Customer acquisition strategies

## 🚀 How to Use

### Step 1: Access the Import Feature
1. Navigate to the **Dashboard**
2. Click on the **"Import Document"** tab in the navigation
3. You'll see the document upload interface

### Step 2: Upload Your Document
1. Click **"Choose File"** button
2. Select your business plan document (PDF, Word, or text file)
3. Wait for the file to be processed (30-60 seconds)

### Step 3: Review Extracted Data
1. The AI will analyze your document
2. You'll see a preview of extracted text
3. A structured data preview will show what was found

### Step 4: Select Sections to Import
1. Check the boxes for sections you want to import
2. Sections with no data will be grayed out
3. Review what will be imported

### Step 5: Import the Data
1. Click **"Import Selected Sections"**
2. Data will be populated into the respective sections
3. Navigate to those sections to review and edit

## ⚠️ Important Notes

### PDF Limitations
- **PDF parsing has limited browser support** due to technical constraints
- **Recommended**: Convert PDFs to Word (.docx) or text (.txt) format first
- You can:
  - Use Adobe Acrobat or online converters
  - Copy text from PDF and paste into a .txt file
  - Use Word to open and save PDF as .docx

### Best Practices

1. **Document Quality**
   - Use well-structured documents with clear sections
   - Include headings and labels for better extraction
   - Ensure text is selectable (not scanned images)

2. **File Size**
   - Maximum file size: 10MB
   - For larger documents, split into sections

3. **Content Format**
   - Use clear section headings
   - Include numbers and data in standard formats
   - Avoid complex tables (extract as text first)

4. **Review After Import**
   - Always review imported data
   - Edit and refine as needed
   - Some manual adjustment may be required

## 🔧 Technical Details

### How It Works

1. **Text Extraction**
   - Word documents: Uses `mammoth` library
   - Text files: Direct reading
   - PDFs: Attempts parsing (may require conversion)

2. **AI Analysis**
   - Extracted text is sent to OpenAI GPT-4
   - AI identifies and structures relevant information
   - Returns JSON with mapped data

3. **Data Import**
   - Selected sections are imported into app state
   - Data is merged with existing information
   - You can edit immediately after import

### Libraries Used
- `mammoth` - Word document parsing
- `pdf-parse` - PDF parsing (limited browser support)
- OpenAI GPT-4 - AI-powered data extraction

## 🐛 Troubleshooting

### "Failed to extract text from document"
- **Solution**: Try converting to Word or text format
- Check file isn't corrupted
- Ensure file size is under 10MB

### "PDF parsing not available"
- **Solution**: Convert PDF to Word or text format
- Use online PDF to Word converters
- Or copy text from PDF into a text file

### "No data found in document"
- **Solution**: Ensure document has clear structure
- Add section headings
- Include relevant business plan information

### "AI parsing failed"
- **Solution**: Check your OpenAI API key is configured
- Ensure document has extractable text
- Try a simpler document format

## 📝 Example Use Cases

### Use Case 1: Import Existing Business Plan
1. You have a Word document business plan
2. Upload it via Import Document
3. Select all sections to import
4. Review and refine in respective sections

### Use Case 2: Import Financial Projections
1. You have a PDF with financial data
2. Convert PDF to Word first
3. Upload and select only "Financial Data"
4. Review numbers in Financial Projections tab

### Use Case 3: Import Market Research
1. You have a text file with market analysis
2. Upload the text file
3. Select "Market Analysis" section
4. Review and enhance with AI Assistant

## 🔐 Privacy & Security

- Documents are processed **locally** (text extraction)
- Text is sent to OpenAI for analysis (see OpenAI privacy policy)
- No documents are stored permanently
- You can delete uploaded files immediately after import

## 🚀 Future Enhancements

- [ ] Better PDF support via backend service
- [ ] Image-based document OCR
- [ ] Excel spreadsheet import
- [ ] Direct Google Docs import
- [ ] Batch document processing
- [ ] Template matching for common formats

---

**Last Updated**: 2024-01-21
**Status**: ✅ Ready to Use

