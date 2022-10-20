import {useNavigate} from 'react-router-dom';
import {RoutesEnum} from '../@types/enums';
import {useAppContext} from '../context/AppContext';
import {OutlinedButton, PrimaryButton} from './Button';
import HeaderImage from "../components/HeaderImage";

const Header = ({isProfile, edit, setImageHeader} : {isProfile?:boolean, edit?:boolean, setImageHeader?:Function}) => {
    const {isOwner, theme} = useAppContext();

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
                {isOwner ? (
                    <div className='flex items-center space-x-2'>
                        <OutlinedButton onClick={() => navigate(RoutesEnum.customize)}>
              Customize
                        </OutlinedButton>
                        <PrimaryButton onClick={() => navigate(RoutesEnum.admin)}>
              Manage Your Blog
                        </PrimaryButton>
                    </div>
                ) : null}
            </div>
            
        </header>
        {isProfile ? (
            <HeaderImage edit={edit} setImageHeader={setImageHeader}/>
        ) : null}
        
        </>
    );
};

export default Header;
