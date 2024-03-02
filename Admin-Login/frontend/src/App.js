import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/Navbar';
import Home from './component/Home';
import Login from './component/Login';
import Register from './component/Register';
import Profile from './component/Profile';
import Students from './component/Students';
import StudentMarks from './component/StudentMarks';
import './App.css';

const App = () => {
  return (
    <Router>
    <Routes>
    <Route
        exact
        path="/"
        element={<Login />}
    ></Route>
    <Route
        exact
        path="/students"
        element={<Students />}
    ></Route>
    <Route
        exact
        path="/mark/:id"
        element={<StudentMarks />}
    ></Route>
</Routes>
</Router>
  );
};

export default App;
