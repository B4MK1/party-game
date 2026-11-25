import { useState } from "react";
import cards from "../data/truthdare.json";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TruthDare({ players, onExit }) {
  const [playerIndex, setPlayerIndex] = useState(0);
  const [card, setCard] = useState(null);
  // one shuffled deck per type; refilled when empty so cards don't repeat early
  const [decks, setDecks] = useState({
    truth: shuffle(cards.filter((c) => c.type === "truth")),
    dare: shuffle(cards.filter((c) => c.type === "dare")),
  });

  const draw = (type) => {
    let deck = decks[type];
    if (deck.length === 0) {
      deck = shuffle(cards.filter((c) => c.type === type));
    }
    const [next, ...rest] = deck;
    setDecks({ ...decks, [type]: rest });
    setCard(next);
  };

  const nextPlayer = () => {
    setCard(null);
    setPlayerIndex((playerIndex + 1) % players.length);
  };

  return (
    <div className="screen">
      <h2>{players[playerIndex]}</h2>
      {!card ? (
        <>
          <button onClick={() => draw("truth")}>Үнэн</button>
          <button onClick={() => draw("dare")}>Зоримог</button>
        </>
      ) : (
        <>
          <p className="card">{card.text}</p>
          <button onClick={nextPlayer}>Дараагийн тоглогч</button>
        </>
      )}
      <button onClick={onExit}>Гарах</button>
    </div>
  );
}