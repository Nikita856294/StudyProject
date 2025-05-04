import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QueryResults = ({ token }) => {
  const [queries, setQueries] = useState({
    oxygen: [],
    repairs: [],
    systems: [],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const [oxygen, repairs, systems] = await Promise.all([
          axios.get('https://study-project-back.vercel.app/api/queries/oxygen', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('https://study-project-back.vercel.app/api/queries/repairs', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('https://study-project-back.vercel.app/api/queries/systems', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setQueries({ oxygen, repairs, systems });
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Ошибка загрузки результатов');
      }
    };
    fetchQueries();
  }, [token]);

  return (
    <div className="query-results">
      <h2 className="results-title">Результаты расчетов</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="result-section">
        <h3 className="result-subtitle">Оставшийся кислород</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="table-header">ID</th>
                <th className="table-header">Текущее количество (м³)</th>
                <th className="table-header">Оставшийся кислород (м³)</th>
              </tr>
            </thead>
            <tbody>
              {queries.oxygen.map((item) => (
                <tr key={item.supply_id} className="table-row">
                  <td className="table-cell">{item.supply_id}</td>
                  <td className="table-cell">{item.current_quantity}</td>
                  <td className="table-cell">{item.remaining_oxygen.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="result-section">
        <h3 className="result-subtitle">Экипаж по количеству ремонтов</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="table-header">Имя</th>
                <th className="table-header">Фамилия</th>
                <th className="table-header">Количество ремонтов</th>
              </tr>
            </thead>
            <tbody>
              {queries.repairs.map((item) => (
                <tr key={`${item.first_name}-${item.last_name}`} className="table-row">
                  <td className="table-cell">{item.first_name}</td>
                  <td className="table-cell">{item.last_name}</td>
                  <td className="table-cell">{item.repair_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="result-section">
        <h3 className="result-subtitle">Наиболее ремонтируемая система</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="table-header">Система</th>
                <th className="table-header">Количество ремонтов</th>
              </tr>
            </thead>
            <tbody>
              {queries.systems.map((item) => (
                <tr key={item.system_name} className="table-row">
                  <td className="table-cell">{item.system_name}</td>
                  <td className="table-cell">{item.repair_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QueryResults;