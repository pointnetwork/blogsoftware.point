import RefreshIcon from '@mui/icons-material/Refresh';
import {useAppContext} from '../context/AppContext';

const Loader = ({children}: { children: string }) => {
    const {theme} = useAppContext();

    return (
        <div className='flex items-center'>
            <RefreshIcon className={`animate-spin text-${theme[1]}-500`} />
            <p className='ml-1 font-medium'>{children}</p>
        </div>
    );
};

export default Loader;
