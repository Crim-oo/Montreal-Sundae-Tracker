import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Accueil from "./components/Accueil";
import { ClassProvider } from "./DataProvider";

import './App.css';

function App() {
  return (
    <>
    <ClassProvider>
      <Header />
        <Router>
          <Routes>
            <Route exact path="/" element={<Accueil />} />
          </Routes>
        </Router>
    </ClassProvider>
    
    </>
  );
}

export default App;
