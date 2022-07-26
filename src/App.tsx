import React from 'react';
import { Route, Router } from 'wouter';
import { ProvideAppContext } from './context/AppContext';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Admin from './pages/Admin';
import Create from './pages/Create';
import Onboarding from './pages/Onboarding';

const Main = () => {
  return (
    <Router>
      <Route path='/' component={Home} />
      <Route path='/blog/:id' component={Blog} />
      <Route path='/admin' component={Admin} />
      <Route path='/create' component={Create} />
      <Route path='/onboarding' component={Onboarding} />
    </Router>
  );
};

const App = () => (
  <ProvideAppContext>
    <Main />
  </ProvideAppContext>
);

export default App;
