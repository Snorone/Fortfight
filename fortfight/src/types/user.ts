export interface User{
    uid: string;
    displayName: string;
    email: string;
    epicId: string | null;
    skin: {
        id: string;
        name: string;
        image: string;
    } | null;
    wins?: number; // Optional, as it might not be present in all user objects
    kills?: number; // Optional, as it might not be present in all user objects
    killsDeath?: number; // Optional, as it might not be present in all user objects
    killsPerMatch?: number; // Optional, as it might not be present in all user objects
}