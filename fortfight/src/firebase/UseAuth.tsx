import { useEffect, useState } from "react";
import { auth } from "./Firebase";
import type { User } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
export function useExtendedUser() {
  const [userData, setUserData] = useState<{ user: User | null; epicId?: string }>({ user: null });

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : {};
        setUserData({ user, epicId: data.epicId });
      } else {
        setUserData({ user: null });
      }
    });

    return () => unsub();
  }, []);

  return userData;
}
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);

  return user;
}