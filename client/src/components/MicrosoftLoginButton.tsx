import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { microsoftAuthService } from '../services/microsoft-auth.service';
import { isMicrosoftAuthEnabled } from '../config/msalConfig';
import { Button } from './ui/button';

interface MicrosoftLoginButtonProps {
  onError?: (error: string) => void;
}

export function MicrosoftLoginButton({ onError }: MicrosoftLoginButtonProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!isMicrosoftAuthEnabled()) {
    return null;
  }

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    try {
      await microsoftAuthService.loginPopup();
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Microsoft login error:', error);
      if (onError) {
        onError(error.message || 'Microsoft login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleMicrosoftLogin}
      disabled={loading}
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23">
        <path fill="#f35325" d="M0 0h11v11H0z" />
        <path fill="#81bc06" d="M12 0h11v11H12z" />
        <path fill="#05a6f0" d="M0 12h11v11H0z" />
        <path fill="#ffba08" d="M12 12h11v11H12z" />
      </svg>
      {loading ? 'Signing in with Microsoft...' : 'Sign in with Microsoft'}
    </Button>
  );
}
