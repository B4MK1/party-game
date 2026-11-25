import { useState, useEffect, useRef } from "react";
import cards from "../data/whoami.json";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUND = 60;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

export default function WhoAmI({ onExit }) {
  const [phase, setPhase] = useState("intro"); // intro | countdown | playing | done
  const [count, setCount] = useState(3);
  const [time, setTime] = useState(ROUND);
  const [card, setCard] = useState(null);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState(null); // "ok" | "skip" | null
  const [tiltOn, setTiltOn] = useState(false);

  const deckRef = useRef(shuffle(cards));
  const armed = useRef(true);
  const answerRef = useRef(null);

  const nextCard = () => {
    if (deckRef.current.length === 0) deckRef.current = shuffle(cards);
    const [c, ...rest] = deckRef.current;
    deckRef.current = rest;
    setCard(c);
  };

  const answer = (correct) => {
    armed.current = false;
    if (correct) setScore((s) => s + 1);
    setFlash(correct ? "ok" : "skip");
    setTimeout(() => setFlash(null), 700);
    nextCard();
  };
  answerRef.current = answer;

  const start = async () => {
    // iPhone requires a permission request triggered by a tap
    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      try {
        const r = await DeviceMotionEvent.requestPermission();
        setTiltOn(r === "granted");
      } catch {
        setTiltOn(false);
      }
    } else if (typeof DeviceMotionEvent !== "undefined") {
      setTiltOn(true);
    }
    setScore(0);
    setTime(ROUND);
    setCount(3);
    armed.current = true;
    setPhase("countdown");
  };

  // 3-2-1 countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    if (count === 0) {
      nextCard();
      setPhase("playing");
      return;
    }
    const t = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, count]);

  // round timer
  useEffect(() => {
    if (phase !== "playing") return;
    if (time <= 0) {
      setPhase("done");
      return;
    }
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, time]);

  // tilt detection
  useEffect(() => {
    if (phase !== "playing" || !tiltOn) return;
    const handler = (e) => {
      const g = e.accelerationIncludingGravity;
      if (!g || g.z == null) return;
      const z = g.z * (isIOS ? -1 : 1);
      if (Math.abs(z) < 3) {
        armed.current = true; // phone back to upright
        return;
      }
      if (!armed.current) return;
      if (z < -6) answerRef.current(true); // screen faces floor = correct
      else if (z > 6) answerRef.current(false); // screen faces ceiling = skip
    };
    window.addEventListener("devicemotion", handler);
    return () => window.removeEventListener("devicemotion", handler);
  }, [phase, tiltOn]);

  const bg =
    flash === "ok" ? "#1b9e4b" : flash === "skip" ? "#c77d0a" : "#1a1a2e";

  if (phase === "intro")
    return (
      <div className="screen">
        <h2>Би хэн бэ?</h2>
        <p>Утсаа духан дээрээ барь. Бусад нь тайлбарлаж өгнө.</p>
        <p>Доош хазай = зөв ✓ &nbsp; Дээш хазай = алгасах →</p>
        <button onClick={start}>Эхлэх</button>
        <button onClick={onExit}>Буцах</button>
      </div>
    );

  if (phase === "countdown")
    return (
      <div className="screen">
        <p>Утсаа духан дээрээ тавь!</p>
        <h1 style={{ fontSize: "5rem" }}>{count}</h1>
      </div>
    );

  if (phase === "playing")
    return (
      <div className="screen" style={{ background: bg }}>
        <p>⏱ {time}</p>
        <p className="card" style={{ fontSize: "2.5rem" }}>
          {flash === "ok" ? "✓ Зөв!" : flash === "skip" ? "Алгасав" : card?.text}
        </p>
        <p>Оноо: {score}</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => answer(false)}>Алгасах</button>
          <button onClick={() => answer(true)}>Зөв ✓</button>
        </div>
        {!tiltOn && <p>Хазайлт ажиллахгүй байна, товчоор тоглоно уу.</p>}
      </div>
    );

  return (
    <div className="screen">
      <h2>Дууслаа!</h2>
      <h1 style={{ fontSize: "4rem" }}>{score}</h1>
      <button onClick={start}>Дахин тоглох</button>
      <button onClick={onExit}>Гарах</button>
    </div>
  );
}