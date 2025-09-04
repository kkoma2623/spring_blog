import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import BlogList from "./BlogLlist";
import BlogArticle from "./BlogArticle";

function App() {
    return (
        <Router>
            <div className="App">
                {/* 네비게이션 바 (선택사항) */}
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container">
                        <a className="navbar-brand" href="/">My Blog</a>
                        <div className="navbar-nav">
                            <a className="nav-link" href="/">홈</a>
                            <a className="nav-link" href="/articles">블로그 글</a>
                        </div>
                    </div>
                </nav>

                {/* 라우팅 설정 */}
                <Routes>
                    {/* 홈 페이지 (/) */}
                    <Route path="/" element={<HomePage/>}/>

                    {/* 블로그 글 목록 (/articles) */}
                    <Route path="/articles" element={<BlogList/>}/>
                    <Route path="/articles/:id" element={<BlogArticle/>}/>

                    {/* 404 페이지 (매치되지 않는 모든 주소) */}
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </div>
        </Router>
    );
}

// 홈 페이지 컴포넌트
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

// 404 페이지 컴포넌트
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