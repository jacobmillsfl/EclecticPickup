
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import MainNav from './Components/Navigation/MainNav';
import './App.css';
import MediaComponent from './Contexts/Homepage/MediaComponent';
import Footer from './Components/Footer/Footer';
import LandingPage from "./Views/LandingPage";

function App() {
  return (
    <Router>
      <div className="App">
        <MediaComponent className="mediaComponent">
          <MainNav />
          <Routes>
              <Route path='/' element={< LandingPage />} />
          </Routes>
          <Footer />
        </MediaComponent>
      </div>
    </Router>
  );
}

export default App;