export default function Home({ onStart }) {
  return (
    <div className="screen">
      <h1>Тоглоом</h1>
      <button onClick={onStart}>Эхлэх</button>
    </div>
  );
}