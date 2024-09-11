import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostDetails from './components/posts/PostDetails';
import Header from './components/Header'; // Ensure your Header component is set up correctly

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetails />} />
      </Routes>
    </div>
  );
}

export default App;