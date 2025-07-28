import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../../services/api';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
        const endDate = addDays(startDate, 6);
        
        const response = await api.get('/appointments/', {
          params: {
            start_date: format(startDate, 'yyyy-MM-dd'),
            end_date: format(endDate, 'yyyy-MM-dd'),
          }
        });
        
        setAppointments(response.data);
      } catch (err) {
        setError('Erro ao carregar agendamentos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [currentDate]);

  const renderHeader = () => {
    const dateFormat = 'MMMM yyyy';
    return (
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setCurrentDate(addDays(currentDate, -7))}
          className="p-2 bg-gray-200 rounded"
        >
          Anterior
        </button>
        <h2 className="text-xl font-bold">
          {format(currentDate, dateFormat, { locale: ptBR })}
        </h2>
        <button 
          onClick={() => setCurrentDate(addDays(currentDate, 7))}
          className="p-2 bg-gray-200 rounded"
        >
          Próxima
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = 'EEEE';
    const days = [];
    let startDate = startOfWeek(currentDate, { weekStartsOn: 0 });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center font-semibold py-2" key={i}>
          {format(addDays(startDate, i), dateFormat, { locale: ptBR })}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
    const rows = [];
    let days = [];
    let day = startDate;

    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, 'yyyy-MM-dd');
      const dayAppointments = appointments.filter(app => 
        isSameDay(new Date(app.data), day)
      );

      days.push(
        <div 
          className="min-h-24 border p-1 overflow-y-auto" 
          key={day}
        >
          <div className="text-right mb-1">
            {format(day, 'd')}
          </div>
          {dayAppointments.map(app => (
            <div 
              key={app.id}
              className="p-1 mb-1 bg-blue-100 rounded text-sm"
            >
              <div className="font-semibold">{app.pet.nome}</div>
              <div>{app.horario}</div>
              <div className="text-xs">{app.servico.nome}</div>
            </div>
          ))}
        </div>
      );
      
      day = addDays(day, 1);
    }

    rows.push(
      <div className="grid grid-cols-7" key={day}>
        {days}
      </div>
    );
    
    return <div className="border rounded">{rows}</div>;
  };

  if (loading) return <div>Carregando calendário...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}