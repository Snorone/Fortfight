import { useQuery } from "@tanstack/react-query";
import { auth } from "../firebase/Firebase";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { useAuthReady } from "./useAuthReady";

export const useUserData = () => {
  const ready = useAuthReady();

  return useQuery({
    queryKey: ["userData"],
    enabled: ready,
    queryFn: () =>
      new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {

          unsubscribe();

          if (!user) {

            return reject("Ingen användare inloggad");
          }

          const ref = doc(db, "users", user.uid);
          const snap = await getDoc(ref);
          const data = snap.exists() ? snap.data() : {};

          console.log("✅ Användardata hämtad:", {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            epicId: data.epicId ?? null,
          });

          resolve({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            epicId: data.epicId ?? null,
          });
        });
      }),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: false,
  });
};
