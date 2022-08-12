import React from 'react';
import {ButtonProps} from '../@types/interfaces';

const PrimaryButton = ({
    children,
    disabled = false,
    onClick
}: ButtonProps) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className='p-2 text-sm font-medium bg-indigo-500 text-white px-4 rounded hover:bg-indigo-700 active:bg-indigo-900 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed'
    >
        {children}
    </button>
);

const OutlinedButton = ({
    children,
    disabled = false,
    onClick
}: ButtonProps) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className='p-2 text-sm font-medium bg-white border border-indigo-500  text-indigo-500 px-4 rounded hover:text-indigo-700 active:text-indigo-900 hover:border-indigo-700 active:border-indigo-900 transition-all disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed'
    >
        {children}
    </button>
);

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
