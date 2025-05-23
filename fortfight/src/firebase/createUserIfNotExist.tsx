import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./Firebase";
import type { User } from "firebase/auth";

export async function createUserIfNotExists(user: User) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      createdAt: serverTimestamp(),
    });
    console.log("✅ Ny användare skapad i Firestore");
  } else {
    console.log("🔁 Användare finns redan");
  }
}
