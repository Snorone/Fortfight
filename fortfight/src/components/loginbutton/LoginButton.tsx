import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/Firebase"
import MainButton from "../mainbutton/MainButton";
import { createUserIfNotExists } from "../../firebase/createUserIfNotExist";


export default function LoginButton() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      await createUserIfNotExists(result.user); // 👈 viktigt!
    } catch (err) {
      console.error("Login failed", err);
    }
  };


  return <MainButton onClick={handleLogin}>🔐 Logga in med Google</MainButton>;
}