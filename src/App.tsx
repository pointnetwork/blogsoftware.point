import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Admin from './pages/Admin';
import Create from './pages/Create';
import Install from './pages/Install';
import CreateProfile from './pages/CreateProfile';
import { ProvideAppContext } from './context/AppContext';
import { RoutesEnum } from './@types/enums';

const Main = () => {
  return (
    <Routes>
      <Route path={RoutesEnum.home} element={<Home />} />
      <Route path={RoutesEnum.blog} element={<Blog />} />
      <Route path={RoutesEnum.admin} element={<Admin />} />
      <Route path={RoutesEnum.create} element={<Create />} />
      <Route path={RoutesEnum.edit} element={<Create edit />} />
      <Route path={RoutesEnum.install} element={<Install />} />
      <Route path={RoutesEnum.profile} element={<CreateProfile />} />
      <Route path={RoutesEnum.edit_profile} element={<CreateProfile edit />} />
    </Routes>
  );
};

const App = () => (
  <Router>
    <ProvideAppContext>
      <Main />
    </ProvideAppContext>
  </Router>
);

export default App;
