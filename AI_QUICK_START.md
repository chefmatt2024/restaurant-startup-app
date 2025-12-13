# 🚀 AI Integration Quick Start

## Setup in 3 Steps

### 1. Get API Key (Choose One)

**OpenAI (Recommended - Lower Cost):**
- Visit: https://platform.openai.com/api-keys
- Create account → Create API key
- Add $5-10 credits to your account

**OR Anthropic Claude (More Advanced):**
- Visit: https://console.anthropic.com/
- Create account → Get API key

### 2. Add to Environment File

Create `.env.local` in project root:

```env
# For OpenAI
REACT_APP_OPENAI_API_KEY=sk-your-key-here
REACT_APP_AI_PROVIDER=openai

# OR for Anthropic
# REACT_APP_ANTHROPIC_API_KEY=sk-ant-your-key-here
# REACT_APP_AI_PROVIDER=anthropic
```

### 3. Restart Server

```bash
# Stop server (Ctrl+C) then:
npm start
```

## Where to Use AI

### 📊 Market Analysis
- Go to **Business Plan → Market Analysis → Location Insights tab**
- Click **"Research Market"** for AI-powered market data
- Ask questions about demographics, competition, trends

### 💰 Financial Projections
- Scroll to **"AI Financial Advisor"** section
- Ask: "What are the risks in my financial plan?"
- Get recommendations for cost optimization

### 📝 Executive Summary
- Scroll to **"AI Writing Assistant"** section
- Click **"Generate Content"** to auto-write your summary
- Or ask: "Write an executive summary for my restaurant"

### 🎯 Other Sections
- **Competitive Analysis**: Get competitor insights
- **Marketing Strategy**: Develop marketing plans
- **Operations Plan**: Create operations procedures

## Example Questions

**Market Research:**
- "What are the demographics of Back Bay, Boston?"
- "What's the average rent per square foot in Cambridge?"
- "What restaurant trends are popular in Boston right now?"

**Financial Analysis:**
- "Analyze my financial projections and identify risks"
- "How can I improve my profit margins?"
- "Is my break-even point realistic?"

**Business Planning:**
- "Write a competitive analysis for a fast-casual restaurant in Somerville"
- "What should I include in my marketing strategy?"
- "Develop an operations plan for a 50-seat restaurant"

## Quick Actions

Each AI section has 4 quick action buttons:
1. **Generate Content** - AI writes the entire section
2. **Auto-Fill** - Completes missing fields intelligently
3. **Research Market** - Gets market data and insights
4. **Improve Content** - Suggests improvements to existing content

## Cost Estimate

- **Per query**: $0.01 - $0.10
- **Monthly (moderate use)**: $5 - $20
- **Set spending limits** in your API provider dashboard

## Troubleshooting

**"API key not configured" error:**
- Check `.env.local` exists and has correct key
- Restart development server
- Variable name must be exact: `REACT_APP_OPENAI_API_KEY`

**"API request failed" error:**
- Verify API key is correct
- Check you have credits in your account
- Wait if you hit rate limits

---

**That's it!** Once your API key is set, AI features work automatically throughout the app.

