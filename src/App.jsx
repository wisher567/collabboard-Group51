import Board from './components/Board'
import { board } from './data/mockData'
import './App.css'

function App() {
  return (
    <div className="app">
      <Board board={board} />
    </div>
  )
}

export default App
