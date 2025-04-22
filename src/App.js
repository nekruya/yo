import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="content">
          <Sidebar />
          <main className="main-content">
            <Switch>
              <Route path="/" exact component={Welcome} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/courses" component={Courses} />
              <Route path="/profile" component={Profile} />
              <Route path="/add-course" component={AddCourse} />
              <Route path="/teachers" component={Teachers} />
              <Route path="/students" component={Students} />
              <Route path="/administration" component={Administration} />
              <Route path="/schedule" component={Schedule} />
              <Route path="/student-courses" component={StudentCourses} />
              <Route path="/calendar" component={Calendar} />
            </Switch>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;