import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../store/slices/authSlice';
import { getCurrentUser } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google OAuth authentication failed');
      navigate('/login');
      return;
    }

    if (token) {
      // Store token and get user data
      localStorage.setItem('token', token);
      dispatch(setToken(token));
      dispatch(getCurrentUser()).then(() => {
        toast.success('Successfully logged in with Google!');
        navigate('/dashboard');
      }).catch(() => {
        toast.error('Failed to get user data');
        navigate('/login');
      });
    } else {
      toast.error('No authentication token received');
      navigate('/login');
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Completing authentication...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we complete your Google OAuth authentication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;