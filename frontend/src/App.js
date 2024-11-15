import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostDetails from './components/posts/PostDetails';
import Login from './components/auth/Login'; 
import Signup from './components/auth/Signup'; 
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import CreatePost from './components/posts/CreatePost';
import UpdatePost from './components/posts/UpdatePost';
import Category from './pages/Category';
import SearchResults from './pages/SearchResults';
import CountryPosts from './components/posts/CountryPosts';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id/edit"
          element={
            <ProtectedRoute>
              <UpdatePost />
            </ProtectedRoute>
          }
        />
        <Route path="/category" element={<Category />} />
        <Route path="/search/:query" element={<SearchResults />} />
        <Route path="/country/:country" element={<CountryPosts />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;