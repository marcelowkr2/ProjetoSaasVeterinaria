import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="text-xl font-bold">VetSaaS</a>
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="hidden sm:inline">Olá, {user.first_name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-white text-blue-600 rounded hover:bg-gray-100"
              >
                Sair
              </button>
            </>
          ) : (
            <Link href="/login">
              <a className="px-3 py-1 bg-white text-blue-600 rounded hover:bg-gray-100">
                Entrar
              </a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}