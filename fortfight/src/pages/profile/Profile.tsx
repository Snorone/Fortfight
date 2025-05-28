import { useEffect, useState } from "react";
import { useUserData } from "../../hooks/useUserData";
import { fetchFortniteStats } from "../../api/FortniteApi";
import MainButton from "../../components/mainbutton/MainButton";
import { saveEpicIdToUser } from "../../firebase/saveEpicIdToUser";
import { useAuthReady } from "../../hooks/useAuthReady";
import LoginButton from "../../components/loginbutton/LoginButton";
import LogoutButton from "../../components/logoutbutton/LogoutButton";
import { onAuthStateChanged } from "firebase/auth";
import "./Profile.css";
import { auth } from "../../firebase/Firebase";
import { saveSkinToUser } from "../../firebase/saveSkinToUser";
import SkinSelect from "../../components/skinselect/SkinSelect";
import type { Skin } from "../../types/skin";
import type { UserData } from "../../types/userData";

export default function Profile() {
  const ready = useAuthReady();
  const { data, isLoading, refetch } = useUserData();

  const [playerData, setPlayerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [epicInput, setEpicInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [welcomeMsg, setWelcomeMsg] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [epicId, setEpicId] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setUser(data as UserData);
    }
  }, [data]);

  useEffect(() => {
    if (user) {
      setEpicId(user.epicId);
      setEpicInput(user.epicId || "");
    }
  }, [user]);

  useEffect(() => {
    if (!user && !isLoading && ready) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [user, isLoading, ready]);

  useEffect(() => {
    if (epicId) {
      setLoading(true);
      fetchFortniteStats(epicId)
        .then((res) => setPlayerData(res.data))
        .finally(() => setLoading(false));
    }
  }, [epicId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setShowModal(false);
        setWelcomeMsg(true);
        refetch(); // uppdatera användardata direkt
      }
    });
    return () => unsubscribe();
  }, [refetch]);

  const handleSaveEpicId = async () => {
    if (user) {
      await saveEpicIdToUser(user.uid, epicInput.trim());
      setSaved(true);
      refetch();
    }
  };

  const handleSelectSkin = async (skin: Skin) => {
    if (user?.uid) {
      await saveSkinToUser(user.uid, skin);
      setSaved(true);
      refetch(); // uppdatera användardata
    }
  };

  if (!ready) return <p>Laddar Firebase...</p>;
  if (isLoading) return <p>Laddar användare...</p>;
  return (
    <div
      className="profile-container"
     
    >
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Du är inte inloggad</h3>
            <p>
              Logga in för att se din profil och koppla ditt Epic Games-konto.
            </p>
            <LoginButton />
          </div>
        </div>
      )}

      {welcomeMsg && (
        <div className="popup-toast">
          <p>🎉 Välkommen in!</p>
        </div>
      )}
      {!user ? null : (
        <>
          <h2>Min Profil</h2>
          <p>
            <strong>Inloggad som:</strong> {user.displayName}
          </p>

          {!epicId || editing ? (
            <div className="epic-id-box">
              <h3>
                {epicId ? "Byt Epic Games ID" : "Koppla ditt Epic Games-konto"}
              </h3>
              <input
                type="text"
                placeholder="Ditt Epic ID"
                value={epicInput}
                onChange={(e) => setEpicInput(e.target.value)}
              />
              <MainButton onClick={handleSaveEpicId}>Spara</MainButton>
                <MainButton
                  onClick={() => setEditing(false)}
                >
                  Avbryt
                </MainButton>
              
              {saved && <p>✅ Sparat!</p>}
            </div>
          ) : (
            <div className="epic-id-box">
              <p>
                <strong>Epic ID:</strong> {epicId}
              </p>
              <MainButton onClick={() => setEditing(true)}>
                ✏️ Byt Epic ID
              </MainButton>
            </div>
          )}
          <SkinSelect onSelect={handleSelectSkin} />
        
          {loading && <p>Hämtar statistik...</p>}
          {playerData && (
            <div className="stats-box"  style={{
              backgroundImage: user?.skin?.image
                ? `url(${user?.skin?.image})`
                : undefined,
              backgroundSize: "70%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundColor: "white",
            }}>
              <h3>Sammanlagd statistik</h3>
              <ul>
                <li>Vinster: {playerData.stats.all.overall.wins}</li>
                <li>Kills: {playerData.stats.all.overall.kills}</li>
                <li>Matcher: {playerData.stats.all.overall.matches}</li>
                <li>K/D: {playerData.stats.all.overall.kd.toFixed(2)}</li>
                <li>
                  Winrate: {playerData.stats.all.overall.winRate.toFixed(1)}%
                </li>
                <li>
                  Kills/Match:{" "}
                  {playerData.stats.all.overall.killsPerMatch.toFixed(2)}
                </li>
              </ul>
            </div>
          )}
          <div className="logout-container">
            <LogoutButton />
          </div>
        </>
      )}
    </div>
  );
}
