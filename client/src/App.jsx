import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LeetcodeProfile from './components/LeetcodeProfile';
import Contest from './components/Contest';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 p-4">
        {/* Navigation Bar*/}
        <nav className="mb-6 flex gap-4">
          <Link to="/" className="text-blue-600 hover:underline">Profile</Link>
          <Link to="/contest" className="text-blue-600 hover:underline">Contest</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<LeetcodeProfile/>} />
          <Route path="/contest" element={<Contest/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
