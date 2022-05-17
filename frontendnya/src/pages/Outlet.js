import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { authorization, baseUrl } from "../config.js";
import { MdModeEditOutline } from "react-icons/md"
import { MdDelete } from "react-icons/md"
import { IoStorefrontOutline } from "react-icons/io5"
import { BiSearchAlt2 } from "react-icons/bi";
import NavbarPage from "../components/NavbarPage.js";


class Outlet extends React.Component {
    constructor() {
        super()
        this.state = {
            id_outlet: "",
            nama: "",
            alamat: "",
            action: "",
            role: "",
            visible: true,
            outlets: [],
            masterOutlets: []
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/auth"
        }
    }

    tambahData() {
        this.modalOutlet = new Modal(document.getElementById("modal_outlet"))
        this.modalOutlet.show() // menampilkan modal

        // reset state untuk form outlet
        this.setState({
            action: "tambah",
            id_outlet: Math.random(1, 10000),
            nama: "",
            alamat: "",
            tlp: "",
        })
    }

    ubahData(id_outlet) {
        this.modalOutlet = new Modal(document.getElementById("modal_outlet"))
        this.modalOutlet.show() // menampilkan modal

        // mencari index posisi dari data outlet yang akan diubah
        let index = this.state.outlets.findIndex(
            outlet => outlet.id_outlet === id_outlet
        )

        this.setState({
          action: "ubah",
          id_outlet: id_outlet,
          nama: this.state.outlets[index].nama,
          alamat: this.state.outlets[index].alamat,
          tlp: this.state.outlets[index].tlp,
        });

    }

    hapusData(id_outlet) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {

            let endpoint = `${baseUrl}/outlet/` + id_outlet

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
        if (document.getElementById("alamat").value == "") {
			alert("missing alamat");
			return;
		}
        // cek aksi tambah atau ubah
        if (this.state.action === "tambah") {
            let endpoint = `${baseUrl}/outlet`
            // menampung data isian dalam user
            let data = {
                id_outlet: this.state.id_outlet,
                nama: this.state.nama,
                alamat: this.state.alamat,
                tlp: this.state.tlp,
            }
            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            // menghilangkan modal
            this.modalOutlet.hide()
        } else if (this.state.action === "ubah") {
            let endpoint = `${baseUrl}/outlet/` +
                this.state.id_outlet

            let data = {
              id_outlet: this.state.id_outlet,
              nama: this.state.nama,
              alamat: this.state.alamat,
              tlp: this.state.tlp,
            };

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            this.modalOutlet.hide()
        }
    }


    showAddButton() {
        if (this.state === 'Admin') {
            return (
                <button type="button" className="btn btn-outline-dark"
                    onClick={() => this.tambahData()}>
                    Tambah
                </button>
            )
        }
    }
    getData() {
        let endpoint = `${baseUrl}/outlet`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ outlets: response.data })
                this.setState({ masterOutlets: response.data })
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

    searching(ev) {
        let code = ev.keyCode;
        if (code === 13) {
            let data = this.state.masterOutlets;
            let found = data.filter(it =>
                it.nama.toLowerCase().includes(this.state.search.toLowerCase()) ||
                it.alamat.toLowerCase().includes(this.state.search.toLowerCase())
                )
            this.setState({ outlets: found });
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
                      <IoStorefrontOutline size={35} color="white" /> List of
                      Outlet
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
                    {this.state.outlets.map((outlet) => (
                      <li className="list-group-item">
                        <div className="row">
                          <div className="col-lg-3">
                            <small className="text-primary">Nama</small> <br />
                            <h5>{outlet.nama}</h5>
                          </div>
                          <div className="col-lg-3">
                            <small className="text-primary">
                              Alamat <br />
                            </small>
                            <h5>{outlet.alamat}</h5>
                          </div>
                          <div className="col-lg-4">
                            <small className="text-primary">
                              Telepon <br />
                            </small>
                            <h5>{outlet.tlp}</h5>
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
                              onClick={() => this.ubahData(outlet.id_outlet)}
                            >
                              <MdModeEditOutline size={20} color="white" />
                            </button>
                            <button
                              className={`btn btn-danger1 btn-sm ${
                                this.state.visible ? `` : `d-none`
                              }`}
                              onClick={() => this.hapusData(outlet.id_outlet)}
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
                      Add Outlet
                    </button>
                  </div>
                </div>
                <div className="modal" id="modal_outlet">
                  <div className="modal-dialog modal-md">
                    <div className="modal-content">
                      <div className="modal-header bg-gradient-success">
                        <h4 className="text-white">Form Data Outlet</h4>
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
                          Telepon
                          <input
                            type="text"
                            className="form-control mb-2"
                            id="alamat"
                            value={this.state.tlp}
                            onChange={(ev) =>
                              this.setState({ tlp: ev.target.value })
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
export default Outlet