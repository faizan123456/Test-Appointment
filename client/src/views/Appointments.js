import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Button,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from 'reactstrap';
// core components
import Header from 'components/Headers/Header.js';
import { useEffect, useState } from 'react';
import { myAppointmentList, allAppointmentList } from 'ApiServices';
import { decodedUser } from 'helpers';
import moment from 'moment';
import { updateStatus } from 'ApiServices';
import { makeAppointment } from 'ApiServices';
import { getUsers } from 'ApiServices';

const Appointments = () => {
  const decoded = decodedUser();

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [status, setStatus] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  const appointmentList = async (userId) => {
    let list = [];
    if (decoded.role === 'admin') {
      list = await allAppointmentList();
    } else {
      list = await myAppointmentList(userId);
    }
    setAppointments(list);
  };

  const usersList = async () => {
    const list = await getUsers();
    const docs = list.filter((el) => el.role === 'doctor');
    setDoctors(docs);
  };
  // get My Appointments
  useEffect(() => {
    appointmentList(decoded.id);
  }, [decoded.id]);

  useEffect(() => {
    usersList();
  }, []);

  const updateAppointment = async (Id) => {
    const obj = {
      _id: Id,
      status,
    };
    await updateStatus(obj);
  };

  const createAppointment = async () => {
    const obj = {
      patientId: decoded.id,
      doctorId,
      reason,
      notes,
    };
    await makeAppointment(obj);
    toggleModal();
  };

  const isSubmitDisabled = !doctorId || !reason;
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between">
                  <div>
                    <h3 className="mb-0">Appointments</h3>
                  </div>
                  <div>
                    {decoded.role !== 'patient' && (
                      <button
                        onClick={toggleModal}
                        className="btn btn-primary btn-small"
                      >
                        Create Appointment
                      </button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Doctor</th>
                    <th scope="col">Patient</th>
                    <th scope="col">Reason</th>
                    <th scope="col">Status</th>
                    <th scope="col">Appointment Date</th>
                    {decoded.role === 'admin' && <th scope="col">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {appointments &&
                    appointments.length > 0 &&
                    appointments.map((item, key) => (
                      <tr>
                        <td>{item.doctorId.username}</td>
                        <td>{item.patientId.username}</td>
                        <td>{item.reason}</td>
                        <td>
                          <Badge className="badge-dot mr-4">
                            <i
                              className={
                                item.status === 'scheduled'
                                  ? 'bg-primary'
                                  : item.status === 'completed'
                                  ? 'bg-success'
                                  : item.status === 'cancelled'
                                  ? 'bg-danger'
                                  : 'bg-dark'
                              }
                            />
                            <span className="text-dark">{item.status}</span>
                          </Badge>
                        </td>
                        <td>
                          {moment(item.appointmentDateTime).format(
                            'MMMM Do, YYYY h:mm A'
                          )}
                        </td>
                        {(decoded.role === 'admin' ||
                          decoded.role === 'doctor') && (
                          <td>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <select
                                  class="form-select form-control"
                                  aria-label="Select Option"
                                  value={item.status}
                                  onChange={(e) => setStatus(e.target.value)}
                                >
                                  <option>Select Status</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </div>
                              <div>
                                <button
                                  style={{
                                    background: 'green',
                                    border: 'none',
                                    borderRadius: 3,
                                  }}
                                  onClick={() => updateAppointment(item._id)}
                                >
                                  <i className="fas fa-check text-white" />
                                </button>
                              </div>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
      {/* Create Appointment Modal */}
      <Modal isOpen={showModal} toggle={toggleModal}>
        <ModalHeader closeButton>
          <h4>Create Appointment</h4>
        </ModalHeader>
        <ModalBody>
          <Form role="form">
            <FormGroup>
              <InputGroup className="input-group-alternative mb-3">
                <Input
                  type="select"
                  name="doctorId"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                >
                  <option value="">Select doctor</option>
                  {doctors.length &&
                    doctors.length > 0 &&
                    doctors.map((item, key) => (
                      <option value={item._id}>{item.username}</option>
                    ))}
                </Input>
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText></InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Reason"
                  name="reason"
                  onChange={(e) => setReason(e.target.value)}
                  type="text"
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText></InputGroupText>
                </InputGroupAddon>
                <textarea
                  placeholder="Notes"
                  type="textareas"
                  name="notes"
                  className="form-control"
                  onChange={(e) => setNotes(e.target.value)}
                  autoComplete="new-notes"
                />
              </InputGroup>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={toggleModal}>
            Close
          </button>
          <button className="btn btn-primary" onClick={createAppointment}>
            Create
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Appointments;
