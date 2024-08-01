import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { AiFillGoogleCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";
import app from "../firebase"; // Assuming this is correctly exporting your Firebase app instance

console.log("app", app);
export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      console.log("resultsFromGoogle", resultsFromGoogle);

      // Example: Fetch to your backend
      const res = await fetch("/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          photo: resultsFromGoogle.user.photoURL,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      type="button"
      className="flex items-center justify-center w-full max-w-xs mx-auto px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 hover:from-pink-600 hover:to-orange-600 dark:bg-gray-800 dark:text-white dark:hover:from-pink-600 dark:hover:to-orange-600 sm:w-auto sm:max-w-none"
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </button>
  );
}
