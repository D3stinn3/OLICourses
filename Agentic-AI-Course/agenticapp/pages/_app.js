import '../styles/global.css';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../components/AchievementToast';
import { InspectProvider } from '../components/InspectMode';
import InspectPanel from '../components/InspectMode';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <InspectProvider>
          <Component {...pageProps} />
          <InspectPanel />
        </InspectProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
