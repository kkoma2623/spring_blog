import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import './App.css';
import BlogList from "./BlogLlist";
import BlogArticle from "./BlogArticle";
import NewArticle from "./NewArticle";
import Login from "./Login";
import Signup from "./Signup";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <Router>
            <div className="App">
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>

                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/articles" element={<BlogList/>}/>
                    <Route path="/articles/:id" element={<BlogArticle/>}/>
                    <Route path="/new-article" element={<NewArticle/>}/>
                    <Route path="/new-article/:id" element={<NewArticle/>}/>
                    <Route path="/login" element={<Login onLoginSuccess={() => setIsLoggedIn(true)}/>}/>
                    <Route path="/user" element={<Signup onSignupSuccess={() => setIsLoggedIn(false)}/>}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </div>
        </Router>
    );
}

interface NavbarProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void;
}

// ✅ 네비게이션 바 컴포넌트
const Navbar: React.FC<NavbarProps> = ({isLoggedIn, setIsLoggedIn}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 실제 로그아웃 API 호출 필요 시 여기에
        setIsLoggedIn(false);
        navigate("/"); // 홈으로 이동
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
                            <a className="nav-link" href="/src/Signup">회원가입</a>
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
