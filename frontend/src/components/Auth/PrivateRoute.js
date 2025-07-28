import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';

export default function PrivateRoute({ children, requiredRoles = [] }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // Verificar token e permissões
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (requiredRoles.length > 0 && !requiredRoles.includes(user.user_type)) {
          router.push('/unauthorized');
          return;
        }

        // Verificar token válido no backend
        await api.get('/core/profile/');
        setIsAuthorized(true);
      } catch (err) {
        console.error('Auth error:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Verificando autenticação...</div>;
  if (!isAuthorized) return null;

  return children;
}