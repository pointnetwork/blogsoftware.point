import {BlogContract} from '../@types/enums';
import {PrimaryButton} from '../components/Button';
import Header from '../components/Header';
import {useAppContext} from '../context/AppContext';
import PageLayout from '../layouts/PageLayout';

const Customize = () => {
    const {theme, setTheme, setToast} = useAppContext();

    const backgroundColors = ['zinc', 'slate', 'gray', 'neutral'];
    const primaryColors = [
        'red',
        'orange',
        'amber',
        'yellow',
        'lime',
        'green',
        'emerald',
        'teal',
        'cyan',
        'sky',
        'blue',
        'indigo',
        'violet',
        'purple',
        'fuchsia',
        'pink',
        'rose',
        'slate'
    ];

    const handleSetTheme = async () => {
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

    return (
        <PageLayout>
            <Header />
            <main className='py-6 mx-auto' style={{maxWidth: '1000px'}}>
                <div className='flex justify-between'>
                    <h1 className='text-3xl font-bold'>Customize your Blog</h1>
                    <PrimaryButton onClick={handleSetTheme}>Update Theme</PrimaryButton>
                </div>
                <div className='flex mt-3 space-x-24'>
                    <div className='flex-1'>
                        <h2 className='font-medium text-lg -mb-2'>
              Choose your background
                        </h2>
                        <div className='mt-4'>
                            {backgroundColors.map((color) => (
                                <div key={color}>
                                    <p className='my-1 text-sm capitalize'>{color}</p>
                                    <div className='grid grid-cols-4 gap-2'>
                                        <div
                                            className={`border-2 p-1 rounded-lg hover:shadow-lg ${
                                                theme[0] === `${color}-100`
                                                    ? `border-${theme[1]}-500`
                                                    : ''
                                            } cursor-pointer`}
                                        >
                                            <div
                                                className={`bg-${color}-100 rounded p-5 border`}
                                                onClick={() =>
                                                    setTheme((prev) => {
                                                        prev[0] = `${color}-100`;
                                                        prev[2] = 'black';
                                                        return [...prev];
                                                    })
                                                }
                                            ></div>
                                        </div>
                                        <div
                                            className={`border-2 p-1 rounded-lg hover:shadow-lg ${
                                                theme[0] === `${color}-700`
                                                    ? `border-${theme[1]}-500`
                                                    : ''
                                            } cursor-pointer`}
                                        >
                                            <div
                                                className={`bg-${color}-700 rounded p-5`}
                                                onClick={() =>
                                                    setTheme((prev) => {
                                                        prev[0] = `${color}-700`;
                                                        prev[2] = 'white';
                                                        return [...prev];
                                                    })
                                                }
                                            ></div>
                                        </div>
                                        <div
                                            className={`border-2 p-1 rounded-lg hover:shadow-lg ${
                                                theme[0] === `${color}-800`
                                                    ? `border-${theme[1]}-500`
                                                    : ''
                                            } cursor-pointer`}
                                        >
                                            <div
                                                className={`bg-${color}-800 rounded p-5`}
                                                onClick={() =>
                                                    setTheme((prev) => {
                                                        prev[0] = `${color}-800`;
                                                        prev[2] = 'white';
                                                        return [...prev];
                                                    })
                                                }
                                            ></div>
                                        </div>
                                        <div
                                            className={`border-2 p-1 rounded-lg hover:shadow-lg ${
                                                theme[0] === `${color}-900`
                                                    ? `border-${theme[1]}-500`
                                                    : ''
                                            } cursor-pointer`}
                                        >
                                            <div
                                                className={`bg-${color}-900 rounded p-5`}
                                                onClick={() =>
                                                    setTheme((prev) => {
                                                        prev[0] = `${color}-900`;
                                                        prev[2] = 'white';
                                                        return [...prev];
                                                    })
                                                }
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <p className='my-1 text-sm capitalize'>Default - white</p>
                            <div className='grid grid-cols-4 gap-2'>
                                <div
                                    className={`border-2 p-1 rounded-lg hover:shadow-lg ${
                                        theme[0] === 'white' ? `border-${theme[1]}-500` : ''
                                    } cursor-pointer`}
                                >
                                    <div
                                        className='bg-white rounded p-5'
                                        onClick={() =>
                                            setTheme((prev) => {
                                                prev[0] = `white`;
                                                prev[2] = 'black';
                                                return [...prev];
                                            })
                                        }
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex-1'>
                        <h2 className='font-medium text-lg -mb-2'>
              Choose your primary color
                        </h2>
                        <div className='mt-4'>
                            <div className='grid grid-cols-4 gap-2'>
                                {primaryColors.map((color) => (
                                    <div
                                        className={`border-2 p-1 rounded-lg hover:shadow-lg ${
                                            theme[1] === color ? `border-${color}-500` : ''
                                        }`}
                                        key={color}
                                        onClick={() =>
                                            setTheme((prev) => {
                                                prev[1] = color;
                                                return [...prev];
                                            })
                                        }
                                    >
                                        <div
                                            className={`bg-${color}-500 rounded p-5 cursor-pointer`}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                            <div className='mt-12 mb-4'>
                You can navigate to other pages to have a look at the newer
                theme. But you'll need to come back to this page and click the
                "Update Theme" button below to apply the new theme.
                            </div>
                            <div className='flex justify-end'>
                                <PrimaryButton onClick={handleSetTheme}>
                  Update Theme
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </PageLayout>
    );
};

export default Customize;
