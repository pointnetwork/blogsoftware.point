import {
    createContext,
    Dispatch,
    FunctionComponent,
    PropsWithChildren,
    SetStateAction,
    useEffect,
    useState
} from 'react';
import {ToastNotification} from '../@types/types';

type ToastContext = {
    toast: ToastNotification
    setToast: Dispatch<SetStateAction<ToastNotification>>
}

export const ToastContext = createContext<ToastContext>({} as unknown as ToastContext);

export const ProvideToastContext: FunctionComponent<PropsWithChildren> = ({children}) => {
    const [toast, setToast] = useState<ToastNotification>({
        color: 'green-500',
        message: ''
    });

    useEffect(() => {
        if (toast.message) {
            setTimeout(
                () => setToast({color: 'green-500', message: ''}),
                3000
            );
        }
    }, [toast]);

    return <ToastContext.Provider value={{toast, setToast}}>
        {children}
    </ToastContext.Provider>;
};
