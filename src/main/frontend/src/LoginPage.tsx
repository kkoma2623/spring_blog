import React from 'react';

const LoginPage: React.FC<{ onLoginSuccess: () => void }> = ({onLoginSuccess}) => {
    // Spring Security OAuth2 엔드포인트로 직접 이동
    const handleNaverLogin = () => {
        // don't call onLoginSuccess here — login isn't complete until OAuth callback
        window.location.href = 'http://localhost:8080/oauth2/authorization/naver';
    };

    return (
        <div className="gradient-custom d-flex vh-100">
            <div className="container-fluid row justify-content-center align-content-center">
                <div className="card bg-dark" style={{borderRadius: '1rem'}}>
                    <div className="card-body p-5 text-center">
                        <h2 className="text-white">LOGIN</h2>
                        <p className="text-white-50 mt-2 mb-5">서비스 사용을 위해 로그인을 해주세요!</p>
                        <div className="mb-2">
                            <button
                                className="btn btn-success"
                                onClick={handleNaverLogin}
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }}
                            >
                                네이버 로그인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
