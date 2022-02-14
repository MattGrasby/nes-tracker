import './App.css';
import GameTable from './components/GameTable';
import data from './data/data.json';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        HEADER
      </header>
      <GameTable
        data={data}
      />
    </div>
  );
}

export default App;
