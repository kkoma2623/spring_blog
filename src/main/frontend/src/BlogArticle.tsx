import React, {useEffect, useState} from 'react';

// 블로그 글 타입 정의
interface Article {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

interface BlogArticleProps {
    articleId?: string;
}

const BlogArticle: React.FC<BlogArticleProps> = ({articleId}) => {
    // URL에서 ID 가져오기
    const getArticleIdFromUrl = (): string | null => {
        const pathname = window.location.pathname;
        const match = pathname.match(/\/articles?\/(\d+)/);
        return match ? match[1] : null;
    };

    const id = articleId || getArticleIdFromUrl();

    // State 정의
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 날짜 포맷 함수
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    // API에서 단일 글 데이터 가져오기
    useEffect(() => {
        if (!id) {
            setError('글 ID가 없습니다.');
            setLoading(false);
            return;
        }

        const fetchArticle = async () => {
            try {
                setLoading(true);

                const response = await fetch(`http://localhost:8080/api/articles/${id}`);

                if (!response.ok) {
                    throw new Error(`API 호출 실패: ${response.status}`);
                }

                const data: Article = await response.json();
                setArticle(data);
                setError(null);

            } catch (err) {
                console.error('API 호출 에러:', err);
                setError('글을 불러오는데 실패했습니다.');
                setArticle(null);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    // 수정 버튼 클릭 핸들러
    const handleEdit = () => {
        if (article) {
            window.location.href = `/articles/${article.id}/edit`;
        }
    };

    // 삭제 버튼 클릭 핸들러
    const handleDelete = async () => {
        if (!article) return;

        const confirmDelete = window.confirm('정말로 이 글을 삭제하시겠습니까?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8080/api/articles/${article.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('삭제에 실패했습니다.');
            }

            alert('글이 삭제되었습니다.');
            window.location.href = '/articles';

        } catch (err) {
            console.error('삭제 에러:', err);
            alert('삭제에 실패했습니다.');
        }
    };

    // 로딩 중 화면
    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <p className="mt-3">글을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // 에러 발생 시 화면
    if (error) {
        return (
            <div>
                <div className="p-5 mb-5 text-center bg-light">
                    <h1 className="mb-3">My Blog</h1>
                    <h4 className="mb-3">블로그에 오신 것을 환영합니다.</h4>
                </div>

                <div className="container mt-5">
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">오류 발생!</h4>
                        <p>{error}</p>
                        <button
                            className="btn btn-outline-danger me-2"
                            onClick={() => window.location.reload()}
                        >
                            다시 시도
                        </button>
                        <a href="/articles" className="btn btn-outline-primary">
                            글 목록으로 돌아가기
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // 글이 없는 경우
    if (!article) {
        return (
            <div>
                <div className="p-5 mb-5 text-center bg-light">
                    <h1 className="mb-3">My Blog</h1>
                    <h4 className="mb-3">블로그에 오신 것을 환영합니다.</h4>
                </div>

                <div className="container mt-5">
                    <div className="alert alert-warning text-center">
                        <h4>글을 찾을 수 없습니다.</h4>
                        <p>요청하신 글이 존재하지 않거나 삭제되었습니다.</p>
                        <a href="/articles" className="btn btn-primary">
                            글 목록으로 돌아가기
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // 정상적으로 글을 불러온 경우
    return (
        <div>
            <div className="p-5 mb-5 text-center bg-light">
                <h1 className="mb-3">My Blog</h1>
                <h4 className="mb-3">블로그에 오신 것을 환영합니다.</h4>
            </div>

            <div className="container mt-5">
                <div className="row">
                    <div className="col-lg-8">
                        <article>
                            <header className="mb-4">
                                <h1 className="fw-bolder mb-1">{article.title}</h1>
                                <div className="text-muted fst-italic mb-2">
                                    Posted on {formatDate(article.createdAt)}
                                </div>
                            </header>

                            <section className="mb-5">
                                <p className="fs-5 mb-4" style={{whiteSpace: 'pre-wrap'}}>
                                    {article.content}
                                </p>
                            </section>

                            <div className="mb-4">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={handleEdit}
                                >
                                    수정
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm me-2"
                                    onClick={handleDelete}
                                >
                                    삭제
                                </button>
                                <a href="/articles" className="btn btn-outline-primary btn-sm">
                                    목록으로 돌아가기
                                </a>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogArticle;