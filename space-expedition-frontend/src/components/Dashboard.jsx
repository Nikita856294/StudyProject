import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import QueryResults from './QueryResults';
import Logo from './Logo';

const Dashboard = ({ token, setToken }) => {
  const [table, setTable] = useState('crew');
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState('last_name');
  const [order, setOrder] = useState('ASC');
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  const tables = [
    { name: 'crew', label: 'Экипаж', fields: ['first_name', 'last_name', 'role', 'health_status'], filters: ['Captain', 'Engineer', 'Scientist', 'Medic', 'Navigator'] },
    { name: 'supplies', label: 'Запасы', fields: ['supply_type', 'quantity', 'unit', 'last_updated'], filters: ['Food', 'Fuel', 'Oxygen'] },
    { name: 'repairs', label: 'Ремонты', fields: ['system_name', 'repair_date', 'description', 'crew_id'], filters: [] },
    { name: 'experiments', label: 'Эксперименты', fields: ['experiment_name', 'experiment_date', 'results', 'crew_id'], filters: [] },
    { name: 'alienEncounters', label: 'Встречи с инопланетянами', fields: ['encounter_date', 'civilization_name', 'description', 'crew_id'], filters: [] },
  ];

  const fetchData = async () => {
    try {
      const params = { sortBy, order, ...(filter && { filterRole: filter }), ...(search && { search }) };
      const response = await axios.get(`https://study-project-back.vercel.app/api/${table}`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка загрузки данных');
    }
  };

  useEffect(() => {
    fetchData();
  }, [table, sortBy, order, filter, search]);

  const handleInsert = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://study-project-back.vercel.app/api/${table}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
      setFormData({});
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка добавления данных');
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setTable(tables[index].name),
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <Logo />
        <button onClick={() => setToken('')} className="logout-button">
          Выйти
        </button>
      </div>
      <h1 className="dashboard-title">Дашборд космической экспедиции</h1>

      <Slider {...sliderSettings} className="slider-container">
        {tables.map((t) => (
          <div key={t.name}>
            <h2 className="slider-title">{t.label}</h2>
          </div>
        ))}
      </Slider>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        {tables.find((t) => t.name === table).filters.length > 0 && (
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
            <option value="">Все</option>
            {tables.find((t) => t.name === table).filters.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        )}
      </div>

      <form onSubmit={handleInsert} className="insert-form">
        <h3 className="form-title">Добавить данные</h3>
        <div className="form-grid">
          {tables.find((t) => t.name === table).fields.map((field) => (
            <div key={field} className="form-group">
              <label className="form-label">{field.replace('_', ' ')}</label>
              <input
                type={field.includes('date') ? 'date' : 'text'}
                value={formData[field] || ''}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="form-input"
              />
            </div>
          ))}
        </div>
        <button type="submit" className="submit-button">
          Добавить
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {tables.find((t) => t.name === table).fields.map((field) => (
                <th
                  key={field}
                  onClick={() => {
                    setSortBy(field);
                    setOrder(order === 'ASC' ? 'DESC' : 'ASC');
                  }}
                  className="table-header"
                >
                  {field.replace('_', ' ')} {sortBy === field && (order === 'ASC' ? '↑' : '↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row[`${table}_id`]} className="table-row">
                {tables.find((t) => t.name === table).fields.map((field) => (
                  <td key={field} className="table-cell">
                    {row[field] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <QueryResults token={token} />
    </div>
  );
};

export default Dashboard;