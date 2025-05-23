import { useEffect, useState } from "react";
import { auth } from "../firebase/Firebase";

export function useAuthReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(() => {
      setReady(true); // så fort Firebase är klar, oavsett om inloggad eller ej
    });
    return () => unsub();
  }, []);

  return ready;
}