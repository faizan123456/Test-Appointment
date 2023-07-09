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
  Row,
  UncontrolledTooltip,
} from 'reactstrap';
// core components
import Header from 'components/Headers/Header.js';
import { useEffect, useState } from 'react';
import { getUsers } from 'ApiServices';
import { decodedUser } from 'helpers';
import { useHistory } from 'react-router-dom';
import { deleteUser } from 'ApiServices';

const User = () => {
  const decoded = decodedUser();
  const history = useHistory();
  const currentPath = history.location.pathname;

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const usersList = async () => {
    const list = await getUsers();
    const docs = list.filter((el) => el.role === 'doctor');
    const patients = list.filter((el) => el.role === 'patient');
    setPatients(patients);
    setDoctors(docs);
  };
  useEffect(() => {
    usersList();
  }, []);

  const handleDelete = async (id) => {
    await deleteUser(id);
  };

  let users =
    currentPath === '/admin/doctors'
      ? doctors
      : currentPath === '/admin/patients'
      ? patients
      : [];

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
                <h3 className="mb-0">
                  {currentPath === '/admin/doctors'
                    ? 'Doctors'
                    : currentPath === '/admin/patients'
                    ? 'Patients'
                    : ''}
                </h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Role</th>
                    {decoded.role === 'admin' && <th scope="col">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {users &&
                    users.length > 0 &&
                    users.map((item, key) => (
                      <tr>
                        <td>{item.username}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.role}</td>
                        {decoded.role === 'admin' && (
                          <td>
                            <div
                              onClick={() => handleDelete(item._id)}
                              className="cursor-pointer"
                            >
                              {/* <button className="btn btn-danger"> */}
                              <i className="fas fa-trash text-danger text-center" />
                              {/* </button> */}
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
    </>
  );
};

export default User;
