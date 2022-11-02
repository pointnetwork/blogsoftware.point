import RefreshIcon from '@mui/icons-material/Refresh';
import {FunctionComponent, PropsWithChildren, useContext} from 'react';
import {ThemeContext} from '../context/ThemeContext';

const Loader: FunctionComponent<PropsWithChildren> = ({children}) => {
    const {theme} = useContext(ThemeContext);

    return (
        <div className='flex items-center'>
            <RefreshIcon className={`animate-spin text-${theme[1]}-500`} />
            <p className='ml-1 font-medium'>{children}</p>
        </div>
    );
};

export default Loader;
