import {useEffect} from 'react';

interface Props {
    clientId: string;
    callbackUrl: string;
}

const NaverLoginButton = ({clientId, callbackUrl}: Props) => {
    useEffect(() => {
        const {naver} = window as any;
        if (!naver) return;

        const login = new naver.LoginWithNaverId({
            clientId,
            callbackUrl,
            isPopup: false,
            loginButton: {color: 'green', type: 3, height: 50},
        });

        login.init();
    }, [clientId, callbackUrl]);

    return <div id="naverIdLogin"/>;
};

export default NaverLoginButton;
