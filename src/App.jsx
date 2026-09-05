import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Board from './components/Board'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Dashboard from './components/Dashboard'
import Analytics from './components/Analytics'
import Settings from './components/Settings'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/boards" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/members" element={<Settings />} />
          <Route path="/board/new" element={<Board isNewBoard={true} />} />
          <Route path="/new-board" element={<Board isNewBoard={true} />} />
          <Route path="/board/:boardId" element={<BoardPage />} />
          <Route path="/" element={<LoginForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

function BoardPage() {
  const { boardId } = useParams()
  return <Board boardId={boardId} />
}

export default App
