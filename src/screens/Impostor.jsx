import { useState, useEffect } from "react";
import data from "../data/impostor.json";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function HoldToReveal({ children }) {
  const [holding, setHolding] = useState(false);
  return (
    <div
      className="card secret"
      onPointerDown={() => setHolding(true)}
      onPointerUp={() => setHolding(false)}
      onPointerLeave={() => setHolding(false)}
      onPointerCancel={() => setHolding(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {holding ? children : "👆 Харахын тулд дарж барь"}
    </div>
  );
}

export default function Impostor({ players, onExit }) {
  const n = players.length;
  const [phase, setPhase] = useState("setup"); // setup | pass | show | discuss | result
  const [impostorCount, setImpostorCount] = useState(1);
  const [showCategory, setShowCategory] = useState(true);
  const [minutes, setMinutes] = useState(3);
  const [game, setGame] = useState(null);
  const [idx, setIdx] = useState(0);
  const [time, setTime] = useState(0);
  const [similarMode, setSimilarMode] = useState(true);

  const maxImpostors = n >= 7 ? 3 : n >= 5 ? 2 : 1;
  const count = Math.min(impostorCount, maxImpostors);

  const startGame = () => {
  const cat = data[Math.floor(Math.random() * data.length)];
  const entry = cat.words[Math.floor(Math.random() * cat.words.length)];
  const word = typeof entry === "string" ? entry : entry.word;
  const similar = typeof entry === "string" ? null : entry.similar;
  const impostors = shuffle([...Array(n).keys()]).slice(0, count);
  setGame({
    category: cat.category,
    word,
    similar,
    impostors,
    starter: Math.floor(Math.random() * n),
  });
  setIdx(0);
  setTime(minutes * 60);
  setPhase("pass");
  };

  const nextPlayer = () => {
    if (idx + 1 >= n) setPhase("discuss");
    else {
      setIdx(idx + 1);
      setPhase("pass");
    }
  };

  useEffect(() => {
    if (phase !== "discuss" || time <= 0) return;
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, time]);

  const fmt = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (phase === "setup")
    return (
      <div className="screen">
        <h2>Хуурамч хэн бэ?</h2>
        <p>
          Бүгд нэг үгийг харна. Зөвхөн хуурамч мэдэхгүй. Үгээ хэлэлгүйгээр
          hint өгч, хуурамчийг ол!
        </p>

        <p>Хуурамчийн тоо: {count}</p>
        <div style={{ display: "flex", gap: 12 }}>
          {[1, 2, 3].map((k) => (
            <button
              key={k}
              disabled={k > maxImpostors}
              style={{ opacity: count === k ? 1 : 0.5 }}
              onClick={() => setImpostorCount(k)}
            >
              {k}
            </button>
          ))}
        </div>

        <p>Ярилцах хугацаа: {minutes} мин</p>
        <div style={{ display: "flex", gap: 12 }}>
          {[2, 3, 5].map((m) => (
            <button
              key={m}
              style={{ opacity: minutes === m ? 1 : 0.5 }}
              onClick={() => setMinutes(m)}
            >
              {m}
            </button>
          ))}
        </div>

        <label>
          <input
            type="checkbox"
            checked={showCategory}
            onChange={(e) => setShowCategory(e.target.checked)}
          />{" "}
          Хуурамчид ангиллыг үзүүлэх
        </label>
        <label>
          <input
            type="checkbox"
            checked={similarMode}
            onChange={(e) => setSimilarMode(e.target.checked)}
          />{" "}
          Хуурамч ойролцоо үг авна (өөрийгөө мэдэхгүй)
        </label>

        {n < 3 && <p>Хамгийн багадаа 3 тоглогч хэрэгтэй.</p>}
        <button disabled={n < 3} onClick={startGame}>
          Эхлэх
        </button>
        <button onClick={onExit}>Буцах</button>
      </div>
    );

  if (phase === "pass")
    return (
      <div className="screen">
        <p>Утсаа дараах хүнд өг</p>
        <h1>{players[idx]}</h1>
        <button onClick={() => setPhase("show")}>Би {players[idx]}</button>
      </div>
    );

  if (phase === "show") {
  const isImpostor = game.impostors.includes(idx);
  const hasSimilar = similarMode && game.similar;

  // Similar mode: the impostor's screen looks exactly like a normal one
  if (!isImpostor || hasSimilar) {
  return (
    <div className="screen">
      <h2>{players[idx]}</h2>
      <HoldToReveal key={idx}>
        <p>Ангилал: {game.category}</p>
        <h1>{isImpostor ? game.similar : game.word}</h1>
      </HoldToReveal>
      <button onClick={nextPlayer}>Ойлголоо, нуух</button>
    </div>
  );
}

  // Classic mode: the impostor knows they are the impostor
// Classic mode: the impostor knows they are the impostor
return (
  <div className="screen">
    <h2>{players[idx]}</h2>
    <HoldToReveal key={idx}>
      <h1 style={{ color: "#e94560" }}>Чи ХУУРАМЧ!</h1>
      {showCategory && <p>Ангилал: {game.category}</p>}
      <p>Бусдын үгийг таамагла.</p>
    </HoldToReveal>
    <button onClick={nextPlayer}>Ойлголоо, нуух</button>
  </div>
  );
  }

  if (phase === "discuss")
    return (
      <div className="screen">
        <h2>{players[game.starter]} эхэлнэ</h2>
        <p>Хүн бүр нэг hint хэлнэ. Дараа нь санал өгнө.</p>
        <h1>{fmt(time)}</h1>
        {time === 0 && <p>Хугацаа дууслаа! Саналаа өгцгөөе.</p>}
        <button onClick={() => setPhase("result")}>Хуурамчийг илчлэх</button>
      </div>
    );

  return (
    <div className="screen">
      <h2>Хуурамч нь:</h2>
      <h1 style={{ color: "#e94560" }}>
        {game.impostors.map((i) => players[i]).join(", ")}
      </h1>
      <div className="card">Үг: {game.word}</div>
        {similarMode && game.similar && (
      <div className="card">Хуурамчийн үг: {game.similar}</div>
)}
      <button onClick={startGame}>Дахин тоглох</button>
      <button onClick={onExit}>Гарах</button>
    </div>
  );
}