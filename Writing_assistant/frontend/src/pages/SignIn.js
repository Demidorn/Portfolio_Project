import React, { useEffect, useState } from 'react'
import { IoCloseCircleOutline } from "react-icons/io5";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { SignIn, useAuth } from '@clerk/clerk-react';
import { loginUser } from '../services/api';



const SignInPage = ({ closing }) => {
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, session } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn && session) {
      // Store Clerk token if user is signed in via Clerk
      localStorage.setItem('token', session.accessToken);
      navigate('/');
    }
  }, [isLoaded, isSignedIn, session, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ username: fullName, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        navigate('/');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occured. Please try again later.');
    }
  };


  return (
    <div className='  w-full bg-white bg-opacity-90 flex justify-center items-center ' >
      <div className='flex  flex-col justify-center items-center py-36 px-20 border w-full'>
        {<button className=' absolute  top-20 right-40 m-4 p-2 ' onClick={closing}>
          <IoCloseCircleOutline className='size-10 opacity-40' />
        </button>}
        <h1 className='text-[36px] font-black-900 font-[{style.interFont}]'>Welcome back!</h1>
        <div className='w-full mt-4 flex justify-center'>
          {/* Clerk SignIn Component */}
          <SignIn
            path="/SignIn"
            routing="path"
            signUpUrl="/Signup"
            fallbackRedirectUrl="/"
            appearance={{
              variables: {
                // Customize colors, fonts, etc. here (to be done by dorreen)
              },
            }}
          />

          {/* Divider or Option to Choose Another Method */}

          <div className='flex justify-center mt-2 px-4 items-center space-x-2'>
              <div className='bg-slate-500 size-0.5 w-20 h-0.5'></div>
              <p>Or login with your username (which is your fullname)</p>
              <div className='bg-slate-500 size-0.5 w-20 h-0.5'></div>
          </div>

          {/* Custom Backend Login Form */}
          <form className='w-full mt-4' onSubmit={handleLogin}>
            {error && <p className='text-red-500'>{error}</p>}
            <div className='gap-2 flex flex-col justify-center items-center'>
              <input
              type='username'
              placeholder='Enter your fullname from signup'
              id='username'
              className='border border-zinc-300 m-2 rounded-md h-10 w-full p-2 text-sm'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              ></input>
              <input
              type='password'
              placeholder='Enter your password from signup'
              id='password'
              className='border border-zinc-300 m-2 rounded-md h-10 w-full p-2 text-sm'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              ></input>
            </div>
            <div className='gap-2 justify-center items-center'>
              <button
              type='submit'
              className='border border-zinc-500 m-2 h-10 w-full rounded-md p-2 bg-blue-500 text-white border-none'
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
};

SignIn.propTypes = {
  closing: PropTypes.func,
}

export default SignInPage