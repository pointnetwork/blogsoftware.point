import {Dispatch, SetStateAction} from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {useAppContext} from '../context/AppContext';

const SearchBar = ({
    value,
    onChange
}: {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
}) => {
    const {theme} = useAppContext();

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
