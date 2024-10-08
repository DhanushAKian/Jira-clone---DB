import { useState } from 'react';
import jiralogo from '../../assets/jiralogo.png';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext'; 

const Login = () => {
    const [user, setUser] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser: setGlobalUser, setToken: setGlobalToken } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:2000/api/auth/login', {
                email: user.email,
                password: user.password,
            });

            if (response.status === 200) {
                const { token, ...userData } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                setGlobalToken(token);
                setGlobalUser(userData);
                console.log(token)

                navigate('/home');
            }
        } catch (err) {
            setError('Invalid email or password');
            setUser({ ...user, password: '' }); 
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div className='login'>
                <div className='login-container'>
                    <div className='logo-con'>
                        <img className='img' src={jiralogo} alt='logo' onClick={() => navigate('/')} />
                        <span className='name-logo' onClick={() => navigate('/')}>Jira</span>
                        <p className='log'>Login to Continue...</p>
                        <div className='ip-box font'>
                            <input
                                value={user.email}
                                className='input i'
                                type='email'
                                placeholder='Enter your Email-id'
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                required
                            />
                            <input
                                value={user.password}
                                className='input i'
                                type='password'
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                                required
                                placeholder='Enter Password'
                            />
                            <button type='submit' className='input inputb'>Login</button>
                        </div>
                    </div>
                    <div className='end'>
                        <p className='font'>
                            <span>Does not Have an account ? </span>
                            <span className='sign-up'>
                                <span onClick={() => navigate('/signup')}>Sign up here!</span>
                            </span>
                        </p>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </div>
        </form>
    );
};

export default Login;
