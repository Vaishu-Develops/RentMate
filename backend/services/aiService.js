const axios = require('axios')

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
  }

  async generateContent(prompt, options = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: options.temperature || 0.7,
            topK: options.topK || 40,
            topP: options.topP || 0.95,
            maxOutputTokens: options.maxOutputTokens || 1024,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.data.candidates[0].content.parts[0].text
      } else {
        throw new Error('Invalid response from AI service')
      }
    } catch (error) {
      console.error('AI Service Error:', error.response?.data || error.message)
      throw new Error('Failed to generate AI content')
    }
  }

  async generatePropertyDescription(propertyData) {
    const prompt = `
Generate a professional property listing description for the Indian rental market:

Property Details:
- Type: ${propertyData.type}
- Configuration: ${propertyData.bhkType}
- Area: ${propertyData.carpetArea} sqft
- Location: ${propertyData.area}, ${propertyData.city}
- Floor: ${propertyData.floor}/${propertyData.totalFloors}
- Furnishing: ${propertyData.furnishingStatus}
- Amenities: ${propertyData.amenities?.join(', ') || 'Basic amenities'}
- Rent: ₹${propertyData.monthlyRent}/month
- Preferences: ${propertyData.tenantPreferences?.occupantType || 'Any'}

Requirements:
- Professional yet approachable tone
- Highlight unique selling points
- Include location benefits
- Appeal to target tenant type
- 150-200 words length
- Use Indian rental market language
- Focus on lifestyle and convenience
- Mention nearby facilities if location is well-known

Generate only the description text, no additional formatting or labels.
`

    try {
      const description = await this.generateContent(prompt, {
        temperature: 0.8,
        maxOutputTokens: 300
      })
      
      return description.trim()
    } catch (error) {
      console.error('Property description generation failed:', error)
      return this.getFallbackDescription(propertyData)
    }
  }

  async screenTenant(applicationData) {
    const prompt = `
Analyze this rental application and provide an AI screening summary:

Applicant Information:
- Age: ${applicationData.age || 'Not provided'}
- Occupation: ${applicationData.occupation}
- Company: ${applicationData.company}
- Monthly Income: ₹${applicationData.monthlyIncome}
- Work Experience: ${applicationData.workExperience} years
- Employment Type: ${applicationData.employmentType}

Property Details:
- Monthly Rent: ₹${applicationData.propertyRent}
- Property Type: ${applicationData.propertyType}
- Location: ${applicationData.propertyLocation}

Previous Rental History:
${applicationData.rentalHistory || 'No previous rental history provided'}

Application Message:
"${applicationData.message}"

Provide a screening summary with:
1. Overall recommendation (HIGHLY RECOMMENDED/RECOMMENDED/CONSIDER WITH CAUTION/NOT RECOMMENDED)
2. Risk score (1-10, where 10 is lowest risk)
3. Key strengths (2-3 points)
4. Considerations or concerns (1-2 points if any)
5. Brief analysis (2-3 sentences)

Focus on:
- Income to rent ratio (ideal is 3x or more)
- Employment stability
- Communication quality
- Previous rental behavior
- Overall financial reliability

Keep the response professional, unbiased, and helpful for landlord decision-making.
Format as a structured summary, not bullet points.
`

    try {
      const screening = await this.generateContent(prompt, {
        temperature: 0.6,
        maxOutputTokens: 400
      })
      
      return screening.trim()
    } catch (error) {
      console.error('Tenant screening failed:', error)
      return this.getFallbackScreening(applicationData)
    }
  }

  async generateLease(leaseData) {
    const prompt = `
Generate custom lease agreement clauses for this rental property in India:

Property Information:
- Type: ${leaseData.propertyType}
- Location: ${leaseData.propertyLocation}
- Monthly Rent: ₹${leaseData.monthlyRent}
- Security Deposit: ₹${leaseData.securityDeposit}
- Lease Duration: ${leaseData.leaseDuration} months

Tenant Preferences:
- Pet Policy: ${leaseData.petPolicy}
- Smoking Policy: ${leaseData.smokingPolicy}
- Maintenance Responsibility: ${leaseData.maintenancePolicy}

Special Conditions:
${leaseData.specialConditions || 'None specified'}

Generate specific clauses for:
1. Rent payment terms and due dates
2. Security deposit conditions
3. Maintenance responsibilities
4. Pet and smoking policies
5. Early termination conditions
6. Property usage restrictions
7. Renewal terms

Make clauses:
- Legally sound for Indian rental laws
- Clear and unambiguous
- Fair to both parties
- Specific to the property type and location
- Include relevant Indian legal references

Format as numbered clauses ready for inclusion in a lease agreement.
`

    try {
      const clauses = await this.generateContent(prompt, {
        temperature: 0.5,
        maxOutputTokens: 800
      })
      
      return clauses.trim()
    } catch (error) {
      console.error('Lease generation failed:', error)
      return this.getFallbackLease(leaseData)
    }
  }

  async explainClause(clause) {
    const prompt = `
Explain this lease agreement clause in simple, easy-to-understand language for Indian tenants:

Clause: "${clause}"

Provide:
1. Simple explanation in everyday language
2. What it means for the tenant
3. A practical example if helpful
4. Any important things to note

Keep the explanation:
- Simple and clear
- Non-technical
- Helpful and informative
- Relevant to Indian rental context
- Under 150 words

Format as a friendly explanation, not legal advice.
`

    try {
      const explanation = await this.generateContent(prompt, {
        temperature: 0.7,
        maxOutputTokens: 200
      })
      
      return explanation.trim()
    } catch (error) {
      console.error('Clause explanation failed:', error)
      return 'Unable to explain this clause at the moment. Please consult with the property owner or a legal advisor for clarification.'
    }
  }

  async suggestRent(propertyData) {
    const prompt = `
Suggest appropriate rental pricing for this property in the Indian market:

Property Details:
- Type: ${propertyData.type}
- Configuration: ${propertyData.bhkType}
- Area: ${propertyData.carpetArea} sqft
- Location: ${propertyData.area}, ${propertyData.city}
- Floor: ${propertyData.floor}/${propertyData.totalFloors}
- Furnishing: ${propertyData.furnishingStatus}
- Age: ${propertyData.ageOfProperty} years
- Amenities: ${propertyData.amenities?.join(', ') || 'Basic'}

Market Context:
- City: ${propertyData.city} (consider local market rates)
- Area: ${propertyData.area} (consider locality premium)

Provide:
1. Suggested rent range (minimum to maximum)
2. Recommended rent (single amount)
3. Rent per sqft calculation
4. Market positioning (budget/mid-range/premium)
5. Brief justification (2-3 sentences)

Consider:
- Location desirability
- Property condition and age
- Amenities and facilities
- Current market trends in ${propertyData.city}
- Furnishing status impact

Format as a structured pricing recommendation.
`

    try {
      const suggestion = await this.generateContent(prompt, {
        temperature: 0.6,
        maxOutputTokens: 300
      })
      
      return suggestion.trim()
    } catch (error) {
      console.error('Rent suggestion failed:', error)
      return this.getFallbackRentSuggestion(propertyData)
    }
  }

  // Fallback methods for when AI service fails
  getFallbackDescription(propertyData) {
    const { type, bhkType, carpetArea, area, city, furnishingStatus } = propertyData
    
    return `Beautiful ${bhkType} ${type} available for rent in ${area}, ${city}. This well-maintained property offers ${carpetArea} sqft of comfortable living space with ${furnishingStatus.replace('_', ' ')} interiors. Located in a prime area with easy access to essential amenities, transportation, and commercial hubs. Perfect for families and working professionals looking for a convenient and comfortable home. The property features modern amenities and is ready for immediate occupancy.`
  }

  getFallbackScreening(applicationData) {
    const incomeRatio = applicationData.monthlyIncome / applicationData.propertyRent
    let recommendation = 'CONSIDER WITH CAUTION'
    let riskScore = 5

    if (incomeRatio >= 4) {
      recommendation = 'HIGHLY RECOMMENDED'
      riskScore = 8
    } else if (incomeRatio >= 3) {
      recommendation = 'RECOMMENDED'
      riskScore = 7
    }

    return `${recommendation}
Risk Score: ${riskScore}/10

This applicant shows ${incomeRatio >= 3 ? 'good' : 'adequate'} financial stability with an income-to-rent ratio of ${incomeRatio.toFixed(1)}x. ${applicationData.workExperience >= 2 ? 'Stable employment history indicates reliability.' : 'Employment experience should be considered.'} 

Key Strengths: Professional background, ${incomeRatio >= 3 ? 'strong income ratio' : 'adequate income'}, clear communication.

Considerations: ${incomeRatio < 3 ? 'Income ratio below ideal 3x threshold. ' : ''}Recommend verification of employment and previous rental references.`
  }

  getFallbackLease(leaseData) {
    return `1. RENT PAYMENT: Monthly rent of ₹${leaseData.monthlyRent} shall be paid by the 5th of each month.

2. SECURITY DEPOSIT: Security deposit of ₹${leaseData.securityDeposit} shall be refunded within 45 days of lease termination, subject to property condition.

3. MAINTENANCE: Tenant responsible for minor repairs under ₹500. Major repairs and structural issues are landlord's responsibility.

4. PETS: ${leaseData.petPolicy === 'allowed' ? 'Pets are allowed with prior written consent.' : 'Pets are not permitted on the premises.'}

5. EARLY TERMINATION: Either party may terminate with 30 days written notice. Early termination by tenant may result in forfeiture of security deposit.

6. PROPERTY USE: Property to be used solely for residential purposes. Commercial activities are prohibited.

7. RENEWAL: Lease may be renewed by mutual consent with rent revision as per market rates.`
  }

  getFallbackRentSuggestion(propertyData) {
    // Basic calculation based on area and city
    const baseRate = propertyData.city.toLowerCase().includes('coimbatore') ? 15 : 20
    const suggestedRent = Math.round(propertyData.carpetArea * baseRate)
    const minRent = Math.round(suggestedRent * 0.9)
    const maxRent = Math.round(suggestedRent * 1.1)

    return `Suggested Rent Range: ₹${minRent.toLocaleString()} - ₹${maxRent.toLocaleString()}
Recommended Rent: ₹${suggestedRent.toLocaleString()}
Rate per sqft: ₹${baseRate}
Market Position: Mid-range

This pricing is based on current market rates in ${propertyData.city} for similar ${propertyData.bhkType} properties. The rate considers the property's location, size, and amenities to ensure competitive positioning in the local rental market.`
  }
}

module.exports = new AIService()