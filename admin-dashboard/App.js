import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ManageUsers from './ManageUsers';
import ManageCourts from './ManageCourts';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<ManageUsers />} />
        <Route path="/courts" element={<ManageCourts />} />
        
      </Routes>
    </Router>
  );
}

export default App;
