import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const NaverCallback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));

        // support both access_token and token query names
        const accessToken = urlParams.get('access_token') || hashParams.get('access_token') || urlParams.get('token');
        const error = urlParams.get('error') || hashParams.get('error');
        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');

        if (error) {
            alert(`네이버 로그인 실패: ${errorDescription || error}`);
            navigate('/loginpage');
            return;
        }

        if (accessToken) {
            // Save token so App can detect logged-in state and use it for API calls
            localStorage.setItem('accessToken', accessToken);
            // notify app that auth state changed
            try {
                window.dispatchEvent(new Event('authChange'));
            } catch (e) {
                // ignore
            }
            // Remove token from URL to avoid leaking it
            try {
                const cleanPath = window.location.pathname;
                window.history.replaceState({}, document.title, cleanPath);
            } catch (e) {
                // ignore
            }

            // navigate to articles (App will check login state on location change)
            navigate('/articles');
        } else {
            alert('네이버 로그인 실패: 알 수 없는 문제');
            navigate('/loginpage');
        }
    }, [navigate]);

    return <div>로그인 처리 중...</div>;
};

export default NaverCallback;
