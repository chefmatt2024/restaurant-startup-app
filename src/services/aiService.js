// AI Service for Restaurant Business Planning
// Supports OpenAI and Anthropic Claude APIs

class AIService {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || process.env.REACT_APP_ANTHROPIC_API_KEY;
    this.provider = process.env.REACT_APP_AI_PROVIDER || 'openai'; // 'openai' or 'anthropic'
    this.baseUrl = this.provider === 'openai' 
      ? 'https://api.openai.com/v1'
      : 'https://api.anthropic.com/v1';
  }

  async makeRequest(endpoint, data) {
    if (!this.apiKey) {
      throw new Error('AI API key not configured. Please add REACT_APP_OPENAI_API_KEY or REACT_APP_ANTHROPIC_API_KEY to your .env.local file');
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.provider === 'openai') {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    } else {
      headers['x-api-key'] = this.apiKey;
      headers['anthropic-version'] = '2023-06-01';
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  async generateCompletion(prompt, options = {}) {
    const {
      maxTokens = 2000,
      temperature = 0.7,
      systemPrompt = null,
    } = options;

    if (this.provider === 'openai') {
      const messages = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-4-turbo-preview',
        messages,
        max_tokens: maxTokens,
        temperature,
      });

      return response.choices[0].message.content;
    } else {
      // Anthropic Claude
      const messages = [{ role: 'user', content: prompt }];
      
      const requestBody = {
        model: 'claude-3-opus-20240229',
        max_tokens: maxTokens,
        temperature,
        messages,
      };

      if (systemPrompt) {
        requestBody.system = systemPrompt;
      }

      const response = await this.makeRequest('/messages', requestBody);
      return response.content[0].text;
    }
  }

  // Restaurant-specific AI helpers
  async generateBusinessPlanSection(section, context = {}) {
    const systemPrompt = `You are an expert restaurant business consultant with 20+ years of experience opening successful restaurants. You specialize in helping entrepreneurs create comprehensive, realistic business plans. Always provide practical, actionable advice based on real-world experience.`;

    const prompts = {
      executiveSummary: `Write a compelling executive summary for a restaurant business plan. Include:
- Restaurant concept: ${context.concept || 'Not specified'}
- Location: ${context.location || 'Not specified'}
- Target market: ${context.targetMarket || 'Not specified'}
- Unique value proposition
- Financial highlights
- Key success factors

Make it professional, concise, and investor-ready.`,

      marketAnalysis: `Conduct a comprehensive market analysis for a restaurant in ${context.location || 'Boston'}. Include:
- Market size and growth trends
- Target demographic analysis
- Competitive landscape
- Market opportunities
- Industry trends affecting restaurants
- Local market conditions

Provide specific, actionable insights.`,

      competitiveAnalysis: `Analyze the competitive landscape for a ${context.concept || 'restaurant'} in ${context.location || 'Boston'}. Include:
- Direct competitors
- Indirect competitors
- Competitive advantages
- Market positioning opportunities
- Pricing strategies
- Differentiation strategies

Be specific and practical.`,

      marketingStrategy: `Develop a comprehensive marketing strategy for a ${context.concept || 'restaurant'} opening in ${context.location || 'Boston'}. Include:
- Pre-opening marketing tactics
- Grand opening strategy
- Ongoing marketing channels
- Social media strategy
- Community engagement
- Customer retention strategies
- Budget allocation recommendations

Focus on cost-effective, high-impact strategies.`,

      operationsPlan: `Create a detailed operations plan for a ${context.concept || 'restaurant'}. Include:
- Daily operations procedures
- Staffing structure and schedules
- Kitchen operations
- Front-of-house operations
- Quality control measures
- Supplier relationships
- Inventory management
- Health and safety protocols

Be specific and practical.`,

      managementTeam: `Describe the ideal management team structure for a ${context.concept || 'restaurant'}. Include:
- Key positions needed
- Required qualifications and experience
- Responsibilities for each role
- Compensation structure recommendations
- Hiring timeline
- Training requirements

Be realistic about staffing needs.`,
    };

    const prompt = prompts[section] || `Generate content for the ${section} section of a restaurant business plan. Context: ${JSON.stringify(context)}`;

    return await this.generateCompletion(prompt, {
      systemPrompt,
      maxTokens: 2500,
      temperature: 0.7,
    });
  }

  async researchMarketData(location, restaurantType) {
    const systemPrompt = `You are a restaurant market research expert. Provide accurate, current market data and insights.`;

    const prompt = `Research and provide current market data for a ${restaurantType || 'restaurant'} in ${location || 'Boston'}. Include:
- Average rent per square foot
- Labor costs and wage rates
- Food cost percentages
- Average check sizes
- Occupancy rates
- Table turnover rates
- Market trends and growth projections
- Demographics and target market data

Provide specific numbers and cite general industry standards when specific data isn't available.`;

    return await this.generateCompletion(prompt, {
      systemPrompt,
      maxTokens: 2000,
      temperature: 0.5,
    });
  }

  async generateFinancialRecommendations(financialData) {
    const systemPrompt = `You are a restaurant financial consultant. Analyze financial projections and provide actionable recommendations to improve profitability and reduce risk.`;

    const prompt = `Analyze these restaurant financial projections and provide recommendations:
${JSON.stringify(financialData, null, 2)}

Provide:
1. Risk assessment (high/medium/low risk areas)
2. Cost optimization opportunities
3. Revenue enhancement suggestions
4. Break-even analysis insights
5. Funding recommendations
6. Red flags to address

Be specific and actionable.`;

    return await this.generateCompletion(prompt, {
      systemPrompt,
      maxTokens: 2000,
      temperature: 0.6,
    });
  }

  async autoFillFormSection(section, existingData = {}) {
    const systemPrompt = `You are helping a restaurant entrepreneur fill out their business plan. Use the existing data provided and intelligently complete missing fields with realistic, professional content.`;

    const prompt = `Based on this existing business plan data, intelligently complete the ${section} section:
${JSON.stringify(existingData, null, 2)}

Fill in any missing or incomplete fields with realistic, professional content that matches the restaurant concept and style. Maintain consistency with existing information.`;

    return await this.generateCompletion(prompt, {
      systemPrompt,
      maxTokens: 2000,
      temperature: 0.7,
    });
  }

  async generateCompetitorAnalysis(competitors, location) {
    const systemPrompt = `You are a competitive analysis expert. Analyze restaurant competitors and provide strategic insights.`;

    const prompt = `Analyze these competitors for a restaurant in ${location || 'Boston'}:
${JSON.stringify(competitors, null, 2)}

Provide:
- Competitive positioning analysis
- Strengths and weaknesses of each competitor
- Market gaps and opportunities
- Differentiation strategies
- Pricing recommendations
- Marketing positioning suggestions

Be strategic and actionable.`;

    return await this.generateCompletion(prompt, {
      systemPrompt,
      maxTokens: 2000,
      temperature: 0.6,
    });
  }

  async suggestImprovements(content, section) {
    const systemPrompt = `You are a business plan reviewer. Provide constructive feedback and suggestions to improve business plan content.`;

    const prompt = `Review this ${section} section content and provide improvement suggestions:
${content}

Provide:
- Strengths of the current content
- Areas for improvement
- Specific suggestions to enhance clarity, professionalism, and impact
- Missing elements that should be included
- Ways to make it more compelling to investors

Be constructive and specific.`;

    return await this.generateCompletion(prompt, {
      systemPrompt,
      maxTokens: 1500,
      temperature: 0.7,
    });
  }

  async answerQuestion(question, context = {}) {
    const systemPrompt = `You are an expert restaurant consultant. Answer questions based on real-world experience opening and operating restaurants.`;

    const contextStr = Object.keys(context).length > 0 
      ? `\n\nContext about this restaurant:\n${JSON.stringify(context, null, 2)}`
      : '';

    const prompt = `${question}${contextStr}

Provide a comprehensive, practical answer based on real restaurant industry experience.`;

    return await this.generateCompletion(prompt, {
      systemPrompt,
      maxTokens: 1500,
      temperature: 0.7,
    });
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export helper functions
export const generateBusinessPlanSection = (section, context) => 
  aiService.generateBusinessPlanSection(section, context);

export const researchMarketData = (location, restaurantType) => 
  aiService.researchMarketData(location, restaurantType);

export const generateFinancialRecommendations = (financialData) => 
  aiService.generateFinancialRecommendations(financialData);

export const autoFillFormSection = (section, existingData) => 
  aiService.autoFillFormSection(section, existingData);

export const generateCompetitorAnalysis = (competitors, location) => 
  aiService.generateCompetitorAnalysis(competitors, location);

export const suggestImprovements = (content, section) => 
  aiService.suggestImprovements(content, section);

export const answerQuestion = (question, context) => 
  aiService.answerQuestion(question, context);

