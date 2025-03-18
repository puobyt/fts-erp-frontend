# ERP Frontend

## 📌 Overview

This is the frontend of an **ERP system** built using **React (Vite) + Material UI**, designed as a template with prebuilt components. The project follows a modular folder structure to maintain clean and scalable code.

## 🚀 Tech Stack

- ⚡ **React (Vite)** – Fast development setup
- 🎨 **Material UI** – UI components
- 🔗 **Axios** – HTTP requests
- 🚏 **React Router** – Client-side routing
- 📜 **JavaScript (ES6+)**
- 📦 **NPM** – Package manager

## 📁 Folder Structure

```
└── CRM-frontEnd-Freelance-project.git/
    ├── 📄 CHANGELOG.md
    ├── 📜 README.md
    ├── 📑 index.html
    ├── 📌 package-lock.json
    ├── 📦 package.json
    ├── 🎨 prettier.config.mjs
    ├── 🗂 public
    │   ├── 🖼 assets
    │   ├── 🌐 favicon.ico
    │   └── 🌐 favicon1.ico
    ├── 📂 src
    │   ├── 🗃 _mock
    │   ├── ⚙️ app.jsx
    │   ├── 🧩 components
    │   ├── 🛠 config-global.js
    │   ├── ⚙️ configs
    │   ├── 🎨 global.css
    │   ├── 🔗 hooks
    │   ├── 🏗 layouts
    │   ├── 🚀 main.jsx
    │   ├── 📄 pages
    │   ├── 🔥 redux
    │   ├── 🔀 routes
    │   ├── 📌 sections
    │   ├── 🎨 theme
    │   ├── 🔧 utils
    │   └── 📜 vite-env.d.js
    ├── 🎨 tailwind.config.js
    ├── 🔗 vercel.json
    ├── ⚙️ vite.config.js
    └── 🔄 yarn.lock
```

**Don't be scared** of the number of prebuilt components. This is a frontend React template with a structured component hierarchy.

## 📦 Installation & Setup

Ensure you have **Node.js** and **npm** installed.

```bash
# Clone the repository
git clone https://github.com/jishnuanilDev/CRM-frontEnd-Freelance-project.git
cd CRM-frontEnd-Freelance-project.git

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 📌 Features

- 🏗 **Modular component structure** for scalability
- 📝 **Dynamic forms and modals** for adding and editing data
- 🚀 **Prebuilt UI components** to speed up development
- 🔀 **Client-side routing** with `React Router`
- 🔒 **Protected Routes** for authentication
- 📤 **Export features** (Excel, PDF reports)

## 📜 Client-side Routing

🚏 Routing is handled inside the **routes/section.jsx** file. All pages are imported and rendered within the **pages** directory.

## 📄 API Integration

🔗 The API base URL (server URL) is configured inside the **config/axiosConfig.js** file. Modify this file to update the API server URL.

## 📖 Usage

To start working on a new feature:

1. 📝 **Create forms** inside `src/layouts/modals`
2. ✏️ **Edit forms** inside `src/layouts/editModals`
3. 📊 **Update or import data** inside `src/sections/views`

## 🔄 About Redux

⚠️ This project does not currently use **Redux** for state management. However, implementing **Redux** in the future would enhance global state handling and improve scalability.

## 🔗 License

This project is licensed under the **MIT License**.

---

Enjoy coding! 🚀