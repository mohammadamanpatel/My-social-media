
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
│   │   ├── auth.controller.js      # Handles user authentication logic  
│   │   ├── message.controller.js   # Manages CRUD operations for messages  
│   │   ├── post.controller.js      # Handles CRUD operations for posts  
│   │   ├── story.controller.js     # Manages user stories functionality  
│   │   └── user.controller.js      # Manages user-related functionalities  
│   ├── middlewares/  
│   │   └── verifyToken.js          # Middleware for JWT token verification  
│   ├── models/  
│   │   ├── comment.model.js        # Schema for comments in the database  
│   │   ├── message.model.js        # Schema for messages in the database  
│   │   ├── post.model.js           # Schema for posts in the database  
│   │   ├── story.model.js          # Schema for user stories in the database  
│   │   └── user.model.js           # Schema for user details in the database  
│   ├── routes/  
│   │   ├── auth.routes.js          # API routes for authentication endpoints  
│   │   ├── post.routes.js          # API routes for post-related endpoints  
│   │   ├── story.routes.js         # API routes for story-related endpoints  
│   │   └── user.routes.js          # API routes for user-related endpoints  
│   ├── utils/  
│   │   └── server.js               # Utility file to configure and start the server  
│   └── uploads/                    # Temporary directory to store uploaded files  
├── .env                            # Environment variables for backend configuration  
├── .gitignore                      # Git ignore rules for excluding files from version control  
├── package.json                    # Dependency manager and scripts for the backend  
├── package-lock.json               # Ensures consistent dependency versions  
└── README.md                       # Documentation for setting up and using the backend  

```  

---

### Frontend Folder Structure  

```plaintext  
📦 client  
├── public/  
│   ├── index.html                  # HTML entry point for the app  
├── src/  
│   ├── assets/  
│   │   └── signup-logo.jpg         # Image asset for the signup page logo  
│   ├── components/  
│   │   ├── Allcomments.jsx         # Displays all comments for a post  
│   │   ├── CreatePost.jsx          # Component for creating a new post  
│   │   ├── CreateStory.jsx         # Component for creating a new story  
│   │   ├── DeletePost.jsx          # Handles post deletion functionality  
│   │   ├── EditPost.jsx            # Allows editing an existing post  
│   │   ├── MessageComponent.jsx    # Displays messages between users  
│   │   ├── OAuth.jsx               # Handles OAuth integration for third-party login  
│   │   ├── PostCard.jsx            # Displays an individual post in a card layout  
│   │   ├── Search.jsx              # Implements search functionality for users or posts  
│   │   ├── ShowAllPosts.jsx        # Displays a feed of all posts  
│   │   ├── Stories.jsx             # Displays user stories  
│   │   ├── UserDetails.jsx         # Displays detailed information about a user  
│   │   ├── UserList.jsx            # Lists all users (e.g., followers/following)  
│   ├── config/  
│   │   └── axiosInstance.js        # Configures Axios instance for making API requests  
│   ├── pages/  
│   │   ├── Footer.jsx              # Footer section of the app  
│   │   ├── Header.jsx              # Header section of the app  
│   │   ├── Home.jsx                # Home page displaying user feed  
│   │   ├── Profile.jsx             # User profile page  
│   │   ├── SignIn.jsx              # Component for signing in to the app  
│   │   ├── SignUp.jsx              # Component for signing up for the app  
│   │   └── UserProfile.jsx         # Displays profile information of another user  
│   ├── redux/  
│   │   └── user/  
│   │       └── userSlice.js        # Redux slice to manage user state  
│   │   └── store.js                # Configures Redux store for state management  
│   ├── App.jsx                     # Root component of the app  
│   ├── ErrorBoundary.jsx           # Handles errors gracefully across the app  
│   ├── firebase.js                 # Firebase configuration for the project  
│   ├── index.css                   # Global CSS styles for the app  
│   ├── main.jsx                    # Entry point of the React app  
├── .env                            # Environment variables for frontend configuration  
├── .eslintrc.cjs                   # ESLint configuration for coding standards  
├── .gitignore                      # Git ignore rules for excluding files from version control  
├── postcss.config.js               # PostCSS configuration for processing styles  
├── tailwind.config.js              # Tailwind CSS configuration  
├── vite.config.js                  # Vite configuration for bundling and development server  
├── package.json                    # Dependency manager and scripts for the frontend  
└── README.md                       # Documentation for setting up and using the frontend  
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
