import { useState } from "react";
import Home from "./screens/Home";
import PlayerSetup from "./screens/PlayerSetup";
import ModeSelect from "./screens/ModeSelect";
import TruthDare from "./screens/TruthDare";
import MostLikely from "./screens/MostLikely";
import WhoAmI from "./screens/WhoAmI";
import Impostor from "./screens/Impostor";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [players, setPlayers] = useState([]);

  if (screen === "home") return <Home onStart={() => setScreen("setup")} />;

  if (screen === "setup")
    return (
      <PlayerSetup
        onDone={(names) => {
          setPlayers(names);
          setScreen("modes");
        }}
      />
    );

  if (screen === "modes")
    return <ModeSelect onPick={setScreen} onBack={() => setScreen("home")} />;

  if (screen === "truthdare")
    return <TruthDare players={players} onExit={() => setScreen("modes")} />;

  if (screen === "mostlikely")
    return <MostLikely onExit={() => setScreen("modes")} />;
  if (screen === "whoami")
    return <WhoAmI onExit={() => setScreen("modes")} />;
  if (screen === "impostor")
    return <Impostor players={players} onExit={() => setScreen("modes")} />;
}