import { useState } from "react";

export default function PlayerSetup({ onDone }) {
  const [names, setNames] = useState([]);
  const [input, setInput] = useState("");

  const add = () => {
    const name = input.trim();
    if (!name || names.length >= 10) return;
    setNames([...names, name]);
    setInput("");
  };

  return (
    <div className="screen">
      <h2>Тоглогчид</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && add()}
        placeholder="Нэр оруул"
      />
      <button onClick={add}>Нэмэх</button>
      <ul>
        {names.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
      <button disabled={names.length < 2} onClick={() => onDone(names)}>
        Тоглож эхлэх
      </button>
    </div>
  );
}