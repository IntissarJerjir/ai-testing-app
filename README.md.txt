# AI-Based Testing Application

🚀 Full-stack application that combines **Project Management** with **AI-based Test Case Generation**.

## 📌 Project Overview
- **Backend**: ASP.NET Core (.NET 8)  
- **Frontend**: React.js (Vite)  
- **AI**: LLaMA2 fine-tuned model that generates test cases from user stories  

This project allows a tester to add a user story, and the AI automatically generates **test cases and use cases**.

## 📂 Structure
/sprintHub_backend → ASP.NET Core backend
/sprintHub_Frontend → React frontend
/llama_api → Python + LLaMA2 model code


## ⚙️ How it works
1. Tester adds a **User Story** in the frontend  
2. The backend saves it  
3. The AI service (llama_api) generates **test cases** automatically  
4. Results are displayed in the app

## 📸 Screenshots
👉 *(Ajoute quelques captures d’écran de ton application ici)*

## 🔧 Installation
### Backend
```bash
cd sprintHub_backend
dotnet restore
dotnet run

cd sprintHub_Frontend
npm install
npm run dev

cd llama_api
python -m venv .venv
source .venv/bin/activate  
uvicorn main:app --reload

