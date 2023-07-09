const { ObjectId } = require('mongoose').Types;
const Appointment = require('../../models/Appointment.model');
const User = require('../../models/user.model');

const addAppointment = async (request) => {
  const newAppointment = new Appointment(request);
  return newAppointment.save();
};

const updateAppointment = async (Id, status) => {
  const updatedRequest = await Appointment.update(
    { _id: Id },
    { $set: { status } }
  );
  return true;
};

const deleteAppointment = async (Id) => {
  await Appointment.deleteOne({ _id: Id });
  return true;
};

const myAllAppointments = async (myId) => {
  console.log('myId', myId);
  const myAppointments = await Appointment.find({
    $or: [{ patientId: myId }, { doctorId: myId }],
  })
    .populate('patientId', { username: 1, email: 1, phone: 1, role: 1 })
    .populate('doctorId', { username: 1, email: 1, phone: 1, role: 1 });
  // console.log('myAppointments::', myAppointments);
  return myAppointments;
};

const allAppointments = async () => {
  const allAppointments = await Appointment.find()
    .populate('patientId', { username: 1, email: 1, phone: 1, role: 1 })
    .populate('doctorId', { username: 1, email: 1, phone: 1, role: 1 });
  return allAppointments;
};

const getSingleAppointment = async (Id) => {
  const getSingleRequest = await Appointment.findOne({ _id: Id })
    .populate('patientId')
    .populate('doctorId');
  return getSingleRequest;
};

const getExistedAppointment = async (doctorId, patientId) => {
  const existedAppointment = await Appointment.findOne({
    doctorId,
    patientId,
    status: 'scheduled',
  })
    .populate('doctorId')
    .populate('patientId');
  return existedAppointment;
};

module.exports = {
  addAppointment,
  updateAppointment,
  myAllAppointments,
  allAppointments,
  getSingleAppointment,
  getExistedAppointment,
  deleteAppointment,
};
