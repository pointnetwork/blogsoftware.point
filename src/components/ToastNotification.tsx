import {useEffect} from 'react';
import {useAppContext} from '../context/AppContext';

const Alert = () => {
    const {toast, setToast} = useAppContext();

    useEffect(() => {
        if (toast.message) {setTimeout(() => setToast({color: 'green-500', message: ''}), 3000);}
    }, [toast]);

    return (
        <div
            className={`fixed py-3 px-4 rounded-lg bg-${
                toast.color
            } text-white z-50 -translate-x-1/2 left-1/2 top-6 shadow-lg max-w-lg transition-all ${
                toast.message ? 'translate-y-0' : '-translate-y-32'
            }`}
        >
            {toast.message}
        </div>
    );
};

export default Alert;
