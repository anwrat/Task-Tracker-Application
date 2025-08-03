'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const toggleMode = () => {
    setSuccessMessage('');
    setIsLogin(!isLogin);
  };

  const [username, setusername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const API_BASE_URL = 'http://localhost:3000/auth';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = isLogin ? `${API_BASE_URL}/login` : `${API_BASE_URL}/register`;

    const payload = isLogin
      ? { email, password }
      : { username, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        if (isLogin) {
          // Login successful: store user and redirect
          localStorage.setItem('user', JSON.stringify(data));
          localStorage.setItem('isLoggedIn', 'true');
          router.push('/tasks');
        } else {
          // Signup successful: show message and switch to login
          setSuccessMessage('Signup successful! Please log in.');
          setIsLogin(true);
          // Optional: clear inputs after signup
          setusername('');
          setEmail('');
          setPassword('');
        }
      } else {
        alert(data?.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-sm">
        <Image
          className="dark:invert"
          src="/buddha.png"
          alt="Buddha logo"
          width={180}
          height={38}
          priority
        />

        <h1 className="text-xl font-semibold">
          {isLogin ? 'Login to your account' : 'Create a new account'}
        </h1>

        {/* Success message */}
        {successMessage && (
          <p className="text-green-600 dark:text-green-400 mb-4">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              className="px-4 py-2 border rounded-md bg-white dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </main>
    </div>
  );
}