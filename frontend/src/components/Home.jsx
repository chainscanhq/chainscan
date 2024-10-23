import { Link } from "react-router-dom";
import Login from "./Login";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-bgblue">
      <h1 className="text-5xl text-white font-sans py-4">ChainScan</h1>
      <p className="text-3xl text-white font-sans">
        Verifying product authenticity on Solana
      </p>
      <Login />
    </div>
  );
}

export default Home;
