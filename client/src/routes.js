import Index from 'views/Index.js';
import Profile from 'views/Profile.js';
import Register from 'views/Register.js';
import Login from 'views/Login.js';
import Appointments from 'views/Appointments.js';
import User from 'views/User';

var routes = [
  {
    path: '/user-profile',
    name: 'User Profile',
    icon: 'ni ni-single-02 text-yellow',
    component: Profile,
    layout: '/admin',
  },
  {
    path: '/appointments',
    name: 'Appointments',
    icon: 'fas fa-calendar-alt text-success',
    component: Appointments,
    layout: '/admin',
  },
  {
    path: '/patients',
    name: 'Patients',
    icon: 'ni ni-single-02 text-red',
    component: User,
    layout: '/admin',
  },
  {
    path: '/doctors',
    name: 'Doctors',
    icon: 'ni ni-single-02 text-primary',
    component: User,
    layout: '/admin',
  },
  {
    path: '/login',
    name: 'Login',
    icon: 'ni ni-key-25 text-info',
    component: Login,
    layout: '/auth',
  },
  {
    path: '/register',
    name: 'Register',
    icon: 'ni ni-circle-08 text-pink',
    component: Register,
    layout: '/auth',
  },
];
export default routes;
