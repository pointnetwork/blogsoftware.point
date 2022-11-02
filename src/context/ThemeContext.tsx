import {
    createContext,
    Dispatch,
    FunctionComponent, PropsWithChildren,
    SetStateAction,
    useContext, useEffect,
    useState
} from 'react';
import {Theme} from '../@types/types';
import {BlogContract} from '../@types/enums';
import {ToastContext} from './ToastContext';

type ThemeContext = {
    theme: Theme;
    themeLoading: boolean;
    setTheme: Dispatch<SetStateAction<Theme>>
    saveTheme: () => Promise<void>
}

export const ThemeContext = createContext<ThemeContext>({} as unknown as ThemeContext);

export const ProvideThemeContext: FunctionComponent<PropsWithChildren> = ({children}) => {
    const {setToast} = useContext(ToastContext);
    const [themeLoading, setThemeLoading] = useState(false);
    const [theme, setTheme] = useState<Theme>(['white', 'indigo', 'black']);

    const getTheme = async () => {
        setThemeLoading(true);
        try {
            const {data}: { data: Theme } = await window.point.contract.call({
                contract: BlogContract.name,
                method: BlogContract.getTheme
            });
            setTheme(data);
        } catch (e) {
            setToast({
                color: 'red-500',
                message: 'Failed to load the theme. Please try again'
            });
        }
        setThemeLoading(false);
    };
    useEffect(() => {
        getTheme();
    }, []);

    const saveTheme = async () => {
        try {
            await window.point.contract.send({
                contract: BlogContract.name,
                method: BlogContract.setTheme,
                params: [...theme]
            });
            setToast({color: 'green-500', message: 'Theme updated successfully'});
        } catch (error) {
            setToast({
                color: 'red-500',
                message: 'Failed to save the theme. Please try again'
            });
        }
    };

    return <ThemeContext.Provider value={{theme, themeLoading, setTheme, saveTheme}}>
        {children}
    </ThemeContext.Provider>;
};
