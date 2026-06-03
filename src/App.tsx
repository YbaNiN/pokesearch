import { Routes, Route, Navigate } from 'react-router-dom';
import { StartScreen } from '@/pages/StartScreen';
import { GameScreen } from '@/pages/GameScreen';
import { ResultScreen } from '@/pages/ResultScreen';
import { RankingScreen } from '@/pages/RankingScreen';
import { PokedexScreen } from '@/pages/PokedexScreen';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/play" element={<GameScreen />} />
      <Route path="/result" element={<ResultScreen />} />
      <Route path="/ranking" element={<RankingScreen />} />
      <Route path="/pokedex" element={<PokedexScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
