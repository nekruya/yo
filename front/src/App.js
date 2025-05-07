import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { getToken } from './services/auth';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Profile from './pages/Profile';
import Welcome from './pages/Welcome';
import AddCourse from './pages/Addcourse';
import Teachers from './pages/Teachers';
import Students from './pages/Students';
import Administration from './pages/Administration';
import Schedule from './pages/Schedule';
import StudentCourses from './pages/StudentCourses';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import Register from './pages/Register';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './services/queryClient';
import ErrorBoundary from './components/ErrorBoundary';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <div className="app">
            <Header />
            <div className="content">
              <Sidebar />
              <main className="main-content">
                <Switch>
                  <Route path="/" exact component={Welcome} />
                  <Route path="/login" component={Login} />
                  <Route path="/register" component={Register} />
                  <ProtectedRoute path="/dashboard" component={Dashboard} />
                  <ProtectedRoute path="/courses" component={Courses} />
                  <ProtectedRoute path="/profile" component={Profile} />
                  <ProtectedRoute path="/add-course" component={AddCourse} />
                  <ProtectedRoute path="/teachers" component={Teachers} />
                  <ProtectedRoute path="/students" component={Students} />
                  <ProtectedRoute path="/administration" component={Administration} />
                  <ProtectedRoute path="/schedule" component={Schedule} />
                  <ProtectedRoute path="/student-courses" component={StudentCourses} />
                  <ProtectedRoute path="/calendar" component={Calendar} />
                  <Route path="*">
                    <Redirect to="/" />
                  </Route>
                </Switch>
              </main>
            </div>
          </div>
        </Router>
      </ErrorBoundary>
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;