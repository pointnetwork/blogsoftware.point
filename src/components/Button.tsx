import {ButtonProps} from '../@types/interfaces';
import {useAppContext} from '../context/AppContext';

const PrimaryButton = ({
    children,
    disabled = false,
    onClick
}: ButtonProps) => {
    const {theme} = useAppContext();
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`p-2 text-sm font-medium bg-${theme[1]}-500 text-white px-4 rounded hover:bg-${theme[1]}-700 active:bg-${theme[1]}-900 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed`}
        >
            {children}
        </button>
    );
};

const OutlinedButton = ({
    children,
    disabled = false,
    onClick
}: ButtonProps) => {
    const {theme} = useAppContext();
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`p-2 text-sm font-medium bg-transparent border border-${theme[1]}-500  text-${theme[1]}-500 px-4 rounded hover:text-${theme[1]}-700 active:text-${theme[1]}-900 hover:border-${theme[1]}-700 active:border-${theme[1]}-900 transition-all disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed`}
        >
            {children}
        </button>
    );
};

const ErrorButton = ({children, disabled = false, onClick}: ButtonProps) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className='p-2 text-sm font-medium bg-red-500 text-white px-4 rounded hover:bg-red-700 active:bg-red-900 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed'
    >
        {children}
    </button>
);

export {PrimaryButton, ErrorButton, OutlinedButton};
