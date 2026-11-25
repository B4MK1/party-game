export default function ModeSelect({ onPick, onBack }) {
  return (
    <div className="screen">
      <h2>Тоглоом сонгох</h2>
      <button onClick={() => onPick("truthdare")}>Үнэн ба Зоримог</button>
      <button onClick={() => onPick("mostlikely")}>Хэн хамгийн...</button>
      <button onClick={() => onPick("whoami")}>Би хэн бэ?</button>
      <button onClick={() => onPick("impostor")}>Хуурамч хэн бэ?</button>
      <button onClick={onBack}>Буцах</button>
    </div>
  );
}