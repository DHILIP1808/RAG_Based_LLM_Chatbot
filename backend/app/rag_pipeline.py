from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

from app.chroma_client import load_or_create_chroma
from app.config import OPENROUTER_API_KEY, OPENROUTER_API_BASE, LLM_MODEL_NAME


def classify_query_type(query: str, llm) -> str:
    """
    Classify the query into different types: GREETING, AGRICULTURE, NON_AGRICULTURE
    """
    classification_prompt = ChatPromptTemplate.from_template("""
You are a query classifier. Classify the following message into one of these categories:

1. GREETING - If it's a greeting, introduction, casual conversation starter, or general chatbot interaction
   Examples: "hi", "hello", "good morning", "hi agrichatbot", "how are you", "what can you do", "help me"

2. AGRICULTURE - If it's related to agriculture, farming, crops, livestock, soil, plant diseases, agricultural techniques, or rural farming practices
   Examples: "how to grow tomatoes", "pest control methods", "soil pH management", "crop rotation benefits"

3. NON_AGRICULTURE - If it's a specific question about topics completely unrelated to agriculture
   Examples: "write code in python", "solve math problem", "what is the capital of France", "programming tutorial"

Respond with only one word: GREETING, AGRICULTURE, or NON_AGRICULTURE

Message: {message}

Answer:""")
    
    chain = classification_prompt | llm
    result = chain.invoke({"message": query})
    
    return result.content.strip().upper()


def handle_greeting() -> str:
    """
    Generate a friendly greeting response for the agriculture chatbot
    """
    return """Hello! 👋 I'm your Agriculture Assistant, How can I Assist you Today ?
"""


def get_answer(query: str) -> str:
    retriever = load_or_create_chroma()

    llm = ChatOpenAI(
        model=LLM_MODEL_NAME,
        temperature=0.2,
        api_key=OPENROUTER_API_KEY,
        base_url=OPENROUTER_API_BASE,
    )

    # Classify the query type
    query_type = classify_query_type(query, llm)
    
    # Handle different query types
    if query_type == "GREETING":
        return handle_greeting()
    elif query_type == "NON_AGRICULTURE":
        return """I'm sorry, but I'm specialized in agricultural topics only. I can't help with questions outside of farming and agriculture."""
    
    # For AGRICULTURE queries, proceed with RAG

    # Improved system prompt for agriculture-focused RAG
    prompt = ChatPromptTemplate.from_template("""
You are an expert agricultural assistant with deep knowledge of farming, crops, livestock, soil management, plant diseases, and agricultural practices.

INSTRUCTIONS:
1. Use the provided context to answer the user's agriculture-related question
2. If the context contains relevant information, provide a comprehensive answer based on that information
3. If the context doesn't contain enough information to fully answer the question, provide what you can from the context and clearly state what information is missing
4. Always stay focused on agricultural topics
5. Provide practical, actionable advice when possible
6. If asked about specific crops, diseases, or techniques not in the context, acknowledge the limitation

CONTEXT:
{context}

QUESTION: {question}

RESPONSE GUIDELINES:
- Be helpful and informative
- Use clear, practical language
- Cite specific information from the context when available
- If context is insufficient, say so clearly
- Always maintain focus on agricultural applications

Answer:""")

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",
        chain_type_kwargs={"prompt": prompt}
    )

    try:
        result = qa_chain.invoke({"query": query})
        
        # Additional safety check for the response
        response = result["result"]
        
        # If the response indicates it can't help with the topic, provide a more helpful message
        if any(phrase in response.lower() for phrase in ["cannot help", "outside my scope", "not related to agriculture"]):
            return "I specialize in agricultural topics. While I found some information, it might not be complete. Could you please rephrase your question or ask about specific farming practices, crop management, livestock care, or agricultural techniques?"
        
        return response
        
    except Exception as e:
        return f"I apologize, but I encountered an error while processing your agriculture-related question. Please try rephrasing your question or contact support. Error: {str(e)}"


def get_answer_with_context_check(query: str) -> str:
    """
    Alternative version that checks context relevance before generating answer
    """
    retriever = load_or_create_chroma()

    llm = ChatOpenAI(
        model=LLM_MODEL_NAME,
        temperature=0.2,
        api_key=OPENROUTER_API_KEY,
        base_url=OPENROUTER_API_BASE,
    )

    # Classify the query type
    query_type = classify_query_type(query, llm)
    
    # Handle different query types
    if query_type == "GREETING":
        return handle_greeting()
    elif query_type == "NON_AGRICULTURE":
        return """I'm sorry, but I'm specialized in agricultural topics only. I can't help with questions outside of farming and agriculture.

I'd be happy to help you with:
• Crop cultivation and management
• Livestock care and breeding
• Soil management and fertilization  
• Pest and disease control
• Agricultural techniques and best practices
• Farm planning and productivity

Please ask me anything related to agriculture, and I'll do my best to help! 🌾"""

    # Retrieve relevant documents
    docs = retriever.get_relevant_documents(query)
    
    if not docs:
        return "I don't have relevant information in my agricultural knowledge base to answer your question. Please try asking about crops, farming techniques, livestock management, soil health, or plant diseases."

    # Check if retrieved context is actually relevant to agriculture
    context = "\n".join([doc.page_content for doc in docs])
    
    relevance_prompt = ChatPromptTemplate.from_template("""
Analyze if the following context contains information relevant to answering an agriculture-related question.

Context: {context}
Question: {question}

Respond with "RELEVANT" if the context can help answer the agriculture question, or "NOT_RELEVANT" if it cannot.

Answer:""")
    
    relevance_chain = relevance_prompt | llm
    relevance_result = relevance_chain.invoke({"context": context, "question": query})
    
    if "NOT_RELEVANT" in relevance_result.content.strip().upper():
        return "I don't have specific information about this agricultural topic in my knowledge base. Please try asking about other farming-related subjects like crop management, livestock care, or soil health."

    # Enhanced prompt for better responses
    prompt = ChatPromptTemplate.from_template("""
You are an expert agricultural consultant. Answer the user's question using only the provided context about agriculture.

CONTEXT:
{context}

QUESTION: {question}

INSTRUCTIONS:
- Provide a helpful, detailed answer based on the context
- If the context provides partial information, use it and note what's missing
- Stay focused on agricultural applications
- Be practical and actionable in your advice
- If you cannot answer based on the context, clearly explain what information you'd need

Answer:""")

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",
        chain_type_kwargs={"prompt": prompt}
    )

    result = qa_chain.invoke({"query": query})
    return result["result"]