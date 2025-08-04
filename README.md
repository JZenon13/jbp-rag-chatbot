# Jordan Peterson Genesis RAG Chatbot

A Retrieval-Augmented Generation (RAG) chatbot that answers questions using the **Jordan B. Peterson Genesis Lecture Series** as a knowledge base. Built with **Next.js**, **Together AI**, **FAISS**, and **Python**. Deployed using **Docker**.

---

## ✨ Features

- 🔍 Semantic search over transcript chunks using FAISS
- 🤖 Streamed LLM responses via Together AI (LLaMA-3.1-8B)
- 📜 Suggested questions to guide exploration
- 🔄 Two modes: RAG (`/`) and generic chat (`/chat`)
- 🐳 Dockerized for production deployment

---

## Getting Started

To get started with the project, you need to have Docker installed on your machine.

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run `docker-compose up` to start the application.

## Usage

Once the application is running:

1. Open your web browser.
2. Navigate to the frontend server's URL [http://localhost:3000/](http://localhost:3000/).

You should now be able to see the Chatbot UI. Inquire about Jordan Peterson's Genesis Lecture series or simply have a chat. 
