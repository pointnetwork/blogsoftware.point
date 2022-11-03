import {useNavigate} from 'react-router-dom';
import {RoutesEnum} from '../@types/enums';
import {OutlinedButton, PrimaryButton} from './Button';
import {FunctionComponent, useContext, PropsWithChildren} from 'react';
import {UserContext} from '../context/UserContext';
import {ThemeContext} from '../context/ThemeContext';

const Header: FunctionComponent<PropsWithChildren> = ({children}) => {
    const {isOwner} = useContext(UserContext);
    const {theme} = useContext(ThemeContext);
    const navigate = useNavigate();

    return (
        <>
            <header className={`py-3 sticky top-0 bg-${theme[0]} shadow-lg z-10`}>
                <div
                    className='mx-auto flex items-center justify-between'
                    style={{maxWidth: '1000px'}}
                >
                    <div
                        className='cursor-pointer'
                        onClick={() => navigate(RoutesEnum.home)}
                    >
                        {/* Logo will go here */}
                        <span className='font-medium'>BlogSoftware</span>
                    </div>
                    {isOwner && (
                        <div className='flex items-center space-x-2'>
                            <OutlinedButton onClick={() => navigate(RoutesEnum.customize)}>
                                Customize
                            </OutlinedButton>
                            <PrimaryButton onClick={() => navigate(RoutesEnum.admin)}>
                                Manage Your Blog
                            </PrimaryButton>
                        </div>
                    )}
                </div>
            
            </header>
            {children}
        </>
    );
};

export default Header;
