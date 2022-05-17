import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import loginIcon from "../../images/user.png";
import uiImg from "../../images/login2.jpg";
import "./LoginPage.css";
import axios from "axios";

class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
    };
  }

  loginProcess(event) {
    event.preventDefault();
    let endpoint = "http://localhost:8000/api/auth";

    let request = {
      username: this.state.username,
      password: this.state.password,
    };

    axios
      .post(endpoint, request)
      .then((result) => {
        if (result.data.logged) {
          // simpan token di local storage
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("user", JSON.stringify(result.data.user));
          // window.alert("Congratulation! You're logged")
          window.location.href = "/";
        } else {
          window.alert("Maaf, username dan password Anda salah");
        }
      })
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <div className="container mt-5">
        <Row>
          <h1 className="text-1 text-center">Welcome Back, Please Login</h1>
          <Col lg={4} md={6} sm={12} className="text-center mt-5 p-3">
            <img className="icon-img" src={loginIcon} alt="icon"></img>
            <Form onSubmit={(ev) => this.loginProcess(ev)}>
              <Form.Group className="mb-4" controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  placeholder="Enter Username"
                  required
                  value={this.state.username}
                  onChange={(ev) =>
                    this.setState({ username: ev.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  required
                  value={this.state.password}
                  onChange={(ev) =>
                    this.setState({ password: ev.target.value })
                  }
                />
              </Form.Group>

              <div class="d-grid gap-12">
                <Button variant="primary" type="submit">
                  Login
                </Button>
              </div>
            </Form>
          </Col>

          <Col lg={6} md={6} sm={11}>
            <img className="w-100" src={uiImg} alt="" />
          </Col>
        </Row>
      </div>
    );
  }
}
// const LoginPage = () => {
// };

export default LoginPage;
