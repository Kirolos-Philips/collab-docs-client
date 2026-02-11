# Collaborative Document Editor - Frontend

A modern, real-time collaborative document editing platform built with React, Vite, and Yjs. This frontend provides a premium user experience with a custom design system, robust state management, and seamless collaboration features.

## ✨ Features

- **Real-time Collaboration**: Multi-user editing with live cursor awareness and presence indicators (powered by Yjs).
- **Premium UI/UX**: A custom-built design system featuring:
    - Standardized, high-quality components (`Button`, `InputField`, `Modal`, `Dropdown`).
    - Smart icon alignment and pixel-perfect centering.
    - Responsive interactive states and micro-animations.
- **Global Notification System**: Non-intrusive toast notifications for real-time feedback on user actions.
- **Authentication & Security**: Secure login and registration flow with persistent session management.
- **Profile Customization**: Personalize your identity with custom usernames and avatar uploads.
- **Document Management**: intuitive dashboard for creating, listing, and managing your collaborative projects.

## 🛠 Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Vanilla CSS with CSS Modules and Global Theme Variables
- **Icons**: Lucide React
- **Real-time Engine**: Yjs & WebSockets
- **State Management**: React Context API (`AuthContext`, `ToastContext`)
- **API Communication**: Centralized Axios client with request/response interceptors

## 🏗 Project Structure

- `src/components/`: Reusable, atomic UI components.
- `src/contexts/`: Global state and business logic providers.
- `src/pages/`: Feature-complete view components (Dashboard, Authentication).
- `src/api/`: Centralized API service layer.
- `src/styles/`: Design tokens, theme variables, and global resets.

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- Backend server instance

### Installation
```bash
npm install
```

### Running the Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

---
*Created with ❤️ by Kero.*
