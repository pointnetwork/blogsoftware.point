import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Admin from './pages/Admin';
import CreateOrEditPost from './pages/CreateOrEditPost';
import CreateOrEditProfile from './pages/CreateOrEditProfile';
import Customize from './pages/Customize';
import ToastNotification from './components/ToastNotification';
import {RoutesEnum} from './@types/enums';
import ColorImports from './components/ColorImports';
import {ProvideToastContext} from './context/ToastContext';
import {ProvideThemeContext} from './context/ThemeContext';
import {FunctionComponent} from 'react';
import {ProvideUserContext} from './context/UserContext';
import {ProvidePostsContext} from './context/PostsContext';

const Main: FunctionComponent = () => (
    <Routes>
        <Route path={RoutesEnum.home} element={<Home />} />
        <Route path={RoutesEnum.blog} element={<Blog />} />
        <Route path={RoutesEnum.deleted_blog} element={<Blog deleted />} />
        <Route path={RoutesEnum.admin} element={<Admin />} />
        <Route path={RoutesEnum.create} element={<CreateOrEditPost />} />
        <Route path={RoutesEnum.edit} element={<CreateOrEditPost edit />} />
        <Route path={RoutesEnum.profile} element={<CreateOrEditProfile />} />
        <Route path={RoutesEnum.edit_profile} element={<CreateOrEditProfile edit />} />
        <Route path={RoutesEnum.customize} element={<Customize />} />
    </Routes>
);

const App: FunctionComponent = () => (
    <Router>
        <ProvideToastContext>
            <ProvideThemeContext>
                <ProvideUserContext>
                    <ProvidePostsContext>
                        <ToastNotification />
                        <Main />
                        <ColorImports />
                    </ProvidePostsContext>
                </ProvideUserContext>
            </ProvideThemeContext>
        </ProvideToastContext>
    </Router>
);

export default App;
