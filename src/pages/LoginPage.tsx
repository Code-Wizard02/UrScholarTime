import React, { useState } from 'react';
import {signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginPage(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]= useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful!');
      window.location.href = '/dashboard';
    } catch (error:any) {
      setError("Credenciales incorrectas o usuario no registrado");
      console.error(error);
    }
  };
return (
  <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
    <form
      onSubmit={handleLogin}
      className="bg-black opacity-90 p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4 sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      id='login-form'
    >
      <h2 className="text-2xl font-bold text-center text-white">Iniciar Sesión</h2>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded-xl"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded-xl"
        required
      />
      <button
        type="submit"
        className="w-full bg-green-600 text-white p-2 rounded-xl hover:bg-green-700 transition"
      >
        Entrar
      </button>
      <p className="text-center text-sm text-gray-600">
        ¿No tienes una cuenta?{' '}
        <button
          type="button"
          onClick={() => (window.location.href = '/register')}
          className="w-full bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition mt-2"
        >
          Regístrate
        </button>
      </p>
    </form>
  </div>
);
}

