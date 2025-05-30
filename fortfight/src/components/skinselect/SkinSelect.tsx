import { useEffect, useState } from "react";
import "./SkinSelect.css";

export default function SkinSelect({ onSelect }: { onSelect: (skin: any) => void }) {
  const [skins, setSkins] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const visibleCount = 1;

  useEffect(() => {
    fetch("https://fortnite-api.com/v2/cosmetics/br?type=outfit")
      .then(res => res.json())
      .then(data => setSkins(data.data.slice(2, 50))) 
      .catch(err => console.error("Kunde inte hämta skins:", err));
  }, []);

  const handlePrev = () => setIndex(Math.max(0, index - visibleCount));
  const handleNext = () => setIndex(Math.min(skins.length - visibleCount, index + visibleCount));

  return (
    <div className="skin-select-carousel">
      <h3>Välj ett skin</h3>
      <div className="carousel-controls">
        <button onClick={handlePrev} disabled={index === 0}>◀</button>
        <div className="carousel-track">
          {skins.slice(index, index + visibleCount).map((skin) => (
            <img
              key={skin.id}
              src={skin.images.icon}
              alt={skin.name}
              title={skin.name}
              onClick={() => onSelect(skin)}
              className="skin-thumb"
            />
          ))}
        </div>
        <button onClick={handleNext} disabled={index + visibleCount >= skins.length}>▶</button>
      </div>
    </div>
  );
}
