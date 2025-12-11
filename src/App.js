import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import MapView from './pages/MapView';
import Analytics from './pages/Analytics';
import AIInsights from './pages/AIInsights';
import Community from './pages/Community';
import ThreadList from './pages/ThreadList';
import ThreadDetail from './pages/ThreadDetail';
import NewThread from './pages/NewThread';
import About from './pages/About';
import Profile from './pages/Profile';
import MyIssues from './pages/MyIssues';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import './styles/index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/insights" element={<AIInsights />} />
              <Route path="/community" element={<Community />} />
              <Route path="/community/category/:categoryId" element={<ThreadList />} />
              <Route path="/community/thread/:threadId" element={<ThreadDetail />} />
              <Route path="/community/new-thread" element={<NewThread />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-issues" element={<MyIssues />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/signup" element={<Register />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;