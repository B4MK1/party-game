import { useState } from "react";
import cards from "../data/mostlikely.json";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MostLikely({ onExit }) {
  const [deck, setDeck] = useState(() => shuffle(cards));
  const [card, setCard] = useState(null);

  const next = () => {
    let d = deck.length ? deck : shuffle(cards);
    const [c, ...rest] = d;
    setDeck(rest);
    setCard(c);
  };

  return (
    <div className="screen">
      <p className="card">{card ? card.text : "Бэлэн үү?"}</p>
      <p>Гурав хүртэл тоолоод хамт заана!</p>
      <button onClick={next}>{card ? "Дараагийнх" : "Эхлэх"}</button>
      <button onClick={onExit}>Гарах</button>
    </div>
  );
}