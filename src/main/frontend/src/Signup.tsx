import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const Signup: React.FC<{ onSignupSuccess: () => void }> = ({onSignupSuccess}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // 세션 쿠키 저장
                body: JSON.stringify({email, password}),
            });

            if (response.ok) {
                onSignupSuccess();
                navigate('/login');
            } else {
                setError('회원가입 실패. 이미 등록된 이메일일 수 있습니다.');
            }
        } catch (err) {
            setError('네트워크 오류가 발생했습니다.');
        }
    };

    return (
        <section className="d-flex vh-100 gradient-custom-signup">
            <div className="container-fluid row justify-content-center align-content-center">
                <div className="card bg-dark" style={{borderRadius: '1rem'}}>
                    <div className="card-body p-5 text-center">
                        <h2 className="text-white">SIGN UP</h2>
                        <p className="text-white-50 mt-2 mb-5">서비스 사용을 위한 회원 가입</p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-white">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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

                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signup;
