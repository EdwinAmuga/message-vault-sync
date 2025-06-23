
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setIsSubmitted(true);
      toast({
        title: "Reset email sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: "Please check your email and try again.",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4 text-center">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Check your email</h3>
          <p className="text-gray-600">
            We've sent a password reset link to {email}
          </p>
        </div>
        <Button onClick={onSwitchToLogin} variant="outline" className="w-full">
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-medium">Reset your password</h3>
        <p className="text-gray-600 text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </Button>
      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm text-blue-600 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </form>
  );
};
