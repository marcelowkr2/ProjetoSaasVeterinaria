import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function PetList() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await api.get('/pets/');
        setPets(response.data);
      } catch (err) {
        setError('Erro ao carregar pets');
        console.error('Error fetching pets:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPets();
  }, []);

  if (loading) return <div className="text-center py-8">Carregando...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Pets Cadastrados</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <div key={pet.id} className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold">{pet.nome}</h3>
            <p className="text-gray-600">Tutor: {pet.tutor.user.first_name} {pet.tutor.user.last_name}</p>
            <p className="text-gray-600">Espécie: {pet.especie.nome}</p>
            {pet.raca && <p className="text-gray-600">Raça: {pet.raca.nome}</p>}
            <p className="text-gray-600">Sexo: {pet.sexo === 'M' ? 'Macho' : 'Fêmea'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}