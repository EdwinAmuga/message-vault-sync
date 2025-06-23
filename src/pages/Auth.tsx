
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

type AuthMode = 'login' | 'signup' | 'forgot-password';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onSwitchToSignup={() => setMode('signup')}
            onSwitchToForgotPassword={() => setMode('forgot-password')}
          />
        );
      case 'signup':
        return <SignupForm onSwitchToLogin={() => setMode('login')} />;
      case 'forgot-password':
        return <ForgotPasswordForm onSwitchToLogin={() => setMode('login')} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Welcome to MsgSync';
      case 'signup':
        return 'Create your account';
      case 'forgot-password':
        return 'Reset password';
      default:
        return 'MsgSync';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center relative">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                {/* Cloud shape */}
                <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                {/* Envelope inside cloud */}
                <rect x="8" y="9" width="8" height="5" rx="0.5" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="0.4"/>
                <path d="M8 9.5l4 2.5 4-2.5" stroke="white" strokeWidth="0.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Up arrow */}
                <path d="M11 7l1-1 1 1" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
                {/* Down arrow */}
                <path d="M11 17l1 1 1-1" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">MsgSync</span>
          </div>
          <p className="text-gray-600">Real-time message backup and sync</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">{getTitle()}</CardTitle>
          </CardHeader>
          <CardContent>{renderForm()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
