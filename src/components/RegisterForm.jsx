import React, { useState } from 'react';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      setSuccess(true);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Register</h2>

      <label style={styles.label} htmlFor="register-email">Email</label>
      <input
        id="register-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={styles.input}
      />

      <label style={styles.label} htmlFor="register-password">Password</label>
      <input
        id="register-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={styles.input}
      />

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>Account created! You can now log in.</p>}

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}

const styles = {
  form: { display: 'flex', flexDirection: 'column', maxWidth: '320px', gap: '8px' },
  label: { fontSize: '14px', marginTop: '8px' },
  input: { padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' },
  button: { marginTop: '16px', padding: '10px', fontSize: '14px', cursor: 'pointer' },
  error: { color: 'red', fontSize: '13px', marginTop: '4px' },
  success: { color: 'green', fontSize: '13px', marginTop: '4px' },
};