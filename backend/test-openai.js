// From OpenAI docs:
// https://platform.openai.com/docs/api-reference/chat/create
require('dotenv').config();
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {

    const response = await openai.responses.create({
        model: 'gpt-4o',
        instructions: 'You are a coding assistant that talks like a pirate',
        input: 'Are semicolons optional in JavaScript?',
    });
    console.log(response.output_text);

    return;

    const completion = await openai.chat.completions.create({
        messages: [
            { role: "developer", content: "You are a helpful assistant, if asked your name say Hello World." },
            { role: "user", content: "What is your name?" }
        ],
        model: "gpt-4o",
    });


    console.log(completion.choices[0]);
}

main();