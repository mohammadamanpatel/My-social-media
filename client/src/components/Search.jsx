import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const Search = () => {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setQuery(query);

    if (query.length > 2) {
      try {
        const response = await fetch(`/api/v1/user/search?query=${query}`);
        if (response.ok) {
          const users = await response.json();
          setSearchResults(users);
        } else {
          console.error("Failed to fetch search results");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (location.pathname === "/") {
      // Reset search state when navigating back to homepage
      setQuery("");
      setSearchResults([]);
    } else if (location.pathname === `/profile/${currentUser._id}`) {
      setQuery("");
      setSearchResults([]);
    }
  }, [location.pathname]);

  // Don't render the search bar on userProfile pages
  if (location.pathname.startsWith("/userProfile/")) {
    return null;
  }

  return (
    <div className="search-container relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search for username"
        className="search-input w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {searchResults.length > 0 && (
        <div className="search-results absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          {searchResults.map((user) => (
            <Link key={user._id} to={`/userProfile/${user._id}`}>
              <div className="search-result-item flex items-center p-2 hover:bg-gray-100 transition duration-200 ease-in-out">
                <img
                  src={user.avatar.secure_url}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="ml-3 font-medium text-gray-900">
                  {user.username}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
