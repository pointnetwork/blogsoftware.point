import Loader from '../components/Loader';
import {FunctionComponent, PropsWithChildren, useContext} from 'react';
import {UserContext} from '../context/UserContext';
import {ThemeContext} from '../context/ThemeContext';
import ErrorPlaceholder from '../components/ErrorPlaceholder';

const PageLayout: FunctionComponent<PropsWithChildren<{
    loading?: boolean;
    error?: boolean;
}>> = ({
    children,
    loading,
    error
}) => {
    const {userLoading, userError} = useContext(UserContext);
    const {theme, themeLoading} = useContext(ThemeContext);

    return (
        <div className={`bg-${theme[0]} text-${theme[2]} min-h-screen`}>
            {userError || error ? (
                <ErrorPlaceholder/>
            ) : userLoading || themeLoading || loading ? (
                <div className='h-screen w-screen flex items-center justify-center'>
                    <Loader>Loading...</Loader>
                </div>
            ) : (
                children
            )}
        </div>
    );
};

export default PageLayout;
