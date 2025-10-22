import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-surface p-4 mb-8 shadow-md border-b-2 border-brand-green">
      <div className="max-w-7xl mx-auto">
        <Link to="/">
          <img src="/logo.png" alt="PESIRA Logo" className="h-14 w-auto" />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;