import React, {useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';

interface Article {
    id?: number | null;
    title: string;
    content: string;
}

const NewArticle: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // BlogList나 BlogArticle에서 전달받은 article 데이터
    const passedArticle = location.state?.article;

    // 초기 데이터 설정
    const getInitialData = (): Article => {
        if (id && passedArticle) {
            // 수정 모드 + 전달받은 데이터 있음
            return {
                id: parseInt(id),
                title: passedArticle.title,
                content: passedArticle.content
            };
        } else if (id) {
            // 수정 모드 + 전달받은 데이터 없음
            return {
                id: parseInt(id),
                title: '',
                content: ''
            };
        } else {
            // 새 글 작성 모드
            return {
                title: '',
                content: ''
            };
        }
    };

    const [formData, setFormData] = useState<Article>(getInitialData());

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {id, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async () => {
        if (formData.id) {
            // 수정 모드
            try {
                const response = await fetch(`http://localhost:8080/api/articles/${formData.id}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        title: formData.title,
                        content: formData.content
                    })
                });

                if (response.ok) {
                    alert('글이 성공적으로 수정되었습니다!');
                    navigate(`/articles/${formData.id}`);
                } else {
                    throw new Error('수정 실패');
                }
            } catch (error) {
                console.error('글 수정 에러:', error);
                alert('글 수정에 실패했습니다.');
            }
        } else {
            // 등록 모드
            try {
                const response = await fetch('http://localhost:8080/api/articles', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        title: formData.title,
                        content: formData.content
                    })
                });

                if (response.ok) {
                    alert('글이 성공적으로 등록되었습니다!');
                    navigate('/articles');
                } else {
                    throw new Error('등록 실패');
                }
            } catch (error) {
                console.error('글 저장 에러:', error);
                alert('글 저장에 실패했습니다.');
            }
        }
    };

    const isEditMode = formData.id != null;

    return (
        <div>
            {/* Header Section */}
            <div className="p-5 mb-5 text-center bg-light">
                <h1 className="mb-3">My Blog</h1>
                <h4 className="mb-5">블로그에 오신 것을 환영합니다.</h4>
            </div>

            {/* Main Content */}
            <div className="container mt-5">
                <div className="row">
                    <div className="col-lg-8">
                        <article>
                            {/* Article ID (hidden) */}
                            <input
                                id="article-id"
                                type="hidden"
                                value={formData.id || ''}
                            />

                            {/* Title Section */}
                            <header className="mb-4">
                                <input
                                    className="form-control"
                                    id="title"
                                    placeholder="제목"
                                    type="text"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </header>

                            {/* Content Section */}
                            <section className="mb-5">
                                <textarea
                                    className="form-control h-25"
                                    id="content"
                                    placeholder="내용"
                                    rows={10}
                                    value={formData.content}
                                    onChange={handleInputChange}
                                />
                            </section>

                            {/* Action Buttons */}
                            {isEditMode ? (
                                <button
                                    className="btn btn-primary btn-sm"
                                    id="modify-btn"
                                    type="button"
                                    onClick={handleSubmit}
                                >
                                    수정
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary btn-sm"
                                    id="create-btn"
                                    type="button"
                                    onClick={handleSubmit}
                                >
                                    등록
                                </button>
                            )}
                        </article>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewArticle;