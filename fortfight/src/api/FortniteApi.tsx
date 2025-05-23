import axios from "axios";

const API_KEY = import.meta.env.VITE_FORTNITE_API_KEY; 

export const fetchFortniteStats = async (epicName: string) => {
  const url = `https://fortnite-api.com/v2/stats/br/v2?name=${epicName}`;
  
  try {
    const response = await axios.get(url, {
      headers: {
        "Authorization": API_KEY,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Fel vid API-anrop:", error);
    throw new Error("Kunde inte hämta spelarstatistik");
  }
};