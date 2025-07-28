import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function PetForm({ petData, onSuccess }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    tutor: '',
    especie: '',
    raca: '',
    data_nascimento: '',
    sexo: 'M',
    peso: '',
    observacoes: '',
    ...petData
  });
  const [especies, setEspecies] = useState([]);
  const [racas, setRacas] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [especiesRes, tutoresRes] = await Promise.all([
          api.get('/pets/especies/'),
          api.get('/pets/tutores/')
        ]);
        
        setEspecies(especiesRes.data);
        setTutores(tutoresRes.data);
        
        if (formData.especie) {
          fetchRacas(formData.especie);
        }
      } catch (err) {
        setError('Erro ao carregar dados');
        console.error(err);
      }
    };
    
    fetchData();
  }, []);

  const fetchRacas = async (especieId) => {
    try {
      const response = await api.get(`/pets/racas/?especie=${especieId}`);
      setRacas(response.data);
    } catch (err) {
      console.error('Erro ao carregar raças:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'especie') {
      fetchRacas(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (formData.id) {
        await api.put(`/pets/${formData.id}/`, formData);
      } else {
        await api.post('/pets/', formData);
      }
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar pet');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        {formData.id ? 'Editar Pet' : 'Cadastrar Novo Pet'}
      </h2>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tutor</label>
            <select
              name="tutor"
              value={formData.tutor}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecione um tutor</option>
              {tutores.map(tutor => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.user.first_name} {tutor.user.last_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Espécie</label>
            <select
              name="especie"
              value={formData.especie}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecione uma espécie</option>
              {especies.map(especie => (
                <option key={especie.id} value={especie.id}>
                  {especie.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Raça</label>
            <select
              name="raca"
              value={formData.raca}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              disabled={!formData.especie}
            >
              <option value="">Selecione uma raça</option>
              {racas.map(raca => (
                <option key={raca.id} value={raca.id}>
                  {raca.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Data de Nascimento</label>
            <input
              type="date"
              name="data_nascimento"
              value={formData.data_nascimento}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Sexo</label>
            <select
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="M">Macho</option>
              <option value="F">Fêmea</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              name="peso"
              value={formData.peso}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Observações</label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}