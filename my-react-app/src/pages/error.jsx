import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Error from './error'; // Path to your Error component
import Dashboard from './dashboard'; // Path to your Dashboard component

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define your routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Catch-all route for errors */}
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
};

export default App;
