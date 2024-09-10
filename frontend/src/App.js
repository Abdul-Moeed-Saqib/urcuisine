import './App.css';
import Home from './pages/Home';
import Category from './pages/Category';
import PostDetails from './components/posts/PostDetails';
import Login from './components/auth/Login';
import Signup from './components/Auth/Signup';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/post/:id" element={<PostDetails />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
