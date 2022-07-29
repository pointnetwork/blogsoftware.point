import React, { useEffect } from 'react';
import { Route, Router } from 'wouter';
import { ProvideAppContext, useAppContext } from './context/AppContext';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Admin from './pages/Admin';
import Create from './pages/Create';
import Onboarding_Profile from './pages/Onboarding_Profile';
// import { useLocation } from 'wouter';
// import { BlogFactoryContract } from './@types/enums';

const Main = () => {
  const { walletAddress } = useAppContext();
  // const [, setLocation] = useLocation();

  useEffect(() => {
    if (walletAddress)
      (async () => {
        // const { data }: { data: string } = await window.point.contract.call({
        //   contract: BlogFactoryContract.name,
        //   method: BlogFactoryContract.isBlogCreated,
        //   params: [walletAddress],
        // });
        // if (data === '0x0000000000000000000000000000000000000000')
        // setLocation('/onboarding');
      })();
  }, [walletAddress]);

  return (
    <Router>
      <Route path='/' component={Home} />
      <Route path='/blog/:id' component={Blog} />
      <Route path='/admin' component={Admin} />
      <Route path='/create' component={Create} />
      <Route path='/onboarding_profile' component={Onboarding_Profile} />
    </Router>
  );
};

const App = () => (
  <ProvideAppContext>
    <Main />
  </ProvideAppContext>
);

export default App;
