import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { baseUrl, authorization } from "../config.js";

import NavbarPage from "../components/NavbarPage.js";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { BiSearchAlt2 } from "react-icons/bi";
import {AiOutlineUsergroupAdd} from "react-icons/ai"

export default class User extends React.Component {
    constructor() {
        super()
        this.state = {
            id_user: "",
            nama: "",
            username: "",
            password: "",
            role: "",
            id_outlet: "",
            action: "",
            users: [],
            outlets: [],
            
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/auth"
        }
    }

    tambahData() {
        this.modalUser = new Modal(document.getElementById("modal_user"))
        this.modalUser.show() // menampilkan modal

        // reset state untuk form user
        this.setState({
            action: "tambah",
            id_user: Math.random(1, 1000),
            nama: "",
            username: "",
            password: "",
            role: "Admin",
            id_outlet: "",
            fillPassword: true
        })
    }

    ubahData(id_user) {
        this.modalUser = new Modal(document.getElementById("modal_user"))
        this.modalUser.show() // menampilkan modal

        // mencari index posisi dari data user yang akan diubah
        let index = this.state.users.findIndex(
            user => user.id_user === id_user
        )

        this.setState({
            action: "ubah",
            id_user: id_user,
            nama: this.state.users[index].nama,
            username: this.state.users[index].username,
            password: "",
            role: this.state.users[index].role,
            id_outlet: this.state.users[index].id_outlet,
            fillPassword: false
        })

    }

    hapusData(id_user) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {

            let endpoint = `${baseUrl}/user/` + id_user

            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            
        }
    }

    simpanData(event) {
        event.preventDefault();
        // preventDefault -> mencegah aksi default dari form submit

        if (document.getElementById("nama").value == "") {
			alert("missing nama");
			return;
		}
        if (document.getElementById("username").value == "") {
			alert("missing username");
			return;
		}
        if (document.getElementById("role").value == "") {
			alert("missing role");
			return;
		}
        if (document.getElementById("outlet").value == "") {
			alert("missing outlet");
			return;
		}

        // cek aksi tambah atau ubah
        if (this.state.action === "tambah") {
            let endpoint = `${baseUrl}/user`
            // menampung data isian dalam user
            let data = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role,
                id_outlet: this.state.id_outlet
            }

            
            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            // menghilangkan modal
            this.modalUser.hide()
        } else if (this.state.action === "ubah") {
            let endpoint = `${baseUrl}/user/` + this.state.id_user

            let data = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                role: this.state.role,
                id_outlet: this.state.id_outlet
            }

            if (this.state.fillPassword === true) {
                data.password = this.state.password
            }

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            

            this.modalUser.hide()
        }
    }

    getData() {
        let endpoint = `${baseUrl}/user`
        axios
            .get(endpoint, authorization)
            .then(response => {
                this.setState({ users: response.data })
            })
            .catch(error => console.log(error))
    }

    getOutlet() {
        let endpoint = `${baseUrl}/outlet`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ outlets: response.data })
            })
            .catch(error => console.log(error))
    }


    componentDidMount() {
        // fungsi ini dijalankan setelah fungsi render berjalan
        this.getData()
        this.getOutlet()
        let user = JSON.parse(localStorage.getItem("user"))

        // cara kedua
        if (user.role === 'Admin') {
            this.setState({
                visible: true
            })
        } else {
            this.setState({
                visible: false
            })
        }
    }

    showPassword() {
        if (this.state.fillPassword === true) {
            return (
                <div>
                    Password
                    <input type="password" className="form-control mb-1"
                        required
                        value={this.state.password}
                        onChange={ev => this.setState({ password: ev.target.value })} />
                </div>
            )
        } else {
            return (
                <button className="mb-1 btn btn-warning"
                    onClick={() => this.setState({ fillPassword: true })}>
                    Change Password
                </button>
            )
        }
    }

    searching(ev) {
        let code = ev.keyCode;
        if (code === 13) {
            let data = this.state.masterUsers;
            let found = data.filter(it =>
                it.nama.toLowerCase().includes(this.state.search.toLowerCase()) ||
                it.username.toLowerCase().includes(this.state.search.toLowerCase()) ||
                it.role.toLowerCase().includes(this.state.search.toLowerCase())
                )
            this.setState({ users: found });
        }
    }

    render() {
        return (
          <div className="Section">
            <NavbarPage />
            <br />
            <div className="container">
              <div className="card">
                <div className="card-header">
                  <div className="card-header bg-gradient-primary">
                    <h3 className="text-center text-white">
                      &nbsp;
                      <AiOutlineUsergroupAdd size={40} color="white" /> List of
                      User
                    </h3>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="row">
                      <div className="col-sm-5 my-2 mx-6">
                        <div class="d-flex">
                          <BiSearchAlt2
                            style={{
                              marginLeft: "12rem",
                              marginRight: "-2rem",
                              marginTop: "0.6rem",
                              position: "absolute",
                            }}
                            color="#808080"
                            size="1.4rem"
                          />
                          <input
                            class="form-control mb-4 px-5"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={this.state.search}
                            onChange={(ev) =>
                              this.setState({ search: ev.target.value })
                            }
                            onKeyUp={(ev) => this.searching(ev)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <ul className="list-group">
                    {this.state.users.map((user) => (
                      <li className="list-group-item">
                        <div className="row">
                          <div className="col-lg-3">
                            <small className="text-primary"> Nama </small> <br />
                            <h5>{user.nama}</h5>
                          </div>
                          <div className="col-lg-3">
                            <small className="text-primary">
                              {" "}
                              Username <br />
                            </small>
                            <h5>{user.username}</h5>
                          </div>
                          <div className="col-lg-2">
                            <small className="text-primary">
                              {" "}
                              Role <br />
                            </small>
                            <h5>{user.role}</h5>
                          </div>
                          <div className="col-lg-2">
                            <small className="text-primary">
                              {" "}
                              Outlet <br />
                            </small>
                            <h5>{user.outlet.nama}</h5>
                          </div>
                          <div className="col-lg-2">
                            <small
                              className={`text-primary ${
                                this.state.visible ? `` : `d-none`
                              }`}
                            >
                              Action <br />
                            </small>
                            <button
                              className={`btn btn-warning1 btn-sm mx-1 ${
                                this.state.visible ? `` : `d-none`
                              }`}
                              onClick={() => this.ubahData(user.id_user)}
                            >
                              <MdModeEditOutline size={20} color="white" />
                            </button>

                            <button
                              className={`btn btn-danger1 btn-sm ${
                                this.state.visible ? `` : `d-none`
                              }`}
                              onClick={() => this.hapusData(user.id_user)}
                            >
                              <MdDelete size={20} color="white" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="text-center">
                    <button
                      className={`btn btn-outline-success my-2 ${
                        this.state.visible ? `` : `d-none`
                      }`}
                      onClick={() => this.tambahData()}
                    >
                      Add User
                    </button>
                  </div>
                </div>
                <div className="modal" id="modal_user">
                  <div className="modal-dialog modal-md">
                    <div className="modal-content">
                      <div className="modal-header bg-gradient-success">
                        <h4 className="text-title text-white">
                          Form Data User
                        </h4>
                      </div>

                      <div className="modal-body">
                        <form onSubmit={(ev) => this.simpanData(ev)}>
                          Nama
                          <input
                            type="text"
                            className="form-control mb-2"
                            id="nama"
                            value={this.state.nama}
                            onChange={(ev) =>
                              this.setState({ nama: ev.target.value })
                            }
                          />
                          Username
                          <input
                            type="text"
                            className="form-control mb-2"
                            id="username"
                            value={this.state.username}
                            onChange={(ev) =>
                              this.setState({ username: ev.target.value })
                            }
                          />
                          {this.showPassword()}
                          <br />
                          Role
                          <select
                            className="form-control mb-2"
                            id="role"
                            value={this.state.role}
                            onChange={(ev) =>
                              this.setState({ role: ev.target.value })
                            }
                          >
                            <option value="Kasir">Kasir</option>
                            <option value="Admin">Admin</option>
                            <option value="Owner">Owner</option>
                          </select>
                          Outlet
                          <select
                            className="form-control mb-2"
                            id="outlet"
                            value={this.state.id_outlet}
                            onChange={(ev) =>
                              this.setState({ id_outlet: ev.target.value })
                            }
                          >
                            <option value="">--Pilih Outlet--</option>
                            {this.state.outlets.map((outlet) => (
                              <option value={outlet.id_outlet}>
                                {outlet.nama}
                              </option>
                            ))}
                          </select>
                          <button className="btn btn-success" type="submit">
                            Simpan
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}
