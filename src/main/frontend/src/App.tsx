import React, {useEffect, useState} from 'react';
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import './App.css';
import BlogList from "./BlogLlist";
import BlogArticle from "./BlogArticle";
import NewArticle from "./NewArticle";
import Signup from "./Signup";
import LoginPage from "./LoginPage";
import NaverCallback from "./NaverCallback";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // move checkLogin to component scope so other effects/listeners can call it
    const checkLogin = async () => {
        try {
            const storedToken = localStorage.getItem('accessToken');
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };

            // optimistic UI: if token exists, assume logged in and update navbar immediately
            if (storedToken) {
                headers['Authorization'] = `Bearer ${storedToken}`;
            }

            const res = await fetch('http://localhost:8080/api/user/me', {
                credentials: 'include', // 쿠키 포함
                headers: headers
            });

            if (res.ok) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        } catch (err) {
            setIsLoggedIn(false);
        } finally {
            setLoading(false); // 로딩 끝났음을 표시
        }
    };

    // 🔥 앱이 처음 로드될 때, 로그인 상태 확인
    useEffect(() => {
        // URL에서 토큰 확인 (OAuth 로그인 후)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        // hash에서 access_token 지원 (예: OAuth implicit flow)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const tokenFromHash = hashParams.get('access_token') || hashParams.get('token');


        if (token) {
            localStorage.setItem('accessToken', token);
            // URL에서 토큰 제거
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        if (!token && tokenFromHash) {
            localStorage.setItem('accessToken', tokenFromHash);
            // hash 제거
            try {
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (e) {
                // ignore
            }
        }

        checkLogin();
    }, [location]);

    // listen for auth changes (e.g. NaverCallback saved token)
    useEffect(() => {
        const handler = () => {
            // re-check login state when NaverCallback dispatches event
            checkLogin();
        };

        window.addEventListener('authChange', handler);
        return () => window.removeEventListener('authChange', handler);
    }, []);

    return (
        <div className="App">
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>

            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/articles" element={<BlogList/>}/>
                <Route path="/articles/:id" element={<BlogArticle/>}/>
                <Route path="/new-article" element={<NewArticle/>}/>
                <Route path="/new-article/:id" element={<NewArticle/>}/>
                {/*<Route path="/login" element={<Login onLoginSuccess={() => setIsLoggedIn(true)}/>}/>*/}
                <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsLoggedIn(true)}/>}/>
                <Route path="/naver/callback" element={<NaverCallback/>}/>
                <Route path="/signup" element={<Signup onSignupSuccess={() => setIsLoggedIn(false)}/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </div>
    );
}

interface NavbarProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({isLoggedIn, setIsLoggedIn}) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8080/api/user/logout", {
                method: "POST",
                credentials: "include",
            });

            localStorage.removeItem('accessToken');
            setIsLoggedIn(false);
            navigate("/");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <a className="navbar-brand" href="/">My Blog</a>
                <div className="navbar-nav me-auto">
                    <a className="nav-link" href="/">홈</a>
                    <a className="nav-link" href="/articles">블로그 글</a>
                    <a className="nav-link" href="/new-article">새 글 작성</a>
                </div>
                <div className="navbar-nav ms-auto">
                    {!isLoggedIn ? (
                        <>
                            <a className="nav-link" href="/login">로그인</a>
                            <a className="nav-link" href="/signup">회원가입</a>
                        </>
                    ) : (
                        <button className="btn btn-outline-light" onClick={handleLogout}>로그아웃</button>
                    )}
                </div>
            </div>
        </nav>
    );
};

// ✅ 홈 페이지
const HomePage: React.FC = () => {
    return (
        <div className="container mt-5">
            <div className="jumbotron">
                <h1 className="display-4">환영합니다!</h1>
                <p className="lead">이곳은 메인 홈페이지입니다.</p>
                <a className="btn btn-primary btn-lg" href="/articles" role="button">
                    블로그 글 보러가기
                </a>
            </div>
        </div>
    );
};

// ✅ 404 페이지
const NotFoundPage: React.FC = () => {
    return (
        <div className="container mt-5">
            <div className="alert alert-warning text-center">
                <h2>404 - 페이지를 찾을 수 없습니다</h2>
                <p>요청하신 페이지가 존재하지 않습니다.</p>
                <a href="/" className="btn btn-primary">홈으로 돌아가기</a>
            </div>
        </div>
    );
};

export default App;
