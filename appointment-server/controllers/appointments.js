const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require('../configs/constants');
const database = require('../services/database');

const auth = async (request, response) => {
  try {
    const { id } = request.user;

    // Check if token is present
    if (!id)
      return response
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(ERROR_MESSAGE.REQUIRE_TOKEN);

    if (await database.admin.getAdminById(id)) {
      return response.status(HTTP_STATUS_CODE.OK).json('verified');
    }

    return response
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .json(ERROR_MESSAGE.INVALID_TOKEN);
  } catch (error) {
    console.error('Authentication Failed: ', error);
    return response
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(ERROR_MESSAGE.AUTH_FAIL);
  }
};

const createAppointment = async (request, response) => {
  try {
    const { patientId, doctorId, notes, reason } = request.body;
    // CHECK IF DATA IS PROVIDED
    if (!patientId || !doctorId || !reason)
      return response
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(ERROR_MESSAGE.REQUIRED_PARAMETERS_MISSING);
    // Check if doctor is not exist
    const user = await database.user.getUserById(doctorId);
    if (!user)
      return response
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(ERROR_MESSAGE.DOCTOR_NOT_EXIST);
    // Check if request is already sent
    const req = await database.appointment.getExistedAppointment(
      doctorId,
      patientId
    );
    // console.log('req--->', req);
    if (req)
      return response
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(ERROR_MESSAGE.REQUEST_ALREADY_SENT);
    const requestObj = {
      doctorId,
      patientId,
      notes,
      reason,
      status: 'scheduled',
      appointmentDateTime: new Date(),
    };
    // console.log('request---->', requestObj);
    const newRequest = await database.appointment.addAppointment(requestObj);
    // SUCCESS
    return response.status(HTTP_STATUS_CODE.CREATED).json({
      success: true,
      message: 'Appointment created successfully!',
      newRequest,
    });
  } catch (error) {
    console.error('API Failed: ', error);
    return response
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
  }
};

const fetchMyAllAppointments = async (request, response) => {
  try {
    const { userId } = request.params;
    const myAppointments = await database.appointment.myAllAppointments(userId);
    return response.status(HTTP_STATUS_CODE.OK).json({
      message: 'Fetch all appointments successfully!',
      myAppointments,
    });
  } catch (error) {
    console.error('API Failed: ', error);
    return response
      .status(HTTP_STATUS_CODE.NOT_FOUND)
      .json(ERROR_MESSAGE.DATA_NOT_FOUND);
  }
};

const fetchAllAppointments = async (request, response) => {
  try {
    const appointments = await database.appointment.allAppointments();
    return response.status(HTTP_STATUS_CODE.OK).json({
      message: 'Fetch all appointments successfully!',
      appointments,
    });
  } catch (error) {
    console.error('API Failed: ', error);
    return response
      .status(HTTP_STATUS_CODE.NOT_FOUND)
      .json(ERROR_MESSAGE.DATA_NOT_FOUND);
  }
};

const updateAppointment = async (request, response) => {
  try {
    const { _id, status } = request.body;
    // CHECK IF DATA IS PROVIDED
    if (!_id || !status)
      return response
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(ERROR_MESSAGE.REQUIRED_PARAMETERS_MISSING);
    // Check if appoinrment is not exist
    const req = await database.appointment.getSingleAppointment(_id);
    if (!req)
      return response
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(ERROR_MESSAGE.APPOINTMENT_NOT_EXIST);
    const updatedRequest = await database.appointment.updateAppointment(
      _id,
      status
    );
    // if (updatedRequest && status === 'completed')
    // await database.appointment.deleteAppointment(_id);
    // SUCCESS
    return response.status(HTTP_STATUS_CODE.CREATED).json({
      success: true,
      message: `Appointment ${status} successfully!`,
      updatedRequest,
    });
  } catch (error) {
    console.error('API Failed: ', error);
    return response
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
  }
};

const getAppointmentById = async (request, response) => {
  try {
    const { appointmentId } = request.body;
    const appointment = await database.appointment.getAppointmentById(
      appointmentId
    );
    return response.status(HTTP_STATUS_CODE.OK).json({
      message: 'Fetch appointment successfully!',
      appointment,
    });
  } catch (error) {
    console.error('API Failed: ', error);
    return response
      .status(HTTP_STATUS_CODE.NOT_FOUND)
      .json(ERROR_MESSAGE.DATA_NOT_FOUND);
  }
};

module.exports = {
  getAppointmentById,
  fetchMyAllAppointments,
  createAppointment,
  updateAppointment,
  fetchAllAppointments,
  auth,
};
