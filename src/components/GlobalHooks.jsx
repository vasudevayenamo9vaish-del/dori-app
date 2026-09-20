import { usePushNotifications } from '../hooks/usePushNotifications';
import { useLocalNotifications } from '../hooks/useLocalNotifications';
import { useBackButton } from '../hooks/useBackButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function GlobalHooks() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useBackButton(); 
  usePushNotifications(user, navigate);
  useLocalNotifications();

  return null;
}
