import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GrHome,
  GrSearch,
  GrAdd,
  GrFavorite,
  GrUser,
  GrChatOption,
  GrMenu,
} from "react-icons/gr";
import { AiFillCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import Search from "../components/Search";

const themeColors = {
  light: '#000000', // Black for light theme
  dark: '#ffffff', // White for dark theme
  coffee: '#6F4E37', // Coffee color for coffee theme
  // Add other theme colors as needed
};

const FooterDrawer = ({ theme, setTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [showSearch, setShowSearch] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const userId = currentUser ? currentUser._id : null;

  const iconColor = themeColors[theme] || '#000000'; // Default color

  const handleLinkClick = (path) => {
    setDrawerOpen(false);
    if (!currentUser) {
      navigate("/signin");
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {showSearch && currentUser && <Search />}
      {!drawerOpen && (
        <button
          onClick={() => setDrawerOpen(true)}
          style={{ color: iconColor }}
          className="fixed top-17 left-0 z-50 sticky"
        >
          <GrMenu size={24} />
        </button>
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-white z-40 transform ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
        style={{ width: "80%", maxWidth: "300px" }}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setDrawerOpen(false)}>
            <AiFillCloseCircle size={24} style={{ color: iconColor }} />
          </button>
        </div>
        <div className="flex flex-col items-start p-4 space-y-4">
          <button
            className={`text-gray-500 flex items-center ${
              location.pathname === "/" && "text-black"
            }`}
            onClick={() => handleLinkClick("/")}
          >
            <GrHome size={24} style={{ color: iconColor }} />
            <span className="ml-2 text-base">Home</span>
          </button>
          {currentUser && (
            <button
              className={`text-gray-500 flex items-center ${
                location.pathname === "/search" && "text-black"
              }`}
              onClick={() => {
                setShowSearch(!showSearch);
                setDrawerOpen(false);
              }}
            >
              <GrSearch size={24} style={{ color: iconColor }} />
              <span className="ml-2 text-base">Search</span>
            </button>
          )}
          <button
            className="text-gray-500 flex items-center"
            onClick={() => handleLinkClick("/postCreate")}
          >
            <GrAdd size={24} style={{ color: iconColor }} />
            <span className="ml-2 text-base">New Post</span>
          </button>
          <button
            className={`text-gray-500 flex items-center ${
              location.pathname === "/stories" && "text-black"
            }`}
            onClick={() => handleLinkClick("/stories")}
          >
            <GrFavorite size={24} style={{ color: iconColor }} />
            <span className="ml-2 text-base">Stories</span>
          </button>
          <button
            className={`text-gray-500 flex items-center ${
              location.pathname.startsWith("/profile") && "text-black"
            }`}
            onClick={() => handleLinkClick(`/profile/${userId}`)}
          >
            <GrUser size={24} style={{ color: iconColor }} />
            <span className="ml-2 text-base">Profile</span>
          </button>
          <button
            className={`text-gray-500 flex items-center ${
              location.pathname === "/messages" && "text-black"
            }`}
            onClick={() => handleLinkClick("/messages")}
          >
            <GrChatOption size={24} style={{ color: iconColor }} />
            <span className="ml-2 text-base">Message</span>
          </button>
          <div className="mt-4">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="select select-bordered"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="coffee">Coffee</option>
              <option value="cupcake">Cupcake</option>
              <option value="bumblebee">Bumblebee</option>
              <option value="emerald">Emerald</option>
              <option value="corporate">Corporate</option>
              <option value="synthwave">Synthwave</option>
              <option value="retro">Retro</option>
              <option value="cyberpunk">Cyberpunk</option>
              <option value="valentine">Valentine</option>
              <option value="halloween">Halloween</option>
              <option value="garden">Garden</option>
              <option value="forest">Forest</option>
              <option value="aqua">Aqua</option>
              <option value="lofi">Lofi</option>
              <option value="pastel">Pastel</option>
              <option value="fantasy">Fantasy</option>
              <option value="wireframe">Wireframe</option>
              <option value="black">Black</option>
              <option value="luxury">Luxury</option>
              <option value="dracula">Dracula</option>
              <option value="cmyk">CMYK</option>
              <option value="autumn">Autumn</option>
              <option value="business">Business</option>
              <option value="acid">Acid</option>
              <option value="lemonade">Lemonade</option>
              <option value="night">Night</option>
              <option value="winter">Winter</option>
              <option value="dim">Dim</option>
              <option value="nord">Nord</option>
              <option value="sunset">Sunset</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default FooterDrawer;
