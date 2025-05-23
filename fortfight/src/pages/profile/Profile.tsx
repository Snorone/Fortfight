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

export default function Profile() {
  const ready = useAuthReady();
  const { data: userData, isLoading, isError, refetch } = useUserData();

  const [playerData, setPlayerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [epicInput, setEpicInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [welcomeMsg, setWelcomeMsg] = useState(false);

  const epicId = userData?.epicId || "";
  const user = userData;

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
      window.location.reload();
    }
  };

  if (!ready) return <p>Laddar Firebase...</p>;
  if (isLoading) return <p>Laddar användare...</p>;

  return (
    <div className="profile-container">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Du är inte inloggad</h3>
            <p>Logga in för att se din profil och koppla ditt Epic Games-konto.</p>
            <LoginButton />
          </div>
        </div>
      )}

{welcomeMsg && (
        <div className="welcome-msg">
          <p>🎉 Välkommen in!</p>
        </div>
      )}
      {!user ? null : (
        <>
          <h2>Min Profil</h2>
          <p><strong>Inloggad som:</strong> {user.displayName}</p>

          {!epicId || editing ? (
            <div className="epic-id-box">
              <h3>{epicId ? "Byt Epic Games ID" : "Koppla ditt Epic Games-konto"}</h3>
              <input
                type="text"
                placeholder="Ditt Epic ID"
                value={epicInput}
                onChange={(e) => setEpicInput(e.target.value)}
              />
              <MainButton onClick={handleSaveEpicId}>Spara</MainButton>
              {epicId && (
                <button onClick={() => setEditing(false)} className="cancel-edit">
                  Avbryt
                </button>
              )}
              {saved && <p>✅ Sparat!</p>}
            </div>
          ) : (
            <div className="epic-id-box">
              <p><strong>Epic ID:</strong> {epicId}</p>
              <MainButton onClick={() => setEditing(true)}>✏️ Byt Epic ID</MainButton>
            </div>
          )}

          {loading && <p>Hämtar statistik...</p>}
          {playerData && (
            <div className="stats-box">
              <h3>Sammanlagd statistik</h3>
              <ul>
                <li>Vinster: {playerData.stats.all.overall.wins}</li>
                <li>Kills: {playerData.stats.all.overall.kills}</li>
                <li>Matcher: {playerData.stats.all.overall.matches}</li>
                <li>K/D: {playerData.stats.all.overall.kd.toFixed(2)}</li>
                <li>Winrate: {playerData.stats.all.overall.winRate.toFixed(1)}%</li>
                <li>Kills/Match: {playerData.stats.all.overall.killsPerMatch.toFixed(2)}</li>
              </ul>
            </div>
          )}
          <div className="logout-container">
  <LogoutButton/>
</div>
        </>
        
      )}
    </div>
  );
}
