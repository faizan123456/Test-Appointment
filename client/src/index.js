import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import 'assets/plugins/nucleo/css/nucleo.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'assets/scss/argon-dashboard-react.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminLayout from 'layouts/Admin.js';
import AuthLayout from 'layouts/Auth.js';

const accessToken = localStorage.getItem('token');

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {accessToken ? (
        <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
      ) : (
        <>
          <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
          <Redirect from="/" to="/auth/login" />
        </>
      )}
    </Switch>
    <ToastContainer />
  </BrowserRouter>,
  document.getElementById('root')
);
