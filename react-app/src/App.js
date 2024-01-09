import logo from './logo.svg';
import './App.css';
import Header from './component/Header';
import Home from './component/Home';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function App() {
  return (
    <div className="App">
      <Header/>
      <Home/>
      hello react
    </div>
  );
}

export default App;
