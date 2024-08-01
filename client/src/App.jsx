import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";

// Lazy load your components
const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/SignIn"));
const FooterDrawer = lazy(() => import("./pages/Footer"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const CreatePost = lazy(() => import("./components/CreatePost"));
const CreateStory = lazy(() => import("./components/Createstory"));
const Stories = lazy(() => import("./components/Stories"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const ShowAllPosts = lazy(() => import("./components/ShowAllPosts"));
const EditPost = lazy(() => import("./components/EditPost"));
const DeletePost = lazy(() => import("./components/DeletePost"));
const AllComments = lazy(() => import("./components/Allcomments"));
const MessageComponent = lazy(() => import("./components/MessageComponent"));
const UserDetails = lazy(() => import("./components/UserDetails"));
const Header = lazy(() => import("./pages/Header"));

const App = () => {
  const [theme, setTheme] = useState("coffee");

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  return (
    <div data-theme={theme} className="container">
      <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
          <FooterDrawer theme={theme} setTheme={setTheme} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/messages" element={<MessageComponent />} />
            <Route path="/messages/:id" element={<UserDetails />} />
            <Route path="/comments/:postId" element={<AllComments />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/postCreate" element={<CreatePost />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/create-story" element={<CreateStory />} />
            <Route path="/userProfile/:id" element={<UserProfile />} />
            <Route path="/profile/showallposts" element={<ShowAllPosts />} />
            <Route path="/profile/showallposts/editPost/:id" element={<EditPost />} />
            <Route path="/profile/showallposts/deletePost/:id" element={<DeletePost />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  );
};

export default App;
