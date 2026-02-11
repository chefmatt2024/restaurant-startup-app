// AI Service for Restaurant Business Planning
// Routes through Firebase Cloud Functions to avoid CORS and protect API keys
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { getApp } from 'firebase/app';

class AIService {
  constructor() {
    this.provider = 'openai'; // 'openai' or 'anthropic'
    this.functions = null;
    this.generateAICompletion = null;
    
    // Initialize Firebase Functions
    this.initializeFunctions();
  }

  initializeFunctions() {
    try {
      const app = getApp();
      this.functions = getFunctions(app);
      
      // Connect to emulator in development if needed
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_FUNCTIONS_EMULATOR === 'true') {
        connectFunctionsEmulator(this.functions, 'localhost', 5001);
      }
      
      this.generateAICompletion = httpsCallable(this.functions, 'generateAICompletion');
    } catch (error) {
      console.warn('Firebase Functions not initialized. AI features will be unavailable.', error);
    }
  }

  async makeRequest(endpoint, data) {
    // This method is deprecated - use Firebase Functions instead
    // Keeping for backward compatibility but will route through Firebase Functions
    throw new Error('Direct API calls are not supported. Please use generateCompletion which routes through Firebase Functions.');
  }

  async generateCompletion(prompt, options = {}) {
    if (!this.generateAICompletion) {
      throw new Error('Firebase Functions not initialized. AI features are unavailable. Please ensure Firebase is properly configured.');
    }

    const {
      maxTokens = 2000,
      temperature = 0.7,
      systemPrompt = null,
      provider = this.provider
    } = options;

    try {
      const result = await this.generateAICompletion({
        prompt,
        options: {
          maxTokens,
          temperature,
          systemPrompt,
          provider
        }
      });

      return result.data.content;
    } catch (error) {
      // Handle Firebase Functions errors
      let errorMessage = 'Failed to generate AI completion.';
      
      if (error.code === 'functions/unauthenticated') {
        errorMessage = 'You must be signed in to use AI features.';
      } else if (error.code === 'functions/failed-precondition') {
        errorMessage = error.message || 'AI API key not configured on the server. Please contact support.';
      } else if (error.code === 'functions/resource-exhausted') {
        errorMessage = error.message || 'AI service quota exceeded. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
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

