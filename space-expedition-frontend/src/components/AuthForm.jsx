import React, { useState } from 'react';
import axios from 'axios';
import Logo from './Logo';

const AuthForm = ({ isLogin, setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'api/auth/login' : 'api/auth/register';
    try {
      const response = await axios.post(`https://study-project-back.vercel.app/api/${url}`, { username, password });
      if (isLogin) {
        setToken(response.data.token);
      } else {
        setSuccess('Регистрация успешна! Войдите.');
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка');
      setSuccess('');
    }
  };

  return (
    <div className="auth-container">
      <Logo />
      <h2 className="auth-title">{isLogin ? 'Вход' : 'Регистрация'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Имя пользователя</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button type="submit" className="submit-button">
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
      <p className="auth-link">
        {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
        <a href={isLogin ? '/register' : '/login'} className="link">
          {isLogin ? 'Зарегистрироваться' : 'Войти'}
        </a>
      </p>
    </div>
  );
};

export default AuthForm;