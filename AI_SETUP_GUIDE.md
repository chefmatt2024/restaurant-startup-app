# 🤖 AI Integration Setup Guide

## Overview

The app now includes AI-powered assistance to help you:
- **Auto-fill business plan sections** with intelligent content
- **Research market data** for your location
- **Get financial recommendations** based on your projections
- **Answer questions** about restaurant planning
- **Improve content** with AI suggestions

## Supported AI Providers

The app supports both **OpenAI** (GPT-4) and **Anthropic** (Claude) APIs. You can use either one.

## Setup Instructions

### Step 1: Get an API Key

#### Option A: OpenAI (Recommended)
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Copy your API key (starts with `sk-...`)
5. **Important**: Add credits to your OpenAI account ($5-10 minimum recommended)

#### Option B: Anthropic Claude
1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy your API key

### Step 2: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp env.example .env.local
   ```

2. **Open `.env.local`** in a text editor

3. **Add your API key:**

   For OpenAI:
   ```env
   REACT_APP_OPENAI_API_KEY=sk-your-actual-api-key-here
   REACT_APP_AI_PROVIDER=openai
   ```

   OR for Anthropic:
   ```env
   REACT_APP_ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
   REACT_APP_AI_PROVIDER=anthropic
   ```

4. **Save the file**

### Step 3: Restart Development Server

If your development server is running, restart it to load the new environment variables:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm start
```

## Usage

### In Market Analysis Section

1. Navigate to **Business Plan → Market Analysis**
2. Click the **"Location Insights"** tab
3. You'll see the **AI Research Panel**:
   - Click **"Research Market"** to get AI-powered market data
   - Use the **AI Assistant** to ask questions about the market
   - Click **"Generate Content"** to auto-fill sections

### In Financial Projections

1. Navigate to **Financial Projections**
2. Scroll to **"AI Financial Advisor"** section
3. Ask questions like:
   - "What are the biggest risks in my financial plan?"
   - "How can I improve my profit margins?"
   - "Is my break-even point realistic?"
   - "What should I focus on to reduce costs?"

### Quick Actions Available

- **Generate Content**: AI writes a complete section based on your inputs
- **Auto-Fill**: Completes missing fields intelligently
- **Research Market**: Gets market data and insights
- **Improve Content**: Suggests improvements to existing content

## AI Features by Section

### Business Plan Sections
- **Executive Summary**: Generate compelling summaries
- **Market Analysis**: Research market data, demographics, trends
- **Competitive Analysis**: Analyze competitors and positioning
- **Marketing Strategy**: Develop marketing plans
- **Operations Plan**: Create operations procedures
- **Management Team**: Define team structure

### Financial Planning
- **Financial Recommendations**: Get AI analysis of your projections
- **Risk Assessment**: Identify financial risks
- **Cost Optimization**: Suggestions to reduce costs
- **Revenue Enhancement**: Ideas to increase revenue

## Cost Considerations

### OpenAI Pricing (GPT-4 Turbo)
- **Input**: ~$10 per 1M tokens
- **Output**: ~$30 per 1M tokens
- **Typical usage**: $0.01-0.10 per research query
- **Monthly estimate**: $5-20 for moderate use

### Anthropic Pricing (Claude Opus)
- **Input**: ~$15 per 1M tokens
- **Output**: ~$75 per 1M tokens
- **Typical usage**: $0.02-0.15 per research query
- **Monthly estimate**: $10-30 for moderate use

**Tip**: Start with OpenAI for lower costs, or use Anthropic for more advanced reasoning.

## Troubleshooting

### "AI API key not configured" Error

**Solution**: 
1. Check that `.env.local` exists in the project root
2. Verify the API key is correct (no extra spaces)
3. Restart your development server
4. Make sure the variable name matches exactly: `REACT_APP_OPENAI_API_KEY` or `REACT_APP_ANTHROPIC_API_KEY`

### "API request failed" Error

**Possible causes:**
1. **Invalid API key**: Check that your key is correct
2. **No credits**: Add credits to your OpenAI/Anthropic account
3. **Rate limit**: You've exceeded API rate limits (wait a few minutes)
4. **Network issue**: Check your internet connection

### AI Responses Are Slow

**Solutions:**
- This is normal - AI processing takes 5-15 seconds
- Use shorter, more specific questions for faster responses
- Consider using GPT-3.5-turbo for faster (but less capable) responses

## Security Notes

⚠️ **Important Security Rempts:**

1. **Never commit `.env.local` to Git** - It's already in `.gitignore`
2. **Don't share your API key** - Keep it private
3. **Monitor usage** - Check your API dashboard regularly
4. **Set usage limits** - Configure spending limits in your API provider dashboard

## Best Practices

1. **Be Specific**: More specific questions get better answers
   - ❌ "Tell me about restaurants"
   - ✅ "What are the average food costs for a fast-casual restaurant in Boston?"

2. **Provide Context**: Include relevant information in your questions
   - ✅ "I'm opening a 50-seat Italian restaurant in Back Bay with $500K startup budget. What should I know?"

3. **Review AI Content**: Always review and edit AI-generated content
   - AI provides a great starting point, but you should customize it

4. **Use for Research**: AI is excellent for research and suggestions
   - Use it to fill gaps, not replace your own knowledge

## Example Prompts

### Market Research
- "What are the demographics of Back Bay, Boston?"
- "What's the average rent per square foot in Cambridge?"
- "What are the current restaurant trends in Boston?"

### Financial Analysis
- "Analyze my financial projections and identify risks"
- "How does my food cost percentage compare to industry standards?"
- "What's a realistic break-even timeline for my restaurant?"

### Business Planning
- "Write an executive summary for a farm-to-table restaurant in Somerville"
- "What should I include in my competitive analysis?"
- "Develop a marketing strategy for a new restaurant opening"

## Next Steps

Once AI is set up, you can:
1. Use it to auto-fill empty sections
2. Research market data for your location
3. Get financial recommendations
4. Ask questions as you build your plan
5. Improve existing content with AI suggestions

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your API key is valid and has credits
3. Check the browser console for detailed error messages
4. Ensure you're using the latest version of the app

---

**Ready to get started?** Add your API key to `.env.local` and restart your development server!

