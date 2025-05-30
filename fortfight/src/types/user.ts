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
    wins?: number; 
    kills?: number; 
    killsDeath?: number; 
    killsPerMatch?: number;
}