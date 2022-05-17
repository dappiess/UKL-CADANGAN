import React from "react";
// import styled from "styled-components";
import { Modal } from "bootstrap";
import axios from "axios";
import { baseUrl, formatNumber, authorization } from "../config.js";
import NavbarPage from "../components/NavbarPage.js";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { BiSearchAlt2 } from "react-icons/bi";
import { AiOutlineShopping } from "react-icons/ai"

class Paket extends React.Component {
    constructor() {
        super()
        this.state = {
            action: "",
            id_paket: "",
            jenis_paket: "",
            nama_paket:"",
            harga: "",
            user: "",
            visible: "",
            pakets: [],
            masterPacks: []
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/auth"
        }
    }

    tambahData() {
        this.modalPaket = new Modal(document.getElementById("modal_paket"))
        this.modalPaket.show() // menampilkan modal

        // reset state untuk form paket
        this.setState({
            action: "tambah",
            id_paket: Math.random(1, 1000),
            jenis_paket: "",
            nama_paket: "",
            harga: ""
        })
    }

    ubahData(id_paket) {
        this.modalPaket = new Modal(document.getElementById("modal_paket"))
        this.modalPaket.show() // menampilkan modal

        // mencari index posisi dari data paket yang akan diubah
        let index = this.state.pakets.findIndex(
            paket => paket.id_paket === id_paket
        )

        this.setState({
          action: "ubah",
          id_paket: id_paket,
          jenis_paket: this.state.pakets[index].jenis_paket,
          nama_paket: this.state.pakets[index].nama_paket,
          harga: this.state.pakets[index].harga,
        });

    }

    hapusData(id_paket) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {

            let endpoint = `${baseUrl}/paket/` + id_paket

            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            // mencari posisi index dari data yang akan dihapus
            // let temp = this.state.pakets
            // let index = temp.findIndex(paket => paket.id_paket === id_paket)

            // menghapus data pada array
            // temp.splice(index,1)

            // this.setState({pakets: temp})
        }
    }

    simpanData(event) {
        event.preventDefault();
        // preventDefault -> mencegah aksi default dari form submit

        if (document.getElementById("jenis_paket").value == "") {
			alert("missing paket");
			return;
		}
        if (document.getElementById("harga").value == "") {
			alert("missing harga");
			return;
		}

        // cek aksi tambah atau ubah
        if (this.state.action === "tambah") {
            let endpoint = `${baseUrl}/paket`
            // menampung data isian dalam user
            let data = {
                id_paket: this.state.id_paket,
                jenis_paket: this.state.jenis_paket,
                nama_paket: this.state.nama_paket,
                harga: this.state.harga
            }

            // tambahkan ke state array pakets
            // let temp = this.state.pakets
            // temp.push(data) // menambah data pada array
            // this.setState({ pakets: temp })
            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            // menghilangkan modal
            this.modalPaket.hide()
        } else if (this.state.action === "ubah") {
            let endpoint = `${baseUrl}/paket/` + this.state.id_paket

            let data = {
              id_paket: this.state.id_paket,
              jenis_paket: this.state.jenis_paket,
              nama_paket: this.state.nama_paket,
              harga: this.state.harga,
            };

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            // let temp = this.state.pakets
            // let index = temp.findIndex(
            //     paket => paket.id_paket === this.state.id_paket
            // )

            // temp[index].nama = this.state.nama
            // temp[index].alamat = this.state.alamat
            // temp[index].jenis_kelamin = this.state.jenis_kelamin
            // temp[index].telepon = this.state.telepon

            // this.setState({pakets: temp})

            this.modalPaket.hide()
        }
    }

    getData() {
        let endpoint = `${baseUrl}/paket`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ pakets: response.data })
                this.setState({ masterPacks: response.data })
            })
            .catch(error => console.log(error))
    }


    componentDidMount() {
        // fungsi ini dijalankan setelah fungsi render berjalan
        this.getData()
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

    searching(ev) {
        let code = ev.keyCode;
        if (code === 13) {
            let data = this.state.masterPacks;
            let found = data.filter(it =>
                it.jenis_paket.toLowerCase().includes(this.state.search.toLowerCase()))
            this.setState({ pakets: found });
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
                      <AiOutlineShopping size={38} color="white" /> List of
                      paket
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
                    {this.state.pakets.map((paket) => (
                      <li className="list-group-item">
                        <div className="row">
                          <div className="col-lg-3 col-md-5 col-sm-2">
                            <small className="text-primary">Jenis Paket</small>{" "}
                            <br />
                            <h5>{paket.jenis_paket}</h5>
                          </div>
                          <div className="col-lg-3 col-md-2 col-sm-3">
                            <small className="text-primary">Nama Paket</small>{" "}
                            <br />
                            <h5>{paket.nama_paket}</h5>
                          </div>
                          <div className="col-lg-4 col-md-2 col-sm-2">
                            <small className="text-primary">
                              Harga <br />
                            </small>
                            <h5>{formatNumber(paket.harga)}</h5>
                          </div>
                          <div className="col-lg-2 col-md-3 col-sm-2">
                            <small
                              className={`text-info1 ${
                                this.state.visible ? `` : `d-none`
                              }`}
                            >
                              Action <br />
                            </small>
                            <button
                              className={`btn btn-warning1 btn-sm mx-1 ${
                                this.state.visible ? `` : `d-none`
                              }`}
                              onClick={() => this.ubahData(paket.id_paket)}
                            >
                              <MdModeEditOutline size={20} color="white" />
                            </button>

                            <button
                              className={`btn btn-danger1 btn-sm ${
                                this.state.visible ? `` : `d-none`
                              }`}
                              onClick={() => this.hapusData(paket.id_paket)}
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
                      Add Paket
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal" id="modal_paket">
                <div className="modal-dialog modal-md">
                  <div className="modal-content">
                    <div className="modal-header bg-gradient-success">
                      <h4 className="text-title text-white">Form Data paket</h4>
                    </div>

                    <div className="modal-body">
                      <form onSubmit={(ev) => this.simpanData(ev)}>
                        Jenis Paket
                        <input
                          type="text"
                          className="form-control mb-2"
                          id="jenis_paket"
                          value={this.state.jenis_paket}
                          onChange={(ev) =>
                            this.setState({ jenis_paket: ev.target.value })
                          }
                        />
                        Nama Paket
                        <input
                          type="text"
                          className="form-control mb-2"
                          id="jenis_paket"
                          value={this.state.nama_paket}
                          onChange={(ev) =>
                            this.setState({ nama_paket: ev.target.value })
                          }
                        />
                        Harga
                        <input
                          type="text"
                          className="form-control mb-2"
                          id="harga"
                          value={this.state.harga}
                          onChange={(ev) =>
                            this.setState({ harga: ev.target.value })
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
        );
    }
}
export default Paket