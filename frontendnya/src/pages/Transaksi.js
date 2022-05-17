import React from "react"
import axios from "axios"
import { baseUrl, formatNumber, authorization } from "../config.js";
import domToPdf from "dom-to-pdf";
import Moment from 'react-moment';
import NavbarPage from "../components/NavbarPage.js";
import { MdDelete } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai"
import { FaFileDownload } from "react-icons/fa"
import {MdLocalLaundryService} from "react-icons/md"

export default class Transaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            transaksi: [],
            visible: "",
            user: [],
            id_outlet: "",
            outlets: []
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/auth"
        }
    }

    getData() {
        let endpoint = `${baseUrl}/transaksi`
        axios.get(endpoint, authorization)
            .then(response => {
                let dataTransaksi = response.data
                // let users = [];
                for (let i = 0; i < dataTransaksi.length; i++) {
                    let total = 0;
                    for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                        let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                        let qty = dataTransaksi[i].detail_transaksi[j].qty

                        total += (harga * qty)

                        // tambahkan key total
                        dataTransaksi[i].total = total
                    }
                    // users.push(dataTransaksi[i].user)
                }

                this.setState({ transaksi: dataTransaksi })
                // this.setState({ user: users })
                // console.log(this.state.user)
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
        this.getData()
        this.getOutlet()
        let user = JSON.parse(localStorage.getItem("user"))

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

    convertStatus(id_transaksi, status) {
        if (status === 1) {
            return (
                <div className="badge bg-gradient-info">
                    Transaksi Baru
                    <br />

                    <a onClick={() => this.changeStatus(id_transaksi, 2)} className="text-danger">
                        Click here to the next level
                    </a>
                </div>
            )
        } else if (status === 2) {
            return (
                <div className="badge bg-gradient-warning">
                    Sedang diproses

                    <br />

                    <a onClick={() => this.changeStatus(id_transaksi, 3)} className="text-danger">
                        Click here to the next level
                    </a>
                </div>
            )
        } else if (status === 3) {
            return (
                <div className="badge bg-gradient-secondary">
                    Siap Diambil

                    <br />

                    <a onClick={() => this.changeStatus(id_transaksi, 4)} className="text-danger">
                        Click here to the next level
                    </a>
                </div>
            )
        } else if (status === 4) {
            return (
                <div className="badge bg-gradient-success">
                    Telah Diambil
                </div>
            )
        }
    }

    changeStatus(id, status) {
        if (window.confirm(`Apakah Anda yakin ingin mengganti status transaksi ini?`)) {
            let endpoint = `${baseUrl}/transaksi/status/${id}`
            let data = {
                status: status
            }

            axios
                .post(endpoint, data, authorization)
                .then(response => {
                    window.alert(`Status transaksi telah diubah`)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    deleteTransaksi(id) {
        if (window.confirm(`Apakah Anda yakin ingin menghapus transaksi ini ?`)) {
            let endpoint = `${baseUrl}/transaksi/${id}`
            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
        }

    }

    convertStatusBayar(id_transaksi, dibayar) {
        if (dibayar === 0) {
            return (
                <div className="badge bg-gradient-danger text-white">
                    Belum Dibayar

                    <br />

                    <a className="text-primary"
                        onClick={() => this.changeStatusBayar(id_transaksi, 1)}>
                        Click here to change paid status
                    </a>
                </div>
            )
        } else if (dibayar === 1) {
            return (
                <div className="badge bg-gradient-success text-white">
                    Sudah Dibayar
                </div>
            )
        }
    }

    changeStatusBayar(id, status) {
        if (window.confirm(`Apakah Anda yakin ingin mengubah status pembayaran ini?`)) {
            let endpoint = `${baseUrl}/transaksi/bayar/${id}`
            axios.get(endpoint, authorization)
                .then(response => {
                    window.alert(`Status pembayaran telah diubah`)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    convertPdf() {
        // ambil element yang akan diconvert ke pdf
        let element = document.getElementById(`target`)
        let options = {
            filename: "Rincian Data Transaksi.pdf"
        }

        domToPdf(element, options, () => {
            window.alert("file will download soon")
        })
    }

    printStruk(id) {
        var element = document.getElementById(`struk${id}`);
        var options = {
            filename: `struk-${id}.pdf`
        };
        domToPdf(element, options, function (pdf) {
            window.alert(`Struk will download soon`)
        });
    }

    render() {
        const target = React.createRef()
        return (
            <div className="Section">
                <NavbarPage /><br />
                <div className="container">
                    <div className="card">
                        <div ref={target} id="target">
                            <div className="card-header">
                                <div className="card-header bg-gradient-primary">
                                    <h4 className="text-center text-white">
                                        &nbsp;<AiOutlineShoppingCart size={35} color="white" /> List of Transaksi
                                    </h4>
                                </div>
                            </div>
                            <div className="card-body">
                                <button className="btn btn-outline-success my-2"
                                    onClick={() => this.convertPdf()}>
                                    Convert to PDF
                                </button>
                                <ul className="list-group">
                                    {this.state.transaksi.map(trans => (
                                        <li className="list-group-item">
                                            <div className="row">
                                                {/* this is member area */}
                                                <div className="col-lg-2">
                                                    <small className="text-info1">
                                                        Member
                                                    </small> <br />
                                                    {trans.member.nama}
                                                </div>

                                                {/* this is outlet area */}
                                                <div className="col-lg-2">
                                                    <small className="text-info1">
                                                        Outlet
                                                    </small> <br />
                                                    {trans.user.outlet.nama}
                                                </div>

                                                {/* this is tgl transaksi area  */}
                                                <div className="col-lg-3">
                                                    <small className="text-info1">
                                                        Tanggal Transaksi
                                                    </small> <br />
                                                    <Moment format="D MMM YYYY">
                                                        {trans.tgl}
                                                    </Moment>
                                                </div>

                                                {/* this is status area  */}
                                                <div className="col-lg-3">
                                                    <small className="text-info1">
                                                        Status
                                                    </small> <br />
                                                    {this.convertStatus(trans.id_transaksi, trans.status)}
                                                </div>

                                                {/* this is action area  */}
                                                <div className="col-lg-2">
                                                    <small className="text-info1">
                                                        Action
                                                    </small><br />
                                                    <button className="btn btn-warning1 btn-sm"
                                                        onClick={() => {
                                                            // console.log(trans.user.nama)
                                                            this.printStruk(trans.id_transaksi)
                                                        }}>
                                                        <FaFileDownload size={18} color="white" />
                                                    </button>
                                                    <button className={`btn btn-sm btn-danger1 mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                        onClick={() => this.deleteTransaksi(trans.id_transaksi)}>
                                                        <MdDelete size={18} color="white" />
                                                    </button>
                                                </div>

                                                {/* this is batas waktu area  */}
                                                <div className="col-lg-2">
                                                    <small className="text-info1">
                                                        Batas Waktu
                                                    </small> <br />
                                                    <Moment format="D MMM YYYY">
                                                        {trans.batas_waktu}
                                                    </Moment>
                                                </div>

                                                <div className="col-lg-2">
                                                    <small className="text-info1">
                                                        Total
                                                    </small><br />
                                                    Rp {formatNumber(trans.total)}
                                                </div>

                                                {/* this is tanggal bayar area  */}
                                                <div className="col-lg-3">
                                                    <small className="text-info1">
                                                        Tanggal Bayar
                                                    </small> <br />
                                                    <Moment format="D MMM YYYY">
                                                        {trans.tgl_bayar}
                                                    </Moment>
                                                </div>

                                                {/* this is status pembayaran  */}
                                                <div className="col-lg-3">
                                                    <small className="text-info1">
                                                        Status Pembayaran
                                                    </small> <br />
                                                    {this.convertStatusBayar(trans.id_transaksi, trans.dibayar)}
                                                </div>

                                                {/* this is struk area */}
                                                <div style={{ display: `none` }}>
                                                    <div className="col-lg-12 p-3"
                                                        id={`struk${trans.id_transaksi}`}>
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <br />
                                                                <h1 className="text-1 text-info1 text-center">
                                                                    <MdLocalLaundryService />
                                                                    D-Laundry
                                                                </h1>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <br />
                                                                <h5 className="text-center">
                                                                    Outlet {trans.user.outlet.nama}
                                                                    <br />
                                                                    {trans.user.outlet.alamat}
                                                                    <br />
                                                                    Telp: 089761435287 | IG: @D-Laundry
                                                                </h5>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <br />
                                                                <h5>Member: {trans.member.nama}</h5>
                                                                <h5>Petugas: {trans.user.nama}</h5>
                                                                <h5>Tanggal: <Moment format="YYYY-MM-DD">{trans.tgl}</Moment></h5>
                                                            </div>
                                                        </div><br /><br />

                                                        <div className="row mt-3"
                                                            style={{ borderBottom: `1px dotted black` }}>
                                                            <div className="col-4">
                                                                <h5>Paket</h5>
                                                            </div>
                                                            <div className="col-2">
                                                                <h5>Qty</h5>
                                                            </div>
                                                            <div className="col-3">
                                                                <h5>Harga Satuan</h5>
                                                            </div>
                                                            <div className="col-3">
                                                                <h5>Total</h5>
                                                            </div>
                                                        </div>

                                                        {trans.detail_transaksi.map(item => (
                                                            <div className="row mt-3"
                                                                style={{ borderBottom: `1px dotted black` }}>
                                                                <div className="col-4">
                                                                    <h5>{item.paket.jenis_paket}</h5>
                                                                </div>
                                                                <div className="col-2">
                                                                    <h5>{item.qty}</h5>
                                                                </div>
                                                                <div className="col-3">
                                                                    <h5>Rp {formatNumber(item.paket.harga)}</h5>
                                                                </div>
                                                                <div className="col-3">
                                                                    <h5>Rp {formatNumber(item.paket.harga * item.qty)}</h5>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <div className="row mt-2">
                                                            <div className="col-lg-9"></div>
                                                            <div className="col-lg-3">
                                                                <h4>Rp {formatNumber(trans.total)}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* <div className="col-lg-3">
                                                    <small className={`text-info1 ${this.state.visible ? `` : `d-none`}`}>
                                                        Option
                                                    </small><br />
                                                    <button className={`btn btn-sm btn-danger1 ${this.state.visible ? `` : `d-none`}`}
                                                        onClick={() => this.deleteTransaksi(trans.id_transaksi)}>
                                                        <MdDelete size={18} color="white" /> Delete
                                                    </button>
                                                </div> */}
                                            </div><hr />

                                            {/* area detail transaksi */}
                                            <h5>Detail Transaksi</h5>
                                            {trans.detail_transaksi.map(detail => (
                                                <div className="row">
                                                    {/* area nama paket col-3 */}
                                                    <div className="col-lg-2">
                                                        {detail.paket.jenis_paket}
                                                    </div>
                                                    {/* area quantity col-2*/}
                                                    <div className="col-lg-2">
                                                        Qty: {detail.qty}
                                                    </div>
                                                    {/* area harga paket col-3*/}
                                                    <div className="col-lg-3">
                                                        @ Rp {formatNumber(detail.paket.harga)}
                                                    </div>
                                                    {/* area harga total col-4  */}
                                                    <div className="col-lg-4">
                                                        Rp {formatNumber(detail.paket.harga * detail.qty)}
                                                    </div>
                                                </div>
                                            ))}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}