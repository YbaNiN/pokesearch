import { Routes, Route, Navigate } from 'react-router-dom';
import { StartScreen } from '@/pages/StartScreen';
import { GameScreen } from '@/pages/GameScreen';
import { ResultScreen } from '@/pages/ResultScreen';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/play" element={<GameScreen />} />
      <Route path="/result" element={<ResultScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
