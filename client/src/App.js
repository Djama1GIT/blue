import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { TITLE } from './Consts'
import Head from './components/Head'
import Stream from './components/Stream'
import Main from './components/Main'
import PageNotFound from './components/PageNotFound'

import './App.css';

function App() {
  document.title = TITLE;
  return (
    <Router>
      <div className="app">
        <Head />
        <Routes>
          <Route path="/stream/:id" element={<Stream />} />
          <Route path="/" element={<Main />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;