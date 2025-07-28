import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout/Navbar';
import api from '../services/api';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats/');
        setStats(response.data);
      } catch (err) {
        setError('Erro ao carregar dados do dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Layout>Carregando...</Layout>;
  if (error) return <Layout>{error}</Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Pets Cadastrados</h3>
            <p className="text-2xl font-bold">{stats?.total_pets || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Agendamentos Hoje</h3>
            <p className="text-2xl font-bold">{stats?.appointments_today || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Tutores Ativos</h3>
            <p className="text-2xl font-bold">{stats?.active_tutors || 0}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}