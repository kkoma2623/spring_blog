import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useLocation} from "react-router-dom";

// 블로그 글 타입 정의
interface Article {
    id: number;
    title: string;
    content: string;
}

const BlogList: React.FC = () => {
    // 1. state 정의 - API에서 가져온 데이터를 저장할 곳
    const [articles, setArticles] = useState<Article[]>([]); // 빈 배열로 시작
    const [loading, setLoading] = useState<boolean>(true);   // 로딩 상태
    const [error, setError] = useState<string | null>(null); // 에러 상태

    const navigate = useNavigate();
    const location = useLocation();

    // OAuth 로그인 후 토큰 처리
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        
        if (token) {
            // 토큰이 있으면 localStorage에 저장
            localStorage.setItem('accessToken', token);
            // URL에서 토큰 제거
            window.history.replaceState({}, document.title, "/articles");
            // 상위 컴포넌트에서 처리하므로 새로고침 제거
        }
    }, [location]);

    // 2. 컴포넌트가 처음 렌더링될 때 API 호출
    useEffect(() => {
        // API 호출하는 함수
        const fetchArticles = async () => {
            try {
                setLoading(true); // 로딩 시작

                // 3. API 호출
                const response = await fetch('http://localhost:8080/articles', {
                    credentials: "include"
                });

                if (response.status === 401) {
                    navigate("/login");
                }
                // 응답이 실패한 경우
                if (!response.ok) {
                    throw new Error(`API 호출 실패: ${response.status}`);
                }

                // 4. JSON 데이터로 변환
                const data: Article[] = await response.json();

                // 5. state에 데이터 저장
                setArticles(data);
                setError(null); // 에러 초기화

            } catch (err) {
                // 에러 발생시 처리
                console.error('API 호출 에러:', err);
                setError('데이터를 불러오는데 실패했습니다.');
                setArticles([]); // 빈 배열로 초기화
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        // API 호출 실행
        fetchArticles();
    }, []); // 빈 배열 = 컴포넌트가 처음 마운트될 때만 실행

    // 6. 로딩 중일 때 화면
    if (loading) {
        return (
            <div>
                <link
                    rel="stylesheet"
                    href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
                />
                <div className="container mt-5">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p className="mt-3">블로그 글을 불러오는 중...</p>
                    </div>
                </div>
            </div>
        );
    }

    // 7. 에러가 발생했을 때 화면
    if (error) {
        return (
            <div>
                <link
                    rel="stylesheet"
                    href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
                />
                <div className="container mt-5">
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">오류 발생!</h4>
                        <p>{error}</p>
                        <button
                            className="btn btn-outline-danger"
                            onClick={() => window.location.reload()}
                        >
                            다시 시도
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 8. 정상적으로 데이터를 불러왔을 때 화면
    return (
        <div>
            {/* Bootstrap CSS */}
            <link
                rel="stylesheet"
                href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
            />

            {/* 헤더 부분 */}
            <div className="p-5 mb-5 text-center bg-light">
                <h1 className="mb-3">My Blog</h1>
                <h4 className="mb-5">블로그에 오신 것을 환영합니다.</h4>
            </div>

            {/* 블로그 글 목록 */}
            <button type="button" id="create-btn" className="btn btn-secondary btn-sm mb-3"
                    onClick={() => navigate(`/new-article`)}>글 등록
            </button>
            <div className="container">
                {/* 글이 없는 경우 */}
                {articles.length === 0 ? (
                    <div className="text-center">
                        <div className="alert alert-info">
                            <h5>아직 작성된 블로그 글이 없습니다.</h5>
                            <p>첫 번째 글을 작성해보세요!</p>
                        </div>
                    </div>
                ) : (
                    /* 글이 있는 경우 - API에서 가져온 articles 배열을 map으로 반복 */
                    articles.map((article) => (
                        <div key={article.id} className="row mb-4">
                            <div className="col-12">
                                <div className="card shadow-sm">
                                    <div className="card-header bg-primary text-white">
                                        <strong>글 번호: {article.id}</strong>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title">{article.title}</h5>
                                        <p className="card-text">{article.content}</p>
                                        <Link className="btn btn-primary" to={`/articles/${article.id}`}>보러가기</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BlogList;