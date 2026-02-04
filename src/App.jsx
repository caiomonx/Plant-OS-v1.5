import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './LandingPage';
import ModulesPage from './ModulesPage';
import StatsPage from './StatsPage';
import SimulationPage from './SimulationPage';
import PageTransition from './components/PageTransition';

function App() {
  const location = useLocation();

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      <AnimatePresence initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <PageTransition>
              <LandingPage />
            </PageTransition>
          } />
          <Route path="/modulos" element={
            <ModulesPage />
          } />
          <Route path="/estatisticas" element={
            <PageTransition>
              <StatsPage />
            </PageTransition>
          } />
          <Route path="/potassio" element={
            <PageTransition>
              <SimulationPage />
            </PageTransition>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
