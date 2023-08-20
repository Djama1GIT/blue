import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { TITLE, HOST } from './Consts'
import { getCookie, deleteCookie } from './Utils';
import Head from './components/Head'
import Account from './components/Account'
import Subscriptions from './components/Subscriptions'
import Login from './components/Login'
import Register from './components/Register'
import RecoveryPassword from './components/RecoveryPassword'
import Stream from './components/Stream'
import Main from './components/Main'
import PageNotFound from './components/PageNotFound'

import axios from 'axios';

import './App.css';

const routes = [
  { path: '/account/', component: Account },
  { path: '/subscriptions/', component: Subscriptions },
  { path: '/login/', component: Login },
  { path: '/register/', component: Register },
  { path: '/recovery-password/', component: RecoveryPassword },
  { path: '/stream/:id', component: Stream },
  { path: '/', component: Main },
  { path: '*', component: PageNotFound },
];

function App() {
  document.title = TITLE;

  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);


  return (
    <Router>
      <div className="app">
        <Head session={session} user={user} setUser={setUser} setSession={setSession}/>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index}
                   path={route.path}
                   element={<route.component session={session}
                                             user={user}
                                             setUser={setUser}
                                             setSession={setSession}
                            />}
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
