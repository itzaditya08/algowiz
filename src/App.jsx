import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import GraphPage from './pages/algorithms/GraphPage';
import SortingPage from './pages/algorithms/SortingPage';
import CPU_SchedulingPage from './pages/algorithms/CPU_SchedulingPage';
import CacheEvictionPage from './pages/algorithms/CacheEvictionPage';
import TreeStructuresPage from './pages/algorithms/TreeStructuresPage';
import SearchingPage from './pages/algorithms/SearchingPage';
import MessageQueuesPage from './pages/algorithms/MessageQueuesPage';
import DefragmentationPage from './pages/algorithms/DefragmentationPage';
import PagingPage from './pages/algorithms/PagingPage';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/graph-algorithms/*" element={<GraphPage />} />
            <Route path="/os-scheduling-algorithms/*" element={<CPU_SchedulingPage />} />
            <Route path="/sorting-algorithms/*" element={<SortingPage />} />
            <Route path="/cache-eviction-policies/*" element={<CacheEvictionPage />} />
            <Route path="/tree-structures/*" element={<TreeStructuresPage />} />
            <Route path="/searching-algorithms/*" element={<SearchingPage />} />
            <Route path="/message-queues/*" element={<MessageQueuesPage />} />
            <Route path="/free-space-defragmentation/*" element={<DefragmentationPage />} />
            <Route path="/paging-algorithms/*" element={<PagingPage />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;