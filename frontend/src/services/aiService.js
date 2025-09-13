import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'your-api-key-here')

class AIService {
  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    })
  }

  // Generate property recommendations based on user behavior
  async generatePropertyRecommendations(userActivity) {
    try {
      const prompt = `Based on this user's rental property activity: ${JSON.stringify(userActivity)}, 
      suggest 3 personalized property recommendations. Focus on location preferences, budget range, 
      and property types they've shown interest in. Return as JSON array with title, description, and action.`
      
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return JSON.parse(response.text())
    } catch (error) {
      console.error('AI recommendation error:', error)
      return this.getFallbackRecommendations()
    }
  }

  // Natural language search processing
  async processNaturalLanguageSearch(query) {
    try {
      const prompt = `Convert this natural language property search into structured filters: "${query}"
      Return JSON with: location, minPrice, maxPrice, bhk, propertyType, amenities, special_requirements.
      Example: "2BHK near IT parks under 25k" -> {"bhk": "2", "location": "IT parks", "maxPrice": 25000}`
      
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return JSON.parse(response.text())
    } catch (error) {
      console.error('Natural language processing error:', error)
      return { query: query } // Fallback to original query
    }
  }

  // Generate role-based suggestions
  async generateRoleSuggestions(userBehavior) {
    try {
      const prompt = `Based on user behavior: ${JSON.stringify(userBehavior)}, 
      determine if they're more likely to be a tenant, landlord, or still exploring. 
      Return JSON with role_likelihood (tenant/landlord/exploring) and 3 personalized suggestions.`
      
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return JSON.parse(response.text())
    } catch (error) {
      console.error('Role suggestion error:', error)
      return this.getFallbackRoleSuggestions()
    }
  }

  // Smart activity insights
  async generateActivityInsights(recentActivity) {
    try {
      const prompt = `Analyze this user's recent rental activity: ${JSON.stringify(recentActivity)}
      Generate 3 actionable insights or tips. Keep responses helpful and encouraging.
      Return as JSON array with insight text and suggested action.`
      
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return JSON.parse(response.text())
    } catch (error) {
      console.error('Activity insights error:', error)
      return this.getFallbackInsights()
    }
  }

  // Fallback recommendations when AI fails
  getFallbackRecommendations() {
    return [
      {
        title: "Explore Popular Areas",
        description: "Check out trending neighborhoods in your city",
        action: "browse_areas"
      },
      {
        title: "Set Price Alerts",
        description: "Get notified when properties in your budget become available",
        action: "set_alerts"
      },
      {
        title: "Save Your Searches",
        description: "Keep track of your favorite property searches",
        action: "save_search"
      }
    ]
  }

  getFallbackRoleSuggestions() {
    return {
      role_likelihood: "exploring",
      suggestions: [
        "Continue browsing to find your perfect match",
        "Save properties you like for easy comparison",
        "Connect with property owners through messages"
      ]
    }
  }

  getFallbackInsights() {
    return [
      {
        insight: "You've been actively searching - great job!",
        action: "Keep exploring different areas to find the best options"
      },
      {
        insight: "Consider setting up alerts for new properties",
        action: "Never miss out on great deals in your preferred locations"
      },
      {
        insight: "Your search activity shows you're serious about finding a home",
        action: "Reach out to property owners to schedule visits"
      }
    ]
  }
}

export default new AIService()