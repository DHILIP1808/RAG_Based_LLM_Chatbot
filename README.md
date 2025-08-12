# 🌾 RAG-Based LLM Agriculture Chatbot

## 📌 Overview
The **RAG-Based LLM Agriculture Chatbot** is an AI-powered question-answering system tailored for agricultural learning.  
It leverages **Retrieval-Augmented Generation (RAG)** to retrieve precise answers from curated agricultural documents and generate context-aware responses using **GPT-4.0 via OpenRouter API**.

Optimized for local CPU environments, it features a clean agriculture-themed UI for easy interaction.

---

## 🛠 Tech Stack

**Frontend**  
- React (TypeScript)  
- Tailwind CSS  
- Axios  
- React Icons  

**Backend**  
- FastAPI  
- LangChain  
- ChromaDB (local vector store)  
- BAAI Embeddings (`bge-small-en-v1.5`)  
- OpenRouter API (`openai/gpt-4o-mini`)  

---

## 📂 Data Sources
- `Basic_Agriculture.pdf`
- `farmerbook.pdf`
- `HORTICULTURE.pdf`

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/DHILIP1808/RAG_Based_LLM_Chatbot.git
cd RAG_Based_LLM_Chatbot
```

### 2️⃣ Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
- Create a `.env` file inside `backend`:
```env
OPENROUTER_API_KEY=your_api_key_here
```
- Ensure `chroma_db` folder exists for storing embeddings.

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
```

---

## ▶️ Running the Project

### Start Backend
```bash
cd backend
uvicorn main:app --reload
```

### Start Frontend
```bash
cd frontend
npm run dev
```

Frontend: **http://localhost:5173**  
Backend: **http://127.0.0.1:8000**

---

## 📂 Folder Structure
```
RAG_Based_LLM_Chatbot/
│
├── backend/
│   ├── main.py
│   ├── rag_pipeline.py
│   ├── chroma_db/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## 🌟 Features
- 📖 **Agriculture Knowledge Base** from curated PDFs  
- 🔍 **Context-Aware Search** using RAG pipeline  
- ⚡ **Low-Latency Retrieval** with local ChromaDB  
- 🎨 **Agriculture-Themed UI** with Tailwind CSS  
- 🔑 **Secure API Key Handling** via `.env`  

---

## 🚀 Future Improvements
- 🌐 Add multilingual support  
- 📊 Display source references in chat UI  
- 📱 Mobile-responsive layout  
- 🔄 Dynamically update vector DB with new PDFs  

---

## 🤝 Contributing
Pull requests are welcome.  
For major changes, please open an issue first to discuss your ideas.

---

