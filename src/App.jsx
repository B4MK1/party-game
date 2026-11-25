import { useState } from "react";
import Home from "./screens/Home";
import PlayerSetup from "./screens/PlayerSetup";
import TruthDare from "./screens/TruthDare";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [players, setPlayers] = useState([]);

  if (screen === "home") return <Home onStart={() => setScreen("setup")} />;
  if (screen === "setup")
    return (
      <PlayerSetup
        onDone={(names) => {
          setPlayers(names);
          setScreen("game");
        }}
      />
    );
  return <TruthDare players={players} onExit={() => setScreen("home")} />;
}