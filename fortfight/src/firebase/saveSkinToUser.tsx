import { doc, updateDoc } from "firebase/firestore";
import { db } from "./Firebase";

export async function saveSkinToUser(uid: string, skin: any) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    skin,
  });
}