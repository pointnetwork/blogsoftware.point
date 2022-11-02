import {FunctionComponent, useContext} from 'react';
import {ToastContext} from '../context/ToastContext';

const Alert: FunctionComponent = () => {
    const {toast} = useContext(ToastContext);

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
