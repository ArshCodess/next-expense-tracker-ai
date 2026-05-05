import { GoogleGenAI } from '@google/genai';
const ai_model = 'google/gemma-4-31b-it:free'
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
interface RawInsight {
  type?: string;
  title?: string;
  message?: string;
  action?: string;
  confidence?: number;
}


export interface ExpenseRecord {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  action?: string;
  confidence: number;
}

export async function generateExpenseInsights(
  expenses: ExpenseRecord[]
): Promise<AIInsight[]> {
  try {
    // Prepare expense data for AI analysis
    const expensesSummary = expenses.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `Analyze the following expense data and provide 3-4 actionable financial insights. 
    Return a JSON array of insights with this structure:
    {
      "type": "warning|info|success|tip",
      "title": "Brief title",
      "message": "Detailed insight message with specific numbers when possible",
      "action": "Actionable suggestion",
      "confidence": 0.8
    }

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}

    Focus on:
    1. Spending patterns (day of week, categories)
    2. Budget alerts (high spending areas)
    3. Money-saving opportunities
    4. Positive reinforcement for good habits

    Return only valid JSON array, no additional text.`;
    const completion = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: 'You are an Indian financial advisor AI that analyzes spending patterns and provides actionable insights. Always respond with valid JSON only.',
      },
    });

    const response = completion.text;
    if (!response) {
      throw new Error('No response from AI');
    }
    console.log('✅ AI response received:', response);

    // Clean the response by removing markdown code blocks if present
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '');
    }

    // Parse AI response
    const insights = JSON.parse(cleanedResponse);


    // Add IDs and ensure proper format
    const formattedInsights = insights.map(
      (insight: RawInsight, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        type: insight.type || 'info',
        title: insight.title || 'AI Insight',
        message: insight.message || 'Analysis complete',
        action: insight.action,
        confidence: insight.confidence || 0.8,
      })
    );

    return formattedInsights;
  } catch (error) {
    console.error('❌ Error generating AI insights:', error);
    const er = error?.toString() || "";
    if (er.includes("429 Rate limit exceeded")) {
      console.log("Rate really exceeded trying model2");
      // Fallback to mock insights if AI fails
      return [
        {
          id: 'fallback-2',
          type: 'info',
          title: 'AI Analysis unavialable due to RATE LIMIT',
          message:
            'Unable to generate personalized insights today🙁. Please try again later.',
          action: 'Refresh insights',
          confidence: 0.5,
        },
      ];
    }

    // Fallback to mock insights if AI fails
    return [
      {
        id: 'fallback-1',
        type: 'info',
        title: 'AI Analysis Unavailable',
        message:
          'Unable to generate personalized insights at this time. Please try again later.',
        action: 'Refresh insights',
        confidence: 0.5,
      },
    ];
  }
}

export async function categorizeExpense(description: string): Promise<string> {
  try {
    const completion = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Categorize this expense ${description}`,
      config: {
        systemInstruction: 'You are an expense categorization AI. Categorize expenses into one of these categories: Food, Transportation, Entertainment, Shopping, Bills, Healthcare, Other. Respond with only the category name.',
        maxOutputTokens: 10,
        temperature: 0.7,
      },
    });

    const category = completion.text?.trim();

    const validCategories = [
      'Food',
      'Transportation',
      'Entertainment',
      'Shopping',
      'Bills',
      'Healthcare',
      'Other',
    ];

    const finalCategory = validCategories.includes(category || '')
      ? category!
      : 'Other';
    return finalCategory;
  } catch (error) {
    console.error('❌ Error categorizing expense:', error);
    return 'Other';
  }
}

export async function generateAIAnswer(
  question: string,
  context: ExpenseRecord[]
): Promise<string> {
  try {
    const expensesSummary = context.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `Based on the following expense data (amount is in rupee), provide a detailed and actionable answer to this question: "${question}"

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}

    Provide a comprehensive answer that:
    1. Addresses the specific question directly
    2. Uses concrete data from the expenses when possible
    3. Offers actionable advice
    4. Keeps the response concise but informative (2-3 sentences)
    
    Return only the answer text, no additional formatting.`;
    const sysPrompt = 'You are a helpful financial advisor AI that provides specific, actionable answers based on expense data. Be concise but thorough.';

    const completion = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: sysPrompt,
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });
    const response = completion.text;
    if (!response) {
      throw new Error('No response from AI');
    }

    return response.trim();
  } catch (error) {
    console.error('❌ Error generating AI answer:', error);
    return "I'm unable to provide a detailed answer at the moment. Please try refreshing the insights or check your connection.";
  }
}