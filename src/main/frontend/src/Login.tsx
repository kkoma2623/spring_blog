import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const Login: React.FC<{ onLoginSuccess: () => void }> = ({onLoginSuccess}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include', // 세션 쿠키 저장
                body: JSON.stringify({username, password}),
            });

            if (response.ok) {
                onLoginSuccess();
                navigate('/articles'); // 로그인 성공 시 이동
            } else {
                setError('로그인 실패. 아이디나 비밀번호를 확인해주세요.');
            }
        } catch (err) {
            setError('네트워크 오류가 발생했습니다.');
        }
    };

    return (
        <section className="d-flex vh-100 gradient-custom">
            <div className="container-fluid row justify-content-center align-content-center">
                <div className="card bg-dark" style={{borderRadius: '1rem'}}>
                    <div className="card-body p-5 text-center">
                        <h2 className="text-white">LOGIN</h2>
                        <p className="text-white-50 mt-2 mb-5">
                            서비스를 사용하려면 로그인을 해주세요!
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-white">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="text-danger">{error}</p>}
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </form>

                        <button
                            type="button"
                            className="btn btn-secondary mt-3"
                            onClick={() => navigate('/signup')}
                        >
                            회원가입
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
