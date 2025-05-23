import { doc, setDoc } from "firebase/firestore";
import { db } from "./Firebase";

export async function saveEpicIdToUser(userId: string, epicId: string) {
  await setDoc(
    doc(db, "users", userId),
    { epicId },
    { merge: true } 
  );
}
