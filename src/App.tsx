import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Admin from './pages/Admin';
import Create from './pages/Create';
import CreateProfile from './pages/CreateProfile';
import Customize from './pages/Customize';
import ToastNotification from './components/ToastNotification';
import {ProvideAppContext} from './context/AppContext';
import {RoutesEnum} from './@types/enums';
import ColorImports from './components/ColorImports';

const Main = () => (
    <Routes>
        <Route path={RoutesEnum.home} element={<Home />} />
        <Route path={RoutesEnum.blog} element={<Blog />} />
        <Route path={RoutesEnum.admin} element={<Admin />} />
        <Route path={RoutesEnum.create} element={<Create />} />
        <Route path={RoutesEnum.edit} element={<Create edit />} />
        <Route path={RoutesEnum.profile} element={<CreateProfile />} />
        <Route path={RoutesEnum.edit_profile} element={<CreateProfile edit />} />
        <Route path={RoutesEnum.customize} element={<Customize />} />
    </Routes>
);

const App = () => (
    <Router>
        <ProvideAppContext>
            <ToastNotification />
            <Main />
            <ColorImports />
        </ProvideAppContext>
    </Router>
);

export default App;
