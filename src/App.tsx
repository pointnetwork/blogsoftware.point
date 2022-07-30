import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { ProvideAppContext, useAppContext } from './context/AppContext';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Admin from './pages/Admin';
import Create from './pages/Create';
import OnboardingInstall from './pages/Onboarding_Install';
import OnboardingProfile from './pages/Onboarding_Profile';
import { RoutesEnum } from './@types/enums';
// import { BlogFactoryContract } from './@types/enums';

const Main = () => {
  const { walletAddress } = useAppContext();

  return (
    <Routes>
      <Route path={RoutesEnum.home} element={<Home />} />
      <Route path={RoutesEnum.blog} element={<Blog />} />
      <Route path={RoutesEnum.admin} element={<Admin />} />
      <Route path={RoutesEnum.create} element={<Create />} />
      <Route
        path={RoutesEnum.onboarding_install}
        element={<OnboardingInstall />}
      />
      <Route
        path={RoutesEnum.onboarding_profile}
        element={<OnboardingProfile />}
      />
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
