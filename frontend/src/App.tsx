
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Homepage from './Components/MediaPlayer/MediaPlayer';
import MainNav from './Components/Navigation/MainNav';
import './App.css';
import MediaComponent from './Contexts/Homepage/MediaComponent';
import Footer from './Components/Footer/Footer';
import { AlbumComponent } from "./Views/Album/Album";
import LandingPage from "./Views/LandingPage";
import Videos from "./Views/Videos/Videos";
import { MerchComponent } from './Views/Merch/Merch';

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