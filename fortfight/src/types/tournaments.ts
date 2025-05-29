import { Timestamp } from "firebase/firestore";

export interface Tournaments {
  id: string;
  title: string;
  category: string;
  players: string[];
  startStats: { name: string; value: number }[];
  endDate: Timestamp;
  createdAt: Timestamp;
  createdBy: string;
}