# AIReviewMate — Real-time AI Code Review Platform

<p align="center">
  <img src="apps/landing-page/public/images/global/logo.png" alt="AIReviewMate Logo" height="180">
</p>

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)
![DrizzleORM](https://img.shields.io/badge/DrizzleORM-ORM-orange)
![OpenAI](https://img.shields.io/badge/OpenAI-API-4B0082?logo=openai)
![Status](https://img.shields.io/badge/Build-Passing-success)
![Contributions](https://img.shields.io/badge/Contributions-Welcome-brightgreen)
![PRs](https://img.shields.io/badge/PRs-Welcome-orange)
![Platform](https://img.shields.io/badge/Platform-FullStack-blueviolet)

---
## 🎥 Live Demo

[![Watch the Supademo](assets/Screenshot%202025-10-24%20191403.png)](https://app.supademo.com/embed/cmh3swe4h19zccdwpfebr82mb)


---

## 📹 Project Video

[![Watch the Project Video](assets/Record202510240002-Thumbnail.jpg)](assets/demo-video.mp4)

---

## 🧠 Overview

**AIReviewMate** is a **modern AI-driven code review platform** that streamlines the process of analyzing, improving, and maintaining code quality across multiple languages. Built with a **microservices architecture**, it provides real-time insights, GitHub integration, and secure authentication for teams and individual developers.

The goal is to **empower developers** to focus on logic and creativity while the AI ensures efficiency, maintainability, and consistency.

---

## 🏗️ System Architecture Overview

```mermaid
---
config:
theme: neutral
look: handDrawn
---
flowchart TD
U["👤 User"] --> F["🌐 Frontend (Next.js Dashboard)"]
F --> G["🚪 API Gateway"]
G --> A["🔐 Auth Service"]
G --> L["🧠 LLM Service"]
G --> H["💳 Credits Service"]
G --> N["📣 Notify Service"]
G --> R["🐙 GitHub Service"]


L -->|Uses| O["🤖 OpenAI API"]
H --> D["🗄️ PostgreSQL DB (Drizzle ORM)"]
A --> D
R --> D
N --> D


F -.-> L
F -.-> R


classDef service fill:#111111,stroke:#333,stroke-width:2px;
classDef external fill:#111111,stroke:#666,stroke-width:1px,stroke-dasharray: 5 5;


class G,A,L,H,N,R service;
class O,D external;


subgraph Services
A
L
H
N
R
end


subgraph External Dependencies
O
D
end
```

## Sequence Flow Diagram

```mermaid
sequenceDiagram
    participant U as User / Frontend
    participant AG as API Gateway (Express + Proxy)
    participant Auth as Auth Service
    participant Credits as Credits Service
    participant LLM as LLM Service
    participant GitHub as GitHub Service
    participant Notify as Notify Service
    participant DB as Shared Postgres DB

    %% Signup Flow
    U->>AG: POST /api/auth/signup
    AG->>Auth: Forward signup request
    Auth->>DB: Insert user record
    DB-->>Auth: Confirmation
    Auth-->>AG: Signup response + JWT
    AG->>Notify: Send welcome email
    AG-->>U: Response with user + token

    %% Login Flow
    U->>AG: POST /api/auth/login
    AG->>Auth: Forward login request
    Auth->>DB: Validate user credentials
    DB-->>Auth: User data
    Auth-->>AG: JWT + user data
    AG->>Notify: Optional login alert email
    AG-->>U: Response with user + token

    %% Code Review Flow
    U->>AG: POST /api/llm/review
    AG->>LLM: Forward code for review
    LLM-->>AG: Return code review suggestions
    AG->>Credits: Deduct 5 credits
    AG-->>U: Return suggestions + improved code

    %% GitHub Commit Flow
    U->>AG: POST /api/github/commit
    AG->>GitHub: Forward commit request
    GitHub-->>AG: Commit confirmation
    AG->>Credits: Deduct 10 credits
    AG->>Notify: Commit success email
    AG-->>U: Response with commit URLs

    %% Pull Request Flow
    U->>AG: POST /api/github/pull-request
    AG->>GitHub: Forward PR request
    GitHub-->>AG: PR confirmation / URL
    AG->>Credits: Deduct 10 credits
    AG->>Notify: PR created email
    AG-->>U: Response with PR URL
```


### 🧩 Microservice Breakdown

| Service                 | Responsibility                                                                        | Tech Stack              |
| ----------------------- | ------------------------------------------------------------------------------------- | ----------------------- |
| **API Gateway**         | Central entry point. Routes and validates requests across services.                   | Node.js, Express.js     |
| **Auth Service**        | Handles registration, login, JWT tokens, and bcrypt-based hashing.                    | Node.js, Express, JWT   |
| **LLM Service**         | Core AI engine communicating with OpenAI to analyze and generate categorized reviews. | Node.js, OpenAI API     |
| **GitHub Service**      | Integrates with GitHub for repo fetching, PR creation, and commit-based analysis.     | Octokit, Node.js        |
| **Credits Service**     | Manages usage-based limits, tracks API consumption per user.                          | Express.js, PostgreSQL  |
| **Notify Service**      | Sends emails and alerts for reviews, updates, or plan expiry.                         | NodeMailer, MicroQueue  |
| **Shared DB (Drizzle)** | Unified schema layer for relational data persistence.                                 | PostgreSQL, Drizzle ORM |

---

## 🚀 Key Features

### 🧠 Intelligent AI Review Engine

* Multi-language code analysis (C++, Python, JS, TS, Java, etc.)
* Generates categorized improvement feedback:

  * ⚙️ **Best Practices**
  * 🪲 **Bug Detection & Fixes**
  * 🎯 **Optimization Suggestions**
  * 🧩 **Readability & Maintainability**

### 🪶 Developer Experience Focused

* Real-time code editing & AI review panel.
* Syntax highlighting, dark/light themes.
* Export reviewed code or open PR directly.

### 🛡️ Authentication & Security

* JWT-based authentication.
* Role-based route protection.
* Secure hashing with bcrypt.

### 🧱 Modular & Scalable

* Each service runs independently.
* Dockerized deployment with shared network.
* Easy scaling and fault isolation.

---

## ⚙️ Tech Stack

| Category            | Technology                                      |
| ------------------- | ----------------------------------------------- |
| **Frontend**        | Next.js 15, React 19, TailwindCSS, ShadCN/UI    |
| **Backend**         | Node.js, Express.js, Microservices Architecture |
| **Database**        | PostgreSQL + Drizzle ORM                        |
| **AI Engine**       | OpenAI GPT Models                               |
| **Auth & Security** | JWT, bcrypt, CORS                               |
| **Version Control** | GitHub API (Octokit)                            |
| **Notifications**   | NodeMailer, Custom Webhooks                     |
| **Deployment**      | Docker, Vercel / Railway / Render               |

---

## 🧩 Folder Structure

```
appajidheeraj-aireviewmate-slofy/
├── apps/
│   ├── frontend/          # User Dashboard (Next.js + ShadCN)
│   └── landing-page/      # Marketing Site
├── services/
│   ├── api-gateway/       # API routing hub
│   ├── auth-service/      # JWT-based authentication
│   ├── credits-service/   # Usage and credits management
│   ├── github-service/    # GitHub integration and PR automation
│   ├── llm-service/       # AI code analysis using OpenAI
│   └── notify-service/    # Email and notification service
└── shared/
    └── db/                # Drizzle ORM schema, migrations & connection
```

---

## 🧰 Setup & Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/appajidheeraj/aireviewmate.git
cd appajidheeraj-aireviewmate-slofy
```

### 2️⃣ Install Dependencies

```bash
cd apps/frontend && npm install
cd ../../services/auth-service && npm install #Similarly for all microservices
```

### 3️⃣ Environment Configuration

Create `.env` files for each microservice:

```bash
OPENAI_API_KEY=sk-xxxx
DATABASE_URL=postgresql://user:pass@localhost:5432/aireviewmate
JWT_SECRET=supersecretkey
GITHUB_TOKEN=ghp_xxxxxx
```

### 4️⃣ Start All Services

```bash
npm run dev        #For frontend
nodemon server.js  #For microservices
```


---

## 🔁 Workflow

1. **Frontend** sends code snippets to API Gateway.
2. **API Gateway** authenticates request and routes to LLM Service.
3. **LLM Service** analyzes code using OpenAI API and categorizes feedback.
4. **Response** is stored via Credits Service (for tracking usage).
5. **Notify Service** optionally sends notifications.
6. **Frontend Dashboard** displays structured AI suggestions.

---

## 📊 Data Flow Diagram

```
User ─▶ Frontend (Next.js) ─▶ API Gateway ─▶ Auth Svc / LLM Svc / GitHub Svc
                                              │
                                              ▼
                                         PostgreSQL DB
```

---

## 🧭 API Endpoints

| Endpoint           | Method | Description                         |
| ------------------ | ------ | ----------------------------------- |
| `/api/review`      | POST   | Submit code snippet for AI review   |
| `/api/auth/signup` | POST   | Create new user account             |
| `/api/auth/login`  | POST   | Authenticate user                   |
| `/api/github/pr`   | POST   | Create GitHub PR with reviewed code |
| `/api/credits`     | GET    | Check remaining credit usage        |

---

## 🎬 Demo & Screenshots

- Frontend Dashboard:

- Code Review Panel:

- PR Integration:

(Placeholders for GIFs and demo videos can be added here)

## 📚 References & Inspirations

- Monaco Editor & React integration

- Code diff visualization techniques (CodeGrid)

- Neon DB + Drizzle ORM for relational database handling

- YouTube tutorials on microservices and AI integration

- GSAP for smooth UI/UX transitions

- OpenAI structured prompt examples

---

## 🔮 Roadmap

* [ ] **Collaborative Multi-user Code Review**
* [ ] **LLM Fine-tuning for Specific Languages**
* [ ] **VS Code Extension Integration**
* [ ] **Advanced Usage Analytics Dashboard**
* [ ] **AI Code Explanation Narrator (Voice Support)**

---

## 🧑‍💻 Author

**Appaji Dheeraj**

> Building tools that empower developers through AI ✨

🌐 [LinkedIn](https://linkedin.com/in/appaji-dheeraj) · 🐙 [GitHub](https://github.com/appajidheeraj)

---

## 📜 License

This project is licensed under the **MIT License**.

---

⭐ **If you find this project helpful, consider giving it a star!**







