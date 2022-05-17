import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { authorization, baseUrl } from "../config.js";
import NavbarPage from "../components/NavbarPage.js";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { BiSearchAlt2 } from "react-icons/bi";
import {AiOutlineAudit} from "react-icons/ai"

class Member extends React.Component {
    constructor() {
        super()
        this.state = {
            id_member: "",
            nama: "",
            alamat: "",
            jenis_kelamin: "",
            telepon: "",
            action: "",
            role: "",
            visible: true,
            members: [],
            masterMembers: []
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/auth"
        }
    }

    tambahData() {
        this.modalMember = new Modal(document.getElementById("modal_member"))
        this.modalMember.show() // menampilkan modal

        // reset state untuk form member
        this.setState({
            action: "tambah",
            id_member: Math.random(1, 10000),
            nama: "",
            alamat: "",
            jenis_kelamin: "Wanita",
            telepon: ""
        })
    }

    ubahData(id_member) {
        this.modalMember = new Modal(document.getElementById("modal_member"))
        this.modalMember.show() // menampilkan modal

        // mencari index posisi dari data member yang akan diubah
        let index = this.state.members.findIndex(
            member => member.id_member === id_member
        )

        this.setState({
            action: "ubah",
            id_member: id_member,
            nama: this.state.members[index].nama,
            alamat: this.state.members[index].alamat,
            jenis_kelamin: this.state.members[index].jenis_kelamin,
            telepon: this.state.members[index].telepon
        })

    }

    hapusData(id_member) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {

            let endpoint = `${baseUrl}/member/` + id_member

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
        if (document.getElementById("jenis_kelamin").value == "") {
			alert("missing jenis kelamin");
			return;
		}
        if (document.getElementById("telp").value == "") {
			alert("missing telepon");
			return;
		}
        if (document.getElementById("alamat").value == "") {
			alert("missing alamat");
			return;
		}

        // cek aksi tambah atau ubah
        if (this.state.action === "tambah") {
            let endpoint = `${baseUrl}/member`
            // menampung data isian dalam user
            let data = {
                id_member: this.state.id_member,
                nama: this.state.nama,
                alamat: this.state.alamat,
                jenis_kelamin: this.state.jenis_kelamin,
                telepon: this.state.telepon
            }

            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            // menghilangkan modal
            this.modalMember.hide()
        } else if (this.state.action === "ubah") {
            let endpoint = `${baseUrl}/member/` +
                this.state.id_member

            let data = {
                id_member: this.state.id_member,
                nama: this.state.nama,
                alamat: this.state.alamat,
                jenis_kelamin: this.state.jenis_kelamin,
                telepon: this.state.telepon
            }

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            this.modalMember.hide()
        }
    }


    showAddButton() {
        if (this.state === 'Admin' || this.state.role === 'Kasir') {
            return (
                <button type="button" className="btn btn-outline-dark"
                    onClick={() => this.tambahData()}>
                    Tambah
                </button>
            )
        }
    }

    getData() {
        let endpoint = `${baseUrl}/member`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ members: response.data })
                this.setState({ masterMembers: response.data })
            })
            .catch(error => console.log(error))
    }


    componentDidMount() {
        // fungsi ini dijalankan setelah fungsi render berjalan
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))

        // cara pertama
        this.setState({
            role: user.role
        })
        // cara kedua
        if (user.role === 'Admin' || user.role === 'Kasir') {
            this.setState({
                visible: true
            })
        } else {
            this.setState({
                visible: false
            })
        }
    }

    searching(ev) {
        let code = ev.keyCode;
        if (code === 13) {
            let data = this.state.masterMembers;
            let found = data.filter(it =>
                it.nama.toLowerCase().includes(this.state.search.toLowerCase()))
            this.setState({ members: found });
        }
    }

    render() {
        return (
          <div className="Section">
            <NavbarPage /> <br />
            <div className="container">
              <div className="card">
                <div className="card-header">
                  <div className="card-header bg-gradient-primary">
                    <h3 className="text-center text-white">
                      &nbsp;
                      <AiOutlineAudit size={35} color="white" /> List of Member
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
                    {this.state.members.map((member) => (
                      <li className="list-group-item">
                        <div className="row">
                          <div className="col-lg-2 col-md-2 col-sm-4">
                            <small className="text-primary">Nama</small> <br />
                            <h5>{member.nama}</h5>
                          </div>
                          <div className="col-lg-2 col-md-2 col-sm-4">
                            <small className="text-primary">
                              Gender <br />
                            </small>
                            <h5>{member.jenis_kelamin}</h5>
                          </div>
                          <div className="col-lg-3 col-md-2 col-sm-4">
                            <small className="text-primary">
                              Telepon <br />
                            </small>
                            <h5>{member.telepon}</h5>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-4">
                            <small className="text-primary">
                              Alamat <br />
                            </small>
                            <h5>{member.alamat}</h5>
                          </div>
                          <div className="col-lg-2 col-md-3 col-sm-2">
                            <small
                              className={`text-primary ${
                                this.state.visible ? `` : `d-none`
                              }`}
                            >
                              Action <br />
                            </small>
                            <button
                              className={`btn btn-warning1 btn-sm mx-2${
                                this.state.visible ? `` : `d-none`
                              }`}
                              onClick={() => this.ubahData(member.id_member)}
                            >
                              <MdModeEditOutline size={24} color="white" />
                            </button>

                            <button
                              className={`btn btn-danger1 btn-sm mx-2 ${
                                this.state.visible ? `` : `d-none`
                              }`}
                              onClick={() => this.hapusData(member.id_member)}
                            >
                              <MdDelete size={24} color="white" />
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
                      Add Member
                    </button>
                  </div>
                </div>
                <div className="modal modal-fade fade" id="modal_member">
                  <div className="modal-dialog modal-md">
                    <div className="modal-content">
                      <div className="modal-header bg-gradient-success">
                        <h4 className="text-title text-white text-center">
                          Form Data Member
                        </h4>
                      </div>

                      <div className="modal-body">
                        <form onSubmit={(ev) => this.simpanData(ev)}>
                          Nama
                          <input
                            required
                            type="text"
                            className="form-control mb-2"
                            id="nama"
                            value={this.state.nama}
                            onChange={(ev) =>
                              this.setState({ nama: ev.target.value })
                            }
                          />
                          Jenis Kelamin
                          <select
                            className="form-control mb-2"
                            id="jenis_kelamin"
                            value={this.state.jenis_kelamin}
                            onChange={(ev) =>
                              this.setState({ jenis_kelamin: ev.target.value })
                            }
                          >
                            <option value="Wanita">Wanita</option>
                            <option value="Pria">Pria</option>
                          </select>
                          Telepon
                          <input
                            type="text"
                            className="form-control mb-2"
                            id="telp"
                            value={this.state.telepon}
                            onChange={(ev) =>
                              this.setState({ telepon: ev.target.value })
                            }
                          />
                          Alamat
                          <input
                            type="text"
                            className="form-control mb-2"
                            id="alamat"
                            value={this.state.alamat}
                            onChange={(ev) =>
                              this.setState({ alamat: ev.target.value })
                            }
                          />
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
export default Member
