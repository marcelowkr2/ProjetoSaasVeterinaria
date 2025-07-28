import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import api from '../../services/api';

export default function AppointmentForm({ date, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    data: date ? format(date, 'yyyy-MM-dd') : '',
    horario: '',
    pet: '',
    servico: '',
    veterinario: '',
    observacoes: ''
  });
  const [pets, setPets] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petsRes, servicosRes, vetsRes] = await Promise.all([
          api.get('/pets/'),
          api.get('/appointments/servicos/'),
          api.get('/veterinarians/')
        ]);
        
        setPets(petsRes.data);
        setServicos(servicosRes.data);
        setVeterinarios(vetsRes.data);
      } catch (err) {
        setError('Erro ao carregar dados');
        console.error(err);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/appointments/', formData);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao agendar');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Novo Agendamento</h2>
        
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Data</label>
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Horário</label>
              <input
                type="time"
                name="horario"
                value={formData.horario}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Pet</label>
              <select
                name="pet"
                value={formData.pet}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Selecione um pet</option>
                {pets.map(pet => (
                  <option key={pet.id} value={pet.id}>
                    {pet.nome} ({pet.tutor.user.first_name})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Serviço</label>
              <select
                name="servico"
                value={formData.servico}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Selecione um serviço</option>
                {servicos.map(servico => (
                  <option key={servico.id} value={servico.id}>
                    {servico.nome} (R$ {servico.valor.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Veterinário</label>
              <select
                name="veterinario"
                value={formData.veterinario}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Selecione um veterinário</option>
                {veterinarios.map(vet => (
                  <option key={vet.id} value={vet.id}>
                    Dr. {vet.user.first_name} {vet.user.last_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Observações</label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Agendando...' : 'Agendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}