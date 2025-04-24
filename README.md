# Postify Frontend


## 📝 Overview

Postify is a modern blog-sharing platform where users can create, share, and interact with content through comments and likes. This repository contains the frontend application built with React, Redux, and Tailwind CSS.

## 🚀 Technologies

- **React** - JavaScript library for building user interfaces
- **Redux** - State management
- **Redux Toolkit** - Toolset for efficient Redux development
- **React Router** - Navigation and routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next generation frontend tooling
- **Axios** - Promise-based HTTP client

## 🖼️ Features

- 📱 Responsive design for all device sizes
- 🔐 User authentication and profile management
- ✍️ Create, edit, and delete blog posts
- 📷 Image uploads with preview
- 💬 Comment on posts
- ❤️ Like posts
- 🔍 Search functionality


## ⚙️ Prerequisites

Before setting up the project, make sure you have the following installed:

- Node.js (version 16+)
- npm or yarn
- Git

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sidharth-Chirathazha/Postify-Frontend.git
cd postify-frontend/postify_frontend
```

### 2. Install dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Configure environment variables

Create a `.env` file in the root of the `postify_frontend` directory with the following variables:

```
VITE_API_BASE_URL=BACKEND_BASE_URL/api
```

### 4. Start development server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The application should now be running at `http://localhost:5173`

## 📦 Build for Production

```bash
# Using npm
npm run build

# Using yarn
yarn build
```

The build output will be in the `dist` directory.

## 🧪 Running Tests

```bash
# Using npm
npm run test

# Using yarn
yarn test
```


## 🌐 Connecting to Backend

The frontend is configured to connect to the Postify backend API at `BACKEND_BASE_URL/api`. Make sure the backend server is running before starting the frontend application.

See the [Postify Backend Repository](https://github.com/Sidharth-Chirathazha/Postify-Backend) for backend setup instructions.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
