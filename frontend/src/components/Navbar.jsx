import { Link } from "react-router-dom";
import { CustomWalletMultiButton } from "./WalletConfig";

function Navbar() {
  return (
    <header className="border-b border-gray-400 p-4">
      <nav className="flex space-x-4">
        <Link to="/" className="text-white">
          Home
        </Link>
        <Link to="/add" className="text-white">
          New
        </Link>
        {/* <CustomWalletMultiButton /> */}
      </nav>
    </header>
  );
}

export default Navbar;
