import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../stores';
import { isSessionExpired, handleAccountSessionExpired } from '../stores/slices/authSlice';
import { toast } from 'sonner';

// let sec = 1
export const useSessionMonitor = (checkInterval: number = 60000) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

    const checkSession = useCallback(function() {
        if (isSessionExpired()) {
            dispatch(handleAccountSessionExpired());
            toast.error("Account session expired, You are now being logged out");
            navigate('/login', { replace: true });
        }
    }, [dispatch, navigate]);


    useEffect(function() {
        // Check immediately on mount
        checkSession();

        const intervalId = setInterval(() => {
            checkSession();
            // console.log(sec += 1)
        }, checkInterval);

        // Cleanup interval on unmount
        return () => {
            clearInterval(intervalId);
        };
    }, [checkSession, checkInterval]);
};