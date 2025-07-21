const { VertexAI, FunctionDeclarationSchemaType } = require('@google-cloud/vertexai');
const config = require('../config');

class GoogleApiService {
  constructor() {
    this.mockMode = false; // Set to false to use real Google Cloud API
    this.projectId = config.vertexAI.projectId;
    this.location = config.vertexAI.location;
    this.model = config.vertexAI.model;
    
    // Initialize Vertex AI
    this.vertexAI = new VertexAI({
      project: this.projectId,
      location: this.location
    });
    
    this.generativeModel = this.vertexAI.getGenerativeModel({
      model: this.model
    });
  }

  /**
   * Call Google Cloud API with function calling capabilities
   * @param {string} userInput - The user's input text
   * @param {string} language - Optional language/locale
   * @returns {Promise<Object>} - The parsed instruction response
   */
  async processInstruction(userInput, language = 'en') {
    try {
      if (this.mockMode) {
        return this.mockProcessInstruction(userInput, language);
      }

      // Build the function calling schema
      const functionDeclarations = this.buildFunctionSchema();
      
      // Prepare the prompt with language context
      const prompt = this.buildPrompt(userInput, language);
      
      // Make the API call using Vertex AI SDK
      const response = await this.callVertexAI(prompt, functionDeclarations);
      
      // Parse the response
      return this.parseResponse(response);
    } catch (error) {
      console.error('Vertex AI Error:', error);
      // Fallback to mock mode if Vertex AI fails
      console.log('Falling back to mock mode');
      return this.mockProcessInstruction(userInput, language);
    }
  }

  /**
   * Build the function schema for available instructions
   * @returns {Array} - Array of function definitions
   */
  buildFunctionSchema() {
    return [
      {
        name: 'navigate_home',
        description: 'Navigate to the home page',
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {},
          required: []
        }
      },
      {
        name: 'navigate_about',
        description: 'Navigate to the about page',
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {},
          required: []
        }
      },
      {
        name: 'navigate_contact',
        description: 'Navigate to the contact page',
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {},
          required: []
        }
      },
      {
        name: 'toggle_voice_input',
        description: 'Switch to voice input mode',
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {},
          required: []
        }
      },
      {
        name: 'toggle_text_input',
        description: 'Switch to text input mode',
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {},
          required: []
        }
      },
      {
        name: 'clear_input',
        description: 'Clear current input and reset state',
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {},
          required: []
        }
      },
      {
        name: 'show_help',
        description: 'Show available commands and features',
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {},
          required: []
        }
      },
      {
        name: 'enter_quantity',
        description: 'Enter a specific quantity value',
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            quantity: {
              type: FunctionDeclarationSchemaType.NUMBER,
              description: 'The quantity value to enter'
            }
          },
          required: ['quantity']
        }
      },
      {
        name: 'open_inventory',
        description: 'Open the inventory or product list',
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {},
          required: []
        }
      },
      {
        name: 'go_back',
        description: 'Navigate back to the previous page',
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {},
          required: []
        }
      },
      {
        name: 'open_settings',
        description: 'Open settings or configuration page',
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {},
          required: []
        }
      },
      {
        name: 'open_cart',
        description: 'Open shopping cart or basket',
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {},
          required: []
        }
      }
    ];
  }

  /**
   * Build the prompt with language context
   * @param {string} userInput - User input text
   * @param {string} language - Language code
   * @returns {string} - Formatted prompt
   */
  buildPrompt(userInput, language) {
    const languageContext = this.getLanguageContext(language);
    
    return `${languageContext}

You are an AI assistant that maps user voice/text input to specific frontend instructions. 
The user has provided the following input: "${userInput}"

Please analyze this input and determine which instruction it maps to. Consider:
- Different phrasings and synonyms
- Multiple languages and accents
- Numeric values (spoken or written)
- Context and intent

Available functions:
- navigate_home: For requests to go to home page, main page, start page
- navigate_about: For requests to go to about page, information page, details page
- navigate_contact: For requests to go to contact page, help page, support page
- toggle_voice_input: For requests to switch to voice input mode, microphone mode
- toggle_text_input: For requests to switch to text input mode, keyboard mode
- clear_input: For requests to clear, reset, or clean the current input
- show_help: For requests to show help, commands, or available features
- enter_quantity: For requests involving numbers or quantities (extract the number)
- open_inventory: For requests to open inventory, products, or items
- go_back: For requests to go back, return, or navigate to previous page
- open_settings: For requests to open settings, configuration, or preferences
- open_cart: For requests to open cart, basket, or shopping

Return the most appropriate function call with any required parameters.`;
  }

  /**
   * Get language-specific context
   * @param {string} language - Language code
   * @returns {string} - Language context
   */
  getLanguageContext(language) {
    const contexts = {
      'en': 'The user is speaking in English.',
      'es': 'The user is speaking in Spanish. Translate and map to English instructions.',
      'fr': 'The user is speaking in French. Translate and map to English instructions.',
      'de': 'The user is speaking in German. Translate and map to English instructions.',
      'it': 'The user is speaking in Italian. Translate and map to English instructions.',
      'pt': 'The user is speaking in Portuguese. Translate and map to English instructions.',
      'ru': 'The user is speaking in Russian. Translate and map to English instructions.',
      'zh': 'The user is speaking in Chinese. Translate and map to English instructions.',
      'ja': 'The user is speaking in Japanese. Translate and map to English instructions.',
      'ko': 'The user is speaking in Korean. Translate and map to English instructions.',
      'ar': 'The user is speaking in Arabic. Translate and map to English instructions.',
      'hi': 'The user is speaking in Hindi. Translate and map to English instructions.'
    };
    
    return contexts[language] || contexts['en'];
  }

  /**
   * Call the Vertex AI API using the SDK
   * @param {string} prompt - The prompt to send
   * @param {Array} functionDeclarations - Function declarations
   * @returns {Promise<Object>} - API response
   */
  async callVertexAI(prompt, functionDeclarations) {
    const request = {
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      tools: [{
        functionDeclarations: functionDeclarations
      }],
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 1,
        maxOutputTokens: 1024
      }
    };

    console.log('Making API call to Vertex AI:', {
      projectId: this.projectId,
      location: this.location,
      model: this.model,
      tools: functionDeclarations.length,
      promptLength: prompt.length
    });

    const response = await this.generativeModel.generateContent(request);
    console.log('Vertex AI Response received');
    return response;
  }

  /**
   * Parse the Vertex AI response
   * @param {Object} response - API response
   * @returns {Object} - Parsed instruction
   */
  parseResponse(response) {
    try {
      console.log('Parsing Vertex AI response:', JSON.stringify(response, null, 2));
      
      if (!response.response || !response.response.candidates || !response.response.candidates[0]) {
        console.error('Invalid response structure:', response);
        return this.getDefaultErrorResponse();
      }

      const candidate = response.response.candidates[0];
      
      // Check if function calling was used
      if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
        const part = candidate.content.parts[0];
        
        if (part.functionCall) {
          console.log('Function call detected:', part.functionCall);
          return this.mapFunctionToInstruction(part.functionCall);
        }
        
        if (part.text) {
          console.log('Text response detected:', part.text);
          return this.parseTextResponse(part.text);
        }
      }
      
      console.error('No function call or text response found in content:', candidate);
      return this.getDefaultErrorResponse();
    } catch (error) {
      console.error('Response parsing error:', error);
      return this.getDefaultErrorResponse();
    }
  }

  /**
   * Map function call to instruction format
   * @param {Object} functionCall - Function call from API
   * @returns {Object} - Mapped instruction
   */
  mapFunctionToInstruction(functionCall) {
    const functionName = functionCall.name;
    const args = functionCall.args || {};
    
    console.log(`Mapping function call: ${functionName} with args:`, args);
    
    // Map function names to frontend instructions
    const instructionMap = {
      'navigate_home': {
        instruction: 'Navigate to home page',
        action: 'navigate',
        route: '/home',
        parameters: {},
        success: true
      },
      'navigate_about': {
        instruction: 'Navigate to about page',
        action: 'navigate',
        route: '/about',
        parameters: {},
        success: true
      },
      'navigate_contact': {
        instruction: 'Navigate to contact page',
        action: 'navigate',
        route: '/contact',
        parameters: {},
        success: true
      },
      'toggle_voice_input': {
        instruction: 'Switch to voice input mode',
        action: 'toggle_input',
        route: '/home',
        parameters: { mode: 'voice' },
        success: true
      },
      'toggle_text_input': {
        instruction: 'Switch to text input mode',
        action: 'toggle_input',
        route: '/home',
        parameters: { mode: 'text' },
        success: true
      },
      'clear_input': {
        instruction: 'Clear current input and reset state',
        action: 'clear_input',
        route: '/home',
        parameters: {},
        success: true
      },
      'show_help': {
        instruction: 'Show available commands and features',
        action: 'show_help',
        route: '/home',
        parameters: {
          commands: [
            'Say "home" to go to home page',
            'Say "about" to go to about page',
            'Say "contact" to go to contact page',
            'Say "voice" to switch to voice input',
            'Say "text" to switch to text input',
            'Say "clear" to reset the application',
            'Say "inventory" to open inventory',
            'Say "cart" to open shopping cart',
            'Say "settings" to open settings',
            'Say "go back" to navigate back',
            'Say "enter quantity X" to set quantity'
          ]
        },
        success: true
      },
      'enter_quantity': {
        instruction: `Enter Quantity: ${args.quantity || 0}`,
        action: 'enter_quantity',
        route: '/home',
        parameters: { quantity: args.quantity || 0 },
        success: true
      },
      'open_inventory': {
        instruction: 'Open inventory',
        action: 'open_inventory',
        route: '/inventory',
        parameters: {},
        success: true
      },
      'go_back': {
        instruction: 'Go Back',
        action: 'go_back',
        route: '/home',
        parameters: {},
        success: true
      },
      'open_settings': {
        instruction: 'Open settings',
        action: 'open_settings',
        route: '/settings',
        parameters: {},
        success: true
      },
      'open_cart': {
        instruction: 'Open cart',
        action: 'open_cart',
        route: '/cart',
        parameters: {},
        success: true
      }
    };

    const instruction = instructionMap[functionName];
    if (instruction) {
      console.log('Mapped to instruction:', instruction);
      return instruction;
    } else {
      console.error('Unknown function name:', functionName);
      return this.getDefaultErrorResponse();
    }
  }

  /**
   * Parse text response as fallback
   * @param {string} text - Text response from API
   * @returns {Object} - Parsed instruction
   */
  parseTextResponse(text) {
    console.log('Parsing text response:', text);
    
    // Simple keyword matching as fallback
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('home') || lowerText.includes('main')) {
      return {
        instruction: 'Navigate to home page',
        action: 'navigate',
        route: '/home',
        parameters: {},
        success: true
      };
    }
    
    if (lowerText.includes('about') || lowerText.includes('info')) {
      return {
        instruction: 'Navigate to about page',
        action: 'navigate',
        route: '/about',
        parameters: {},
        success: true
      };
    }
    
    if (lowerText.includes('contact') || lowerText.includes('help')) {
      return {
        instruction: 'Navigate to contact page',
        action: 'navigate',
        route: '/contact',
        parameters: {},
        success: true
      };
    }
    
    return this.getDefaultErrorResponse();
  }

  /**
   * Get default error response
   * @returns {Object} - Error instruction
   */
  getDefaultErrorResponse() {
    return {
      instruction: 'Input not recognized',
      action: 'show_error',
      route: '/home',
      parameters: {
        error: 'I did not understand that. Try saying "help" for available commands.'
      },
      success: false
    };
  }

  /**
   * Mock instruction processing for testing (fallback)
   * @param {string} userInput - User input text
   * @param {string} language - Language code
   * @returns {Object} - Parsed instruction
   */
  mockProcessInstruction(userInput, language) {
    const input = userInput.toLowerCase().trim();
    
    // Mock instruction mapping based on user input
    if (input.includes('home') || input.includes('main') || input.includes('start') || 
        input.includes('casa') || input.includes('accueil') || input.includes('hause')) {
      return {
        instruction: 'Navigate to home page',
        action: 'navigate',
        route: '/home',
        parameters: {},
        success: true
      };
    }
    
    if (input.includes('about') || input.includes('info') || input.includes('details') ||
        input.includes('información') || input.includes('information')) {
      return {
        instruction: 'Navigate to about page',
        action: 'navigate',
        route: '/about',
        parameters: {},
        success: true
      };
    }
    
    if (input.includes('contact') || input.includes('help') || input.includes('support') ||
        input.includes('contacto') || input.includes('aide')) {
      return {
        instruction: 'Navigate to contact page',
        action: 'navigate',
        route: '/contact',
        parameters: {},
        success: true
      };
    }
    
    if (input.includes('voice') || input.includes('speak') || input.includes('microphone') ||
        input.includes('voz') || input.includes('parler')) {
      return {
        instruction: 'Switch to voice input mode',
        action: 'toggle_input',
        route: '/home',
        parameters: { mode: 'voice' },
        success: true
      };
    }
    
    if (input.includes('text') || input.includes('type') || input.includes('keyboard') ||
        input.includes('texto') || input.includes('écrire')) {
      return {
        instruction: 'Switch to text input mode',
        action: 'toggle_input',
        route: '/home',
        parameters: { mode: 'text' },
        success: true
      };
    }
    
    if (input.includes('clear') || input.includes('reset') || input.includes('clean') ||
        input.includes('limpiar') || input.includes('effacer')) {
      return {
        instruction: 'Clear current input and reset state',
        action: 'clear_input',
        route: '/home',
        parameters: {},
        success: true
      };
    }
    
    if (input.includes('help') || input.includes('commands') || input.includes('what can you do') ||
        input.includes('ayuda') || input.includes('aide')) {
      return {
        instruction: 'Show available commands and features',
        action: 'show_help',
        route: '/home',
        parameters: {
          commands: [
            'Say "home" to go to home page',
            'Say "about" to go to about page',
            'Say "contact" to go to contact page',
            'Say "voice" to switch to voice input',
            'Say "text" to switch to text input',
            'Say "clear" to reset the application',
            'Say "inventory" to open inventory',
            'Say "cart" to open shopping cart',
            'Say "settings" to open settings',
            'Say "go back" to navigate back',
            'Say "enter quantity X" to set quantity'
          ]
        },
        success: true
      };
    }

    // Extract quantity from input
    const quantityMatch = input.match(/(?:quantity|amount|number|count|set|enter)\s*(?:to|as|of)?\s*(\d+)/i);
    if (quantityMatch) {
      const quantity = parseInt(quantityMatch[1]);
      return {
        instruction: `Enter Quantity: ${quantity}`,
        action: 'enter_quantity',
        route: '/home',
        parameters: { quantity: quantity },
        success: true
      };
    }

    // Handle written numbers
    const writtenNumbers = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
      'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
      'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
      'twenty five': 25, 'twenty-five': 25, 'twenty five': 25, 'thirty': 30, 'forty': 40, 'fifty': 50,
      'uno': 1, 'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5,
      'un': 1, 'deux': 2, 'trois': 3, 'quatre': 4, 'cinq': 5
    };

    // Check for compound numbers first (like "twenty five")
    for (const [word, number] of Object.entries(writtenNumbers)) {
      if (input.includes(word) && (word.includes(' ') || word.includes('-'))) {
        return {
          instruction: `Enter Quantity: ${number}`,
          action: 'enter_quantity',
          route: '/home',
          parameters: { quantity: number },
          success: true
        };
      }
    }

    // Then check for single words
    for (const [word, number] of Object.entries(writtenNumbers)) {
      if (input.includes(word) && !word.includes(' ') && !word.includes('-')) {
        return {
          instruction: `Enter Quantity: ${number}`,
          action: 'enter_quantity',
          route: '/home',
          parameters: { quantity: number },
          success: true
        };
      }
    }
    
    if (input.includes('inventory') || input.includes('products') || input.includes('items') ||
        input.includes('inventario') || input.includes('produits')) {
      return {
        instruction: 'Open inventory',
        action: 'open_inventory',
        route: '/inventory',
        parameters: {},
        success: true
      };
    }
    
    if (input.includes('back') || input.includes('return') || input.includes('previous') ||
        input.includes('atrás') || input.includes('retour')) {
      return {
        instruction: 'Go Back',
        action: 'go_back',
        route: '/home',
        parameters: {},
        success: true
      };
    }
    
    if (input.includes('settings') || input.includes('config') || input.includes('preferences') ||
        input.includes('configuración') || input.includes('paramètres')) {
      return {
        instruction: 'Open settings',
        action: 'open_settings',
        route: '/settings',
        parameters: {},
        success: true
      };
    }
    
    if (input.includes('cart') || input.includes('basket') || input.includes('shopping') ||
        input.includes('carrito') || input.includes('panier')) {
      return {
        instruction: 'Open cart',
        action: 'open_cart',
        route: '/cart',
        parameters: {},
        success: true
      };
    }
    
    // Default response for unrecognized input
    return {
      instruction: 'Input not recognized',
      action: 'show_error',
      route: '/home',
      parameters: {
        error: 'I did not understand that. Try saying "help" for available commands.'
      },
      success: false
    };
  }
}

module.exports = GoogleApiService; 