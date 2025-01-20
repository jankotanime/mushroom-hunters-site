'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


const Login = () => {
  const router = useRouter();

  const [login, setLogin] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('');

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
    <div className='login-container'>
      <div className='login-title'>Logowanie</div>
      <form className='login-form' onSubmit={tryLogin} autoComplete="on">
        <input
          className='login-input'
          type="text"
          id="username"
          name="username"
          value={login.username}
          onChange={loginChange}
          required
          autoComplete="username"
          placeholder="Wprowadź login"
        />
        <input
          className='login-input'
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
        {error && <p className='error'>{error}</p>}
        <button className='login-button' type="submit">Zaloguj</button>
      </form>
      <button className='important-point-login' onClick={changeToRegister}>Załóż konto</button>
    </div>
  );
};

export default Login;
