import type { Skin } from "./skin";

export interface UserData {
    uid: string;
    displayName: string;
    email: string;
    epicId: string | null;
    skin: Skin | null;
}