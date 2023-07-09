import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Toast,
} from 'reactstrap';
import { toast } from 'react-toastify';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { register } from 'ApiServices';
const baseUrl = process.env.REACT_APP_BASS_URL;

const Register = () => {
  // history
  const history = useHistory();
  // Set Sates
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Register User
  const registerUser = async (e) => {
    e.preventDefault();
    const userObj = {
      username,
      email,
      phone,
      password,
    };
    await register(userObj, history);
  };

  // Validate required fields
  const isSubmitDisabled = !username || !email || !password || !phone;

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <h4>Registeration</h4>
            </div>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Username"
                    name="username"
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="new-email"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-phone" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Phone"
                    name="phone"
                    onChange={(e) => setPhone(e.target.value)}
                    type="text"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </InputGroup>
              </FormGroup>
              <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        I agree with the{' '}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row>
              <div className="text-center">
                <Button
                  className="mt-4"
                  color="primary"
                  disabled={isSubmitDisabled}
                  onClick={(e) => registerUser(e)}
                  type="button"
                >
                  Create Account
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6"></Col>
          <Col className="text-right" xs="6">
            <small>Already Registered? &nbsp;</small>
            <Link className="text-light" to="/auth/login">
              <small> Login Account</small>
            </Link>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Register;
