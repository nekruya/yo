import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import CalendarPage from './pages/Calendar'; // 🔥 добавлено

const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Dashboard} />
                <Route path="/courses" component={Courses} />
                <Route path="/notifications" component={Notifications} />
                <Route path="/profile" component={Profile} />
                <Route path="/calendar" component={CalendarPage} /> {/* 🔥 добавлено */}
            </Switch>
        </Router>
    );
};

export default Routes;
