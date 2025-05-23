import { signOut } from "firebase/auth";
import { auth } from "../../firebase/Firebase";
import MainButton from "../mainbutton/MainButton";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function LogoutButton() {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // 👈 ny

  const handleLogout = async () => {
    try {
      await signOut(auth);
      queryClient.clear(); // 👈 rensar all användar-cache
      navigate("/"); // skicka till startsidan
    } catch (err) {
      console.error("Fel vid utloggning:", err);
    }
  };

  return (
    <MainButton onClick={handleLogout}>
      🔓 Logga ut
    </MainButton>
  );
}
