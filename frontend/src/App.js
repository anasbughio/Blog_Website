import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import { BrowserRouter as Router, Routes, Route ,Navigate} from 'react-router-dom';
import PrivateRoute from './controllers/PrivateController';
import { AuthProvider } from './context/AuthContext';
import PostDetails from './pages/PostsDetails';
import Navbar from './components/Navbar';
import Home from "./pages/Home"; //
import Profile from './pages/ProfilePage';
import Bookmarks from './pages/Bookmarks';
import SearchResults from './pages/SearchResults';
function App() {
  return (
    <>
    {/* <Navbar /> */}
    <AuthProvider>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path='/register' element={<Register />} />
          
          <Route path='/login' element={<Login />} />
         
            <Route path="/posts" element={ <PrivateRoute> <CreatePost /> </PrivateRoute>} />
            <Route path="/getposts" element={<PrivateRoute><Home /> </PrivateRoute>} />
            <Route path="/posts/:id" element={<PrivateRoute><PostDetails /> </PrivateRoute>} />
            <Route path="/profilepage" element={<PrivateRoute><Profile /> </PrivateRoute>} />
            <Route path="/bookmarks" element={<PrivateRoute><Bookmarks /></PrivateRoute>} />
            <Route path="/search/:query" element={<PrivateRoute><SearchResults /></PrivateRoute>} />

         
         
        </Routes>
      </Router>
    </AuthProvider>
    </>
  );
}

export default App;
