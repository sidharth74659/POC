// DOM Elements
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const sendButton = document.getElementById('send-button');
const apiKeyInput = document.getElementById('api-key-input');
const saveApiKeyButton = document.getElementById('save-api-key');
const apiStatusValue = document.getElementById('api-status-value');

// Server endpoint
// const SERVER_URL = 'http://localhost:3000/ask';
const SERVER_URL = 'https://poc-0rm7.onrender.com/ask';
const API_KEY_STORAGE_KEY = 'astra_api_key';

// Request state tracking
let isRequestInProgress = false;
let requestStartTime = null;
const REQUEST_TIMEOUT = 30000; // 30 seconds timeout

// Generate a unique session ID for this chat session
const SESSION_ID = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// Check for saved API key on page load
function loadApiKey() {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey) {
        apiKeyInput.value = savedKey;
        validateAndSetApiKey(savedKey);
    }
}

// Save and validate API key
function validateAndSetApiKey(apiKey) {
    if (!apiKey || apiKey.trim() === '') {
        setApiStatus('Not Set', null);
        disableChatInterface();
        return false;
    }

    // Basic format validation (this is just a basic check, not comprehensive)
    if (apiKey.startsWith('AstraCS:') && apiKey.length > 20) {
        setApiStatus('Set ✓', 'valid');
        localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
        enableChatInterface();
        return true;
    } else {
        setApiStatus('Invalid Format', 'invalid');
        disableChatInterface();
        return false;
    }
}

// Set API status display
function setApiStatus(message, statusClass) {
    apiStatusValue.textContent = message;
    apiStatusValue.className = ''; // Clear previous classes
    if (statusClass) {
        apiStatusValue.classList.add(statusClass);
    }
}

// Enable/disable chat interface
function enableChatInterface() {
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
}

function disableChatInterface() {
    userInput.disabled = true;
    sendButton.disabled = true;
}

// Toggle UI elements based on request state
function setRequestState(inProgress) {
    isRequestInProgress = inProgress;
    userInput.disabled = inProgress;
    sendButton.disabled = inProgress;
    
    if (inProgress) {
        sendButton.classList.add('disabled');
    } else {
        sendButton.classList.remove('disabled');
    }
}

// Create and add a typing indicator to the chat
function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot typing-indicator';
    typingIndicator.id = 'typing-indicator';
    
    const indicatorContent = document.createElement('div');
    indicatorContent.className = 'message-content';
    
    // Add the typing dots
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = 'typing-dot';
        indicatorContent.appendChild(dot);
    }
    
    typingIndicator.appendChild(indicatorContent);
    chatMessages.appendChild(typingIndicator);
    scrollToBottom();
    
    return typingIndicator;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Add a message to the chat
function addMessage(text, isUser = false, metadata = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = text;
    
    messageDiv.appendChild(messageContent);
    
    // Add metadata if provided (e.g., response time)
    if (metadata) {
        const metadataDiv = document.createElement('div');
        metadataDiv.className = 'message-metadata';
        metadataDiv.textContent = metadata;
        messageDiv.appendChild(metadataDiv);
    }
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    
    return messageDiv;
}

// Scroll to the bottom of the chat
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Calculate and format request time
function formatRequestTime(startTime) {
    const endTime = Date.now();
    const timeDiff = (endTime - startTime) / 1000; // Convert to seconds
    return `Response time: ${timeDiff.toFixed(2)}s`;
}

// Handle request timeout
function setupRequestTimeout(controller) {
    return setTimeout(() => {
        if (isRequestInProgress) {
            controller.abort();
            removeTypingIndicator();
            addMessage('Request timed out. Please try again.', false);
            setRequestState(false);
        }
    }, REQUEST_TIMEOUT);
}

// Send message to server
async function sendMessage(question) {
    // Prevent multiple concurrent requests
    if (isRequestInProgress) return;
    
    // Get API key
    const apiKey = apiKeyInput.value.trim();
    if (!validateAndSetApiKey(apiKey)) {
        addMessage('Please enter a valid API key to continue.', false);
        return;
    }
    
    // Set UI to loading state
    setRequestState(true);
    requestStartTime = Date.now();
    
    // Show loading indicator
    const typingIndicator = showTypingIndicator();
    
    // Setup abort controller for timeout/cancellation
    const controller = new AbortController();
    const timeoutId = setupRequestTimeout(controller);
    
    try {
        // Send request to server with question, session ID, and API key
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                question,
                sessionId: SESSION_ID,
                apiKey: apiKey
            }),
            signal: controller.signal
        });
        
        // Clear the timeout since the request completed
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            let errorMessage;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || `HTTP Error: ${response.status}`;
                
                if (errorData.details && errorData.details.includes('401')) {
                    setApiStatus('Invalid or Expired', 'invalid');
                    errorMessage = 'API key invalid or expired. Please update your API key.';
                }
            } catch (e) {
                errorMessage = `HTTP Error: ${response.status}`;
            }
            
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Calculate response time
        const responseTime = formatRequestTime(requestStartTime);
        
        // Add bot response to chat with updated response structure
        const botMessage = data.Response || 'No response received';
        addMessage(botMessage, false, responseTime);
    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        
        if (error.name === 'AbortError') {
            addMessage('Request was cancelled. Please try again.', false);
        } else {
            addMessage(`Error: ${error.message}`, false);
        }
    } finally {
        // Reset UI state
        setRequestState(false);
    }
}

// Handle form submission
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const question = userInput.value.trim();
    
    if (!question || isRequestInProgress) return;
    
    // Add user message to chat
    addMessage(question, true);
    
    // Clear input field
    userInput.value = '';
    
    // Send message to server
    sendMessage(question);
});

// Handle API key save button
saveApiKeyButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    validateAndSetApiKey(apiKey);
});

// Enable sending messages with Enter key
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isRequestInProgress) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
    }
});

// Handle API key input Enter key
apiKeyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        saveApiKeyButton.click();
    }
});

// Add focus to API key input field on page load
window.addEventListener('load', () => {
    loadApiKey();
    if (apiKeyInput.value === '') {
        apiKeyInput.focus();
    }
    console.log('Chat session started with ID:', SESSION_ID);
});

// Add micro-interaction for the send button
sendButton.addEventListener('mousedown', () => {
    if (!isRequestInProgress) {
        sendButton.style.transform = 'scale(0.95)';
    }
});

sendButton.addEventListener('mouseup', () => {
    if (!isRequestInProgress) {
        sendButton.style.transform = 'scale(1)';
    }
}); 