import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Board from './components/Board'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
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
