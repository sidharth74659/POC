
---

# What we're gonna talk about

---

Today we're going to talk about Leveraging AI. When I say AI, I'm not talking about the AI that you're probably thinking of, like ChatGPT, DALL-E, Copilor or Vision AI. Not the one's that lets you prompt something and get a response.
We're gonna talk about the AI that speaks with conctext, By context, I mean your set of documents, your DB, your APIs and not only to you, but the one that can communicate with Systems, Softwares and more
We're gonna cover about all interesting, amazing and at some point, few scary things that can be done with this technology.

So it's gonna be an adventure, or at least I hope so.

---

A bit of summary to help you understand what we're gonna talk about

---

# So, what is AI?

---

If that's the question, we're not going to answer it here.

---

# What can be done with AI?

---

Based on my understanding/analysis, I boiled them to following three:

1. Q&A (Prompting LLM)
2. RAG (Vectorizing DB + LLM Embedding)
3. Agentic AI (using LLM + MCP)
4. LLM (fine-tuning)

One other point I left here is Autonomous AI Agents that continuesly run for given tasks. You can refer them as AI Agents or AI Workflows, where you orchestrate the flow of tasks, and the flow of data. More on this in the end.

And this is pretty much what I see in any AI implemnetion out there.

We're gonna cover each of them in detail, with sample-use case, and the best part? It's tailored to fit in our application, thus, gives you a clear picture on use-case and real-world implementation.

---

## 1. Q&A

---

### 1.1 What? and Where?

You usually define/write a _system prompt_, attached to a json payload(could be images, json, text, etc) passed to the LLM for a response.

- The interaction would be a user prompts a question, and the LLM will combine the system prompt with the user prompt, and answer based on the system prompt.

Sample use-case:

- Vision AI:
  - Payload: You pass an image,
  - System Promt: <expect a structured response(could be tone, json, set of format, etc)>
  - User Prompt: Describe the image
  - Response: Structured response

---

### 1.3 Implementing in our app

- Expense App: Where we've integrated with OpenAI/Gemini Vision API to extract a structured json from the image
- Digital Forms: Where we're able to generate a form(a.k.a json) from the user's input based on the system prompt explaining the schema.

Playgrounds/Demo:
<TODO>

---

### 1.2 Extra Work:

- You need to cover/test/validate the prompt, and the response and for any missing/edge case, you need to update the prompt to handle it.
  Ex:
- If the image is a logo, but the system prompt is expecting a receipt: handle the case
- If the uploaded content is not an image, but a text mimicking a receipt: handle the case

---

# 2. RAG

---

### 2.1 What? and Where?

If someone mentions RAG, hear it as a Chatbot as this is what it ends up to be.

full form would be: Retrieval Augmented Generation, which means it helps find and use information better.
How's it different from AI like ChatGPT? While ChatGPT creates answers based on what it learned(trained), RAG looks up information first to give more accurate and helpful responses.

To simplify, an AI(LLM) gives response based on what it learned(trained), but RAG gives response based on what it knows by looking up information first.

The architecture of RAG is as follows:

- Upload Documents -> Vectorize the data(DB, Cloud Storage, etc) -> Store the vectorized data in a vector DB -> Use a LLM to embed the user's query into a vector -> Compare the query vector with the vectors in the vector DB using cosine similarity -> Retrieve the most similar vectors -> Use a LLM to generate a response using the most similar vectors

A non-technical explanation:

- Upload documents -> Convert the data into a format we can use -> Save this data in a special database -> Turn the user's question into a format we can compare -> Find the closest matches in the database -> Use these matches to create a helpful answer


You can use open-source models that are quantified though to run local systems, or use cloud-based models that are free to use.

---

### 2.2 Implementing in our app

- (yet to be implemented) Maintenance/Contractor Management, Inventory: Where it can be used to answer questions based on the uploaded documentsin the DB(or Cloud Storage).

Playgrounds/Demo:
<TODO>

---

# 3. Agentic AI:

- Agentic AI is a type of AI that can make decisions based on the information it has.
- It's a system that can take actions based on the information it has.
- And MCP(Model Context Protocol) is a protocol(like a standard) that allows us to provide with necessary
  - Resources: Schema/DBs/APIs/etc
  - Tools: Functions that can be called
  - Prompts: System Instructions
  - Context: Previous conversations, etc
    to the LLM.

---

### 3.1 What? and Where?

- Agentic AI is a type of AI that can make decisions based on the information it has.

And MCPs are something that amplifies the capabilities of the LLM by providing with necessary resources, tools, prompts, context, etc.

When I say MCP, It's more of a protocol/standard proposed by Anthropic, but isn't standardized yet.

- Its also referred as Function Calling, by openai, gemini, etc
- and A2A a superset proposed by Google that allows for agents to interact with each other

---

### 3.2 Implementing in our app

- (yet to be implemented) Smart Scheduling: Where it can be used to get more idea on resource details and allow an user to query/get information using natural language, schedule tasks based on the resources and tools available among other things.

Playgrounds/Demo:
<TODO>
- Todo
- Puppeteer/Playwright
  - + Development
- Figma
- Much more open-source tools

---

# 4. LLM (fine-tuning)

You train with a set of data, could be a dataset, a set of documents, a set of images, etc.

Tailored to your use-case, and your data. This is almost similar to Machine Learning, except consider the abstracted thing is an LLM instead of some python code.

Examples could be:
- Damage detection from an image (maintenance)
- Clone of a person based on a group of chats
- Sample data as to what type of answers you always want from an LLM

---

# 5. Autonomous AI Agents

- N8N
- LangChain
- Flowise



---

# Conclusion

- We've covered a lot of things, and I hope you've learned something new today.
- I'll be happy to answer any questions you have.
- Thank you for your time, and I hope you've enjoyed the session.

---

# What could go wrong?

- Everything, cause it's an AI, which while it can give anything based on instructions, it can also hallucinate.
- And an instruction could also be wrong, mis-leading, attempts of misusing, etc.
- So, you need to cover/test/validate the prompt, and the response and for any missing/edge case, you need to update the prompt to handle it.
- That's where we have to be aware if not smart, of the things we're doing.

---

That's my time.

---
