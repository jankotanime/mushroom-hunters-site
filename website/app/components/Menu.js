'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Menu = () => {
  const [login, setLogin] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('');
  const router = useRouter();

  const loginChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const changeToRegister = () => {
    const url = '/register'
    router.push(url)
  }

  const tryLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`https://localhost:8000/api/login-user`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(login),
      });
      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.error || 'Niepoprawne dane logowania.');
      }
    } catch (error) {
      console.log(error)
      setError('Wystąpił błąd. Spróbuj ponownie później.');
    }
  };

  return (
    <div>
      <h1>Main Menu</h1>
      <form onSubmit={tryLogin} autoComplete="on">
        <label htmlFor="username">Login:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={login.username}
          onChange={loginChange}
          required
          autoComplete="username"
          placeholder="Wprowadź login"
        />

        <label htmlFor="password">Hasło:</label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          value={login.password}
          onChange={loginChange}
          required
          autoComplete="current-password"
          placeholder="Wprowadź hasło"
        />
        <button type="button" onClick={() => {setShowPassword(!showPassword)}}>Pokaz haslo</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Zaloguj</button>
      </form>
      <button onClick={changeToRegister}>Załóż konto</button>
    </div>
  );
};

export default Menu;
