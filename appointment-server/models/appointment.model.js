const { model, Schema } = require('mongoose');

const AppointmentSchema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    status: {
      type: String,
      enum: ['scheduled', 'cancelled', 'completed'],
      default: 'scheduled',
    },
    reason: {
      type: String,
      required: true,
    },
    appointmentDateTime: {
      type: Date,
      required: true,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

const Appointment = model('Appointment', AppointmentSchema);
module.exports = Appointment;
