
---

# 🚀 Fun Flow - A Modern Social Media Platform  

**Fun Flow** is an innovative full-stack social media platform that connects users with seamless real-time communication, dynamic content sharing, and an engaging, customizable user experience. From sharing quick **Shorts** to messaging friends, Fun Flow has it all.  

---

## 🌟 Key Features  

### 🖼️ Content Sharing  
- **Posts & Comments:** Share your thoughts, interact with others, and engage with the community.  
- **Shorts:** A quick video-sharing feature, similar to Instagram Stories.  

### 💬 Real-Time Communication  
- **Instant Messaging:** Powered by **Socket.io** for real-time chats.  

### 🎨 Customization & Security  
- **Themes:** Personalize your experience with **Daisy UI** themes.  
- **Secure Authentication:** Enjoy safe access with **Firebase Authentication** and **JWT**.  

### 📦 Efficient Media Management  
- **Cloudinary Integration:** Effortless image and video handling for all your uploads.  

---

## 💻 Tech Stack  

### Frontend  
- **React.js** with **Redux Toolkit** for state management.  
- **Tailwind CSS** for responsive and modern UI.  
- **Vite** as the build tool for a faster development process.  

### Backend  
- **Express.js** and **Node.js** for the RESTful API.  
- **MongoDB** as the database for storing user data and posts.  
- **Socket.io** for real-time WebSocket connections.  

### Additional Tools  
- **Cloudinary** & **Multer** for media storage and management.  
- **JWT** and **Firebase** for authentication.  

---

## 📁 Folder Structure  

### Backend Folder Structure  

```plaintext  
📦 Fun Flow Backend  
├── server/  
│   ├── controllers/  
│   │   ├── auth.controller.js  
│   │   ├── message.controller.js  
│   │   ├── post.controller.js  
│   │   ├── story.controller.js  
│   │   └── user.controller.js  
│   ├── middlewares/  
│   │   └── verifyToken.js  
│   ├── models/  
│   │   ├── comment.model.js  
│   │   ├── message.model.js  
│   │   ├── post.model.js  
│   │   ├── story.model.js  
│   │   └── user.model.js  
│   ├── routes/  
│   │   ├── auth.routes.js  
│   │   ├── post.routes.js  
│   │   ├── story.routes.js  
│   │   └── user.routes.js  
│   ├── utils/  
│   │   └── server.js  
│   └── uploads/  
├── .env  
├── .gitignore  
├── package.json  
├── package-lock.json  
└── README.md   
```  

---

### Frontend Folder Structure  

```plaintext  
📦 client  
├── public/  
│   ├── index.html  
├── src/  
│   ├── assets/  
│   │   └── signup-logo.jpg  
│   ├── components/  
│   │   ├── Allcomments.jsx  
│   │   ├── CreatePost.jsx  
│   │   ├── CreateStory.jsx  
│   │   ├── DeletePost.jsx  
│   │   ├── EditPost.jsx  
│   │   ├── MessageComponent.jsx  
│   │   ├── OAuth.jsx  
│   │   ├── PostCard.jsx  
│   │   ├── Search.jsx  
│   │   ├── ShowAllPosts.jsx  
│   │   ├── Stories.jsx  
│   │   ├── UserDetails.jsx  
│   │   ├── UserList.jsx  
│   ├── config/  
│   │   └── axiosInstance.js  
│   ├── pages/  
│   │   ├── Footer.jsx  
│   │   ├── Header.jsx  
│   │   ├── Home.jsx  
│   │   ├── Profile.jsx  
│   │   ├── SignIn.jsx  
│   │   ├── SignUp.jsx  
│   │   └── UserProfile.jsx  
│   ├── redux/  
│   │   └── user/  
│   │       └── userSlice.js  
│   │   └── store.js  
│   ├── App.jsx  
│   ├── ErrorBoundary.jsx  
│   ├── firebase.js  
│   ├── index.css  
│   ├── main.jsx  
├── .env  
├── .eslintrc.cjs  
├── .gitignore  
├── postcss.config.js  
├── tailwind.config.js  
├── vite.config.js  
├── package.json  
└── README.md  
```  

---

## ⚡ Installation and Setup  

### Backend  
1. Clone the backend repository:  
   ```bash  
   git clone https://github.com/your-username/fun-flow-backend.git  
   cd fun-flow-backend  
   ```  
2. Install dependencies:  
   ```bash  
   npm install  
   ```  
3. Configure environment variables in a `.env` file.  
4. Start the backend server:  
   ```bash  
   npm start  
   ```  

### Frontend  
1. Clone the frontend repository:  
   ```bash  
   git clone https://github.com/mohammadamanpatel/My-social-media  
   cd client  
   ```  
2. Install dependencies:  
   ```bash  
   npm install  
   ```  
3. Start the development server:  
   ```bash  
   npm run dev  
   ```  

---

## 🛠️ Features in Detail  

1. **Posts and Comments**  
   - Create, edit, delete posts.  
   - Engage with other users' content through comments.  

2. **Shorts**  
   - A dynamic short-video sharing feature.  

3. **Real-Time Messaging**  
   - Powered by WebSocket connections for instant communication.  

4. **Secure Authentication**  
   - Login with Google via Firebase Authentication.  
   - Token-based security with JWT.  

5. **Custom Themes**  
   - Personalize your experience with a wide variety of themes.  

---

## 🌐 Live Demo  
Check out the live demo https://my-social-media-v6xp.onrender.com.  

---
