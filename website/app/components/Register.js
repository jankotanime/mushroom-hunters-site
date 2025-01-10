'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Register = () => {
  const [login, setLogin] = useState({ username: '', email: '', password: '', secondPassword: '' });
  const [showPassword, setShowPassword] = useState(false)
  const [showSecondPassword, setShowSecondPassword] = useState(false)
  const [checkRules, setCheckRules] = useState(false)
  const [error, setError] = useState('');
  const router = useRouter();

  const loginChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const changeToLogin = () => {
    const url = '/'
    router.push(url)
  }

  const tryRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!login.email.includes('@')) {
      setError('Błędny adres e-mail!')
    } else if (login.password.length < 2) {
      setError('Hasło powinno mieć przynajmniej 8 znaków!')
    } else if (login.password !== login.secondPassword) {
      setError('Wprowadzone hasła nie są takie same!')
    } else {
      try {
        const res = await fetch('http://localhost:8000/api/register-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(login),
        });
        if (res.ok) {
          router.push('/');
        } else {
          const data = await res.json();
          setError(data.error || 'Niepoprawne dane logowania.');
        }
      } catch (err) {
        console.log(err)
        setError('Wystąpił błąd. Spróbuj ponownie później.');
      }
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={tryRegister} autoComplete="on">
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
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={login.email}
          onChange={loginChange}
          required
          autoComplete="email"
          placeholder="Wprowadź email"
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
        <label htmlFor="secondPassword">Powtórz hasło:</label>
        <input
          type={showSecondPassword ? "text" : "password"}
          id="secondPassword"
          name="secondPassword"
          value={login.secondPassword}
          onChange={loginChange}
          required
          autoComplete="current-password"
          placeholder="Wprowadź hasło ponownie"
        />
        <button type="button" onClick={() => {setShowSecondPassword(!showSecondPassword)}}>Pokaz haslo</button>
        <input
          type="checkbox"
          id="rules"
          name="rules"
          value={login.checkRules}
          onChange={() => {setCheckRules(!setCheckRules)}}
          required
        />
        Wyrażam zgodę na <a target="_blank" href="http://localhost:3000/rules.md">regulamin</a>
        {error !== '' ? <p style={{ color: 'red' }}>{error}</p> : null}
        <button type="submit">Zarejerstruj się</button>
      </form>
      <button onClick={changeToLogin}>Powrót do logowania</button>
    </div>
  );
};

export default Register;
