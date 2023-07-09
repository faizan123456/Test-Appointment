import { toast } from 'react-toastify';
import axios from 'axios';
const baseUrl = process.env.REACT_APP_BASS_URL;

// Register User
export const register = async (data, history) => {
  const userObj = {
    username: data.username,
    email: data.email,
    phone: data.phone,
    password: data.password,
  };
  try {
    const resp = await axios.post(baseUrl + 'user/register', userObj);
    const { success, message, user, token } = resp.data;
    if (success) {
      localStorage.setItem('token', token);
      history.push('/admin/appointments');
      toast.success(message);
    } else {
      toast.error(message);
    }
  } catch (err) {
    console.log('err--->', err);
    toast.error(err.response.data.message);
  }
};

// create Appointment
export const makeAppointment = async (data) => {
  try {
    const resp = await axios.post(
      baseUrl + 'appointment/createAppointment',
      data
    );
    const { success, message } = resp.data;
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  } catch (err) {
    console.log('err--->', err);
    toast.error(err.response.data.message);
  }
};

// Login User
export const login = async (data, history) => {
  const userObj = {
    email: data.email,
    password: data.password,
  };
  try {
    const resp = await axios.post(baseUrl + 'user/login', userObj);
    const { success, message, data } = resp.data;
    if (success) {
      localStorage.setItem('token', data.token);
      history.push('/admin/appointments');
      toast.success(message);
    } else {
      toast.error(message);
    }
  } catch (err) {
    console.log('err--->', err);
    toast.error(err.response.data.message);
  }
};

// Login User
export const updateStatus = async (data) => {
  try {
    console.log('data-->', data);
    const resp = await axios.put(baseUrl + 'appointment/updateStatus', data);
    const { success, message } = resp.data;
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  } catch (err) {
    console.log('err--->', err);
    toast.error(err.response.data.message);
  }
};

//My Appointments
export const myAppointmentList = async (Id) => {
  try {
    const resp = await axios.get(baseUrl + `appointment/myAppointments/${Id}`);
    const { success, message, myAppointments } = resp.data;
    return myAppointments || [];
  } catch (err) {
    console.log('err--->', err);
    toast.error(err.response.data.message);
  }
};

//My Appointments
export const getUsers = async () => {
  try {
    const resp = await axios.get(baseUrl + `user/allUsers`);
    const { success, message, users } = resp.data;
    return users || [];
  } catch (err) {
    console.log('err--->', err);
    toast.error(err.response.data.message);
  }
};

//My Appointments
export const deleteUser = async () => {
  try {
    const resp = await axios.delete(baseUrl + `user/delete`);
    const { success, message } = resp.data;
    return resp.data;
  } catch (err) {
    console.log('err--->', err);
    toast.error(err.response.data.message);
  }
};

//All Appointments
export const allAppointmentList = async () => {
  try {
    const resp = await axios.get(baseUrl + `appointment/appointments`);
    const { success, message, appointments } = resp.data;
    return appointments || [];
  } catch (err) {
    console.log('err--->', err);
    toast.error(err.response.data.message);
  }
};
// Logut User
export const logoutUser = (history) => {
  localStorage.removeItem('token');
  history.push('/auth/login');
};
