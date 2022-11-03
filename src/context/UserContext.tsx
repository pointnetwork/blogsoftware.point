import {
    createContext,
    FunctionComponent,
    PropsWithChildren,
    useContext,
    useEffect,
    useState
} from 'react';
import {BlogContract, RoutesEnum} from '../@types/enums';
import utils from './utils';
import {useNavigate} from 'react-router-dom';
import {ToastContext} from './ToastContext';
import {UserInfo} from '../@types/types';

type UserContext = {
    userLoading: boolean;
    userSaving: boolean;
    userError: boolean;
    userInfo: UserInfo;
    visitorAddress: string;
    visitorIdentity: string;
    ownerAddress: string;
    ownerIdentity: string;
    isOwner: boolean;
    saveUserInfo: (info: Pick<UserInfo, 'avatar' | 'about' | 'headerImage'>) => Promise<void>;
}

export const UserContext = createContext<UserContext>({} as unknown as UserContext);

export const ProvideUserContext: FunctionComponent<PropsWithChildren> = ({children}) => {
    const navigate = useNavigate();
    const {setToast} = useContext(ToastContext);

    const [userLoading, setUserLoading] = useState<boolean>(true);
    const [userSaving, setUserSaving] = useState<boolean>(false);
    const [userError, setUserError] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfo>({
        about: '',
        avatar: null,
        headerImage: null
    });
    const [visitorAddress, setVisitorAddress] = useState<string>('');
    const [visitorIdentity, setVisitorIdentity] = useState<string>('');
    const [ownerAddress, setOwnerAddress] = useState<string>('');
    const [ownerIdentity, setOwnerIdentity] = useState<string>('');
    const [isOwner, setIsOwner] = useState<boolean>(false);

    const getData = async () => {
        setUserLoading(true);
        setUserError(false);
        try {
            const [
                {data: owner},
                visitor,
                {data: dataStorageHash}
            ] = await Promise.all([
                window.point.contract.call({
                    contract: BlogContract.name,
                    method: BlogContract.owner,
                    params: []
                }),
                utils.getWalletAddress(),
                window.point.contract.call({
                    contract: BlogContract.name,
                    method: BlogContract.getUserInfo
                })
            ]);
            setOwnerAddress(owner);
            setVisitorAddress(visitor);
            const _isOwner = visitor.toLowerCase() === owner.toLowerCase();
            setIsOwner(_isOwner);

            const [ownerId, visitorId] = await Promise.all([
                utils.getIdentityFromAddress(owner),
                utils.getIdentityFromAddress(visitor)
            ]);
            setOwnerIdentity(ownerId);
            setVisitorIdentity(visitorId);

            if (dataStorageHash) {
                const {
                    about,
                    avatar,
                    headerImage
                } = await utils.getDataFromStorage(dataStorageHash);
                setUserInfo({
                    about,
                    avatar: avatar
                        ? await window.point.storage.getFile({id: avatar})
                        : null,
                    headerImage: headerImage
                        ? await window.point.storage.getFile({id: headerImage})
                        : null
                });
            } else if (_isOwner) {
                navigate(RoutesEnum.profile, {replace: true});
            }
        } catch (e) {
            console.error(e);
            setUserError(true);
        }
        setUserLoading(false);
    };
    useEffect(() => {
        getData();
    }, []);

    const saveUserInfo = async (info: Pick<UserInfo, 'avatar' | 'about' | 'headerImage'>) => {
        setUserSaving(true);
        try {
            let avatarImage = '';
            if (info.avatar) {
                const avatarFormData = new FormData();
                avatarFormData.append('files', info.avatar);
                const {data} = await window.point.storage.postFile(avatarFormData);
                avatarImage = data;
            }
            let headerImage = '';
            if (info.headerImage) {
                const headerImageFormData = new FormData();
                headerImageFormData.append('files', info.headerImage);
                const {data} = await window.point.storage.postFile(headerImageFormData);
                headerImage = data;
            }
            const form = JSON.stringify({
                avatar: avatarImage,
                headerImage,
                about: info.about
            });
            const file = new File([form], 'user.json', {type: 'application/json'});

            const formData = new FormData();
            formData.append('files', file);
            const res = await window.point.storage.postFile(formData);

            await window.point.contract.send({
                contract: BlogContract.name,
                method: BlogContract.saveUserInfo,
                params: [res.data]
            });
            setUserInfo(prevState => ({...prevState, ...info}));
            setToast({color: 'green-500', message: 'Profile saved successfully'});
            navigate(RoutesEnum.admin);
        } catch (e) {
            console.error(e);
            setToast({
                color: 'red-500',
                message: 'Failed to save the profile'
            });
        }
        setUserSaving(false);
    };

    return <UserContext.Provider value={{
        userLoading,
        userSaving,
        userError,
        userInfo,
        visitorAddress,
        visitorIdentity,
        ownerAddress,
        ownerIdentity,
        isOwner,
        saveUserInfo
    }}>
        {children}
    </UserContext.Provider>;
};
