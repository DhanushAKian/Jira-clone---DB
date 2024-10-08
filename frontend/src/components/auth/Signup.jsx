import React, { useState, useEffect } from 'react';
import jiralogo from '../../assets/jiralogo.png';
import './Signup.css';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const Signup = () => {
  const [input, setInput] = useState({
    fullName: '',
    email: '',
    password: '',
    cpassword: '',
  });
  
  const [token, setToken] = useState(null); 
  const navigate = useNavigate();
  
  const home = () => {
    navigate('/');
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    console.log(token);
    
    setToken(tokenFromUrl);
  }, [token]);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (input.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    if (input.password !== input.cpassword) {
      alert("Passwords do not match");
      return; 
    }

    try {

      const response = await axios.post('http://localhost:2000/api/auth/signup', {
        fullName: input.fullName,
        email: input.email,
        password: input.password,
        confirmPassword: input.cpassword,
        token: token 
      });

      if (response.status === 201) {
        alert('Signup successful! Redirecting to the login page...');
        navigate('/login');
      }

    } catch (err) {
      console.error('Error during signup:', err);
      alert('There was an issue with the signup. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <div className='signup'>
        <div className='sign-container'>
          <div className='logo-con'>
            <img className='img' src={jiralogo} alt="logo" onClick={home} /> <span className='name-logo' onClick={home}>Jira</span>
            <p className='si'>Sign-up to continue</p>
            <div className='ip-box font'>
              <input
                value={input.fullName}
                onChange={(e) => setInput({ ...input, fullName: e.target.value })}
                className='input i'
                type="text"
                placeholder='Enter your name'
                required
              />
              
              <input
                value={input.email}
                onChange={(e) => setInput({ ...input, email: e.target.value })}
                className='input i'
                type="email"
                placeholder='Enter your email-id'
                required
              />
              
              <input
                value={input.password}
                onChange={(e) => setInput({ ...input, password: e.target.value })}
                className='input i'
                type="password"
                placeholder='Enter your password'
                required
              />
              
              <input
                value={input.cpassword}
                onChange={(e) => setInput({ ...input, cpassword: e.target.value })}
                className='input i'
                type="password"
                placeholder='Confirm your password'
                required
              />
              
              <button type='submit' className='input inputb'>Sign-up</button>
            </div>
          </div>
          <div className='end'>
            <p className='font'><span>Already Have an account?</span> <span className='loginn'><span onClick={() => { navigate('/login') }}>Login now!</span></span></p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Signup;
