import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../components/Auth/LoginForm';
import Layout from '../components/Layout/Navbar';

export default function LoginPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Se o usuário já estiver logado, redireciona para o dashboard
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.push('/dashboard');
    }
  }, []);

  return (
    <Layout noNavbar>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoginForm />
      </div>
    </Layout>
  );
}