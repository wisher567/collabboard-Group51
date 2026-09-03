import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import Board from './components/Board';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function TestApp() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/" element={<LoginForm />} />
      <Route path="/board/:boardId" element={<Board boardId="test-board" />} />
    </Routes>
  );
}

describe('App routing', () => {
  test('navigating to /login renders LoginForm', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <TestApp />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /log in/i })
    ).toBeInTheDocument();
  });

  test('navigating to /register renders RegisterForm', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <TestApp />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /register/i })
    ).toBeInTheDocument();
  });

  test('navigating to / renders the login page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TestApp />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /log in/i })
    ).toBeInTheDocument();
  });
});