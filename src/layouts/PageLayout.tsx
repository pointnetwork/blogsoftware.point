import Alert from '../components/Alert';
import Loader from '../components/Loader';
import {useAppContext} from '../context/AppContext';

const PageLayout = ({children}: { children: any }) => {
    const {loading, theme} = useAppContext();

    return (
        <div className={`bg-${theme[0]} text-${theme[2]} min-h-screen`}>
            <Alert />
            {loading ? (
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
