import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiSend, FiFile } from "react-icons/fi";
import {
  AiOutlinePaperClip,
  AiOutlineFileImage,
  AiOutlineVideoCamera,
} from "react-icons/ai";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const UserDetails = () => {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [messageText, setMessageText] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const socket = io("https://my-social-media-v6xp.onrender.com", {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 5000,
  transports: ["websocket", "polling"], 
});


  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("disconnect", (reason) => {
    console.log("Disconnected:", reason);
    if (reason === "io server disconnect") {
      // The disconnection was initiated by the server, you need to reconnect manually
      socket.connect();
    }
  });

  socket.on("connect_error", (err) => {
    console.error("Connection error:", err.message);
  });

  socket.on("reconnect_attempt", (attemptNumber) => {
    console.log(`Reconnection attempt ${attemptNumber}`);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(`Reconnected after ${attemptNumber} attempts`);
  });

  socket.on("reconnect_failed", () => {
    console.error("Reconnection failed");
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/v1/user/${id}`);
        if (!response.ok) {
          console.error("Network response was not ok");
          return;
        }
        const userData = await response.json();
        setUserDetails(userData);

        // Determine the correct roomId
        let newRoomId = "";
        if (currentUser._id < userData._id) {
          newRoomId = `${currentUser._id}-${userData._id}`;
        } else {
          newRoomId = `${userData._id}-${currentUser._id}`;
        }
        setRoomId(newRoomId);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
    socket.emit("connectUser", id);

    return () => {
      socket.disconnect();
    };
  }, [id, currentUser._id, socket]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!roomId) return;
      try {
        const response = await fetch(
          `/api/v1/message/messages?roomId=${roomId}&me=${currentUser._id}&id=${id}`
        );
        if (!response.ok) {
          console.error("Network response was not ok");
          return;
        }
        const messageData = await response.json();
        setMessages(messageData);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [messages]);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, [socket]);

  const handleMessageSend = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("senderId", currentUser._id);
    formData.append("receiverId", id);
    formData.append("text", messageText);
    formData.append("roomId", roomId);
    if (file) {
      if (file.type.startsWith("image/")) {
        formData.append("fileUrl", file);
      } else if (file.type.startsWith("video/")) {
        formData.append("videofile", file);
      }
    }

    try {
      const response = await fetch("/api/v1/message", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Network response was not ok");
        return;
      }

      const newMessage = await response.json();
      socket.emit("sendMessage", newMessage);

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageText("");
      setFile(null);
      setFilePreview(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-screen-lg mx-auto mt-8 px-4">
      <h2 className="text-2xl font-semibold mb-4">
        Messaging with {userDetails.username}
      </h2>
      <div className="flex items-center mb-4">
        <img
          src={userDetails.avatar.secure_url}
          alt={`${userDetails.username}'s avatar`}
          className="w-8 h-8 rounded-full mr-2"
        />
        <p className="text-sm">{userDetails.username}</p>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Messaging</h3>
        <div className="bg-gray-100 p-4 rounded-lg mb-4 max-h-[50vh] overflow-y-auto">
          {messages && messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 mb-2 rounded shadow ${
                  message.senderId === currentUser._id
                    ? "bg-gray-800 text-white self-end"
                    : "bg-gray-200 text-black self-start"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                {message.fileUrl && message.fileUrl.secure_url && (
                  <img
                    src={message.fileUrl.secure_url}
                    alt="Message Image"
                    className="mt-2 max-w-full h-auto"
                  />
                )}
                {message.videofile && message.videofile.secure_url && (
                  <video
                    controls
                    src={message.videofile.secure_url}
                    alt="Video"
                    className="mt-2 max-w-full h-auto"
                  ></video>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No messages yet.</p>
          )}
        </div>
        <form onSubmit={handleMessageSend} className="flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow p-2 border border-gray-300 rounded mr-2"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <label htmlFor="file-upload" className="cursor-pointer text-gray-500">
            <AiOutlinePaperClip size={24} />
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded ml-2"
          >
            <FiSend size={24} />
          </button>
        </form>
        {file && (
          <div className="mt-2 flex items-center">
            {file.type.startsWith("image/") ? (
              <AiOutlineFileImage size={24} />
            ) : file.type.startsWith("video/") ? (
              <AiOutlineVideoCamera size={24} />
            ) : (
              <FiFile size={24} />
            )}
            <p className="ml-2">{file.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
