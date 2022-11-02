import {ChangeEventHandler, FunctionComponent, useContext} from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {ThemeContext} from '../context/ThemeContext';

const SearchBar: FunctionComponent<{
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>
}> = ({
    value,
    onChange
}) => {
    const {theme} = useContext(ThemeContext);

    return (
        <div className={`sticky top-0 bg-${theme[0]} z-10 pb-3`}>
            <div className='flex border border-${theme[2]} border-opacity-5 rounded items-center p-2'>
                <SearchIcon />
                <input
                    value={value}
                    placeholder='Search for a blog post title or a tag'
                    type='text'
                    className={`ml-2 bg-${theme[0]} outline-none w-full`}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

export default SearchBar;
