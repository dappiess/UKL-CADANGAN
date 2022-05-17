import React from "react"
import axios from "axios"
import { baseUrl, formatNumber, authorization } from "../config"
import styled from "styled-components"
import NavbarPage from "../components/NavbarPage"
import circleImg from "../images/circle.png"
import { AiOutlineAudit } from "react-icons/ai"
import { AiOutlineShopping } from "react-icons/ai"
import { AiOutlineShoppingCart } from "react-icons/ai"
import {AiOutlineUsergroupAdd} from "react-icons/ai"
import {AiOutlineDollar} from "react-icons/ai"
import { IoStorefrontOutline } from "react-icons/io5"

export default class Dashboard extends React.Component {
    constructor() {
        super()

        this.state = {
            jmlMember: 0,
            jmlPaket: 0,
            jmlUser: 0,
            jmlOutlet: 0,
            jmlTransaksi: 0

        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/auth"
        }
    }

    getSumary() {

        // get jumlah member
        let endpoint = `${baseUrl}/member`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ jmlMember: response.data.length })
            })
            .catch(error => console.log(error))

        // get jumlah paket
        endpoint = `${baseUrl}/paket`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ jmlPaket: response.data.length })
            })
            .catch(error => console.log(error))

        // get jumlah user
        endpoint = `${baseUrl}/users`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ jmlUser: response.data.length })
            })
            .catch(error => console.log(error))

        // get jumlah user
        endpoint = `${baseUrl}/outlet`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ jmlOutlet: response.data.length })
            })
            .catch(error => console.log(error))

        // get jumlah transaksi
        endpoint = `${baseUrl}/transaksi`
        axios.get(endpoint, authorization)
            .then(response => {
                let dataTransaksi = response.data
                let income = 0
                for (let i = 0; i < dataTransaksi.length; i++) {
                    let total = 0;
                    for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                        let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                        let qty = dataTransaksi[i].detail_transaksi[j].qty

                        total += (harga * qty)
                    }

                    income += total
                }

                this.setState({
                    jmlTransaksi: response.data.length,
                    income: income
                })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getSumary()
    }

    render() {
        return (
            <Section>
                <NavbarPage /> <br />
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 stretch-card grid-margin">
                            <div className="card bg-gradient-danger card-img-holder text-white">
                                <div className="card-body-1">
                                    <img src={circleImg} alt="circle-image" className="card-img-absolute"></img>
                                    <h4 className="card-title mb-3">Jumlah Member
                                        <AiOutlineAudit className="icon-dashboard" />
                                    </h4>
                                    <h2 className="mb-3">Total: {this.state.jmlMember}</h2>
                                    <h6>Member yang terdaftar</h6>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 stretch-card grid-margin">
                            <div className="card bg-gradient-warning card-img-holder text-white">
                                <div className="card-body-1">
                                    <img src={circleImg} alt="circle-image" className="card-img-absolute"></img>
                                    <h4 className="card-title mb-3">Jumlah Paket
                                        <AiOutlineShopping className="icon-dashboard" />
                                    </h4>
                                    <h2 className="mb-3">Total: {this.state.jmlPaket}</h2>
                                    <h6>Paket yang tersedia</h6>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 stretch-card grid-margin">
                            <div className="card bg-gradient-success card-img-holder text-white">
                                <div className="card-body-1">
                                    <img src={circleImg} alt="circle-image" className="card-img-absolute"></img>
                                    <h4 className="card-title mb-3">Jumlah User
                                        <AiOutlineUsergroupAdd className="icon-dashboard" /></h4>
                                    <h2 className="mb-3">Total: {this.state.jmlUser}</h2>
                                    <h6>User saat ini</h6>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 stretch-card grid-margin">
                            <div className="card bg-gradient-info card-img-holder text-white">
                                <div className="card-body-1">
                                    <img src={circleImg} alt="circle-image" className="card-img-absolute"></img>
                                    <h4 className="card-title mb-3">Jumlah Outlet
                                        <IoStorefrontOutline className="icon-dashboard" /></h4>
                                    <h2 className="mb-3">Total: {this.state.jmlOutlet}</h2>
                                    <h6>Outlet cabang D-Laundry</h6>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 stretch-card grid-margin">
                            <div className="card bg-gradient-primary card-img-holder text-white">
                                <div className="card-body-1">
                                    <img src={circleImg} alt="circle-image" className="card-img-absolute"></img>
                                    <h4 className="card-title mb-3">Jumlah Transaksi
                                        <AiOutlineShoppingCart className="icon-dashboard" /></h4>
                                    <h2 className="mb-3">Total: {this.state.jmlTransaksi}</h2>
                                    <h6>Transaksi yang dilayani</h6>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 stretch-card grid-margin">
                            <div className="card bg-gradient-secondary card-img-holder text-white">
                                <div className="card-body-1">
                                    <img src={circleImg} alt="circle-image" className="card-img-absolute"></img>
                                    <h4 className="card-title mb-3">Pendapatan
                                    <AiOutlineDollar className="icon-dashboard" />
                                    </h4>
                                    <h2 className="mb-3">Total: Rp {formatNumber(this.state.income)}</h2>
                                    <h6>Total pendapatan</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        )
    }
}

const Section = styled.section`
margin-left: 18vw;
padding: 2rem;
height: 100%;
`;