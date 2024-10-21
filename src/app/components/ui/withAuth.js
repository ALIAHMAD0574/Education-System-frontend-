// src/app/components/ui/withAuth.js
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = Cookies.get('token'); // Check for the presence of the token
      if (!token) {
        router.push('/register?login=true'); // Redirect to the register/login page if not authenticated
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
