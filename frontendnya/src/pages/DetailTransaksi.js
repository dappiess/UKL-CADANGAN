import React, { Component } from "react";
import axios from "axios";
import domToPdf from "dom-to-pdf";
import { formatNumber, baseUrl, authorization } from "../config.js";

export default class DetailTransaksi extends React.Component {
  constructor() {
    super();
    this.state = {
      transaksi: {},
      isLoading: true,
    };
    if (!localStorage.getItem("token")) {
      window.location.href = "/auth";
    }
  }

  changeBayar(id) {
    if (
      window.confirm("Apakah anda yakin ingin mengganti status pembayaran ini?")
    ) {
      let endpoint = `${baseUrl}/transaksi/bayar/${id}`;
      axios
        .get(endpoint, authorization)
        .then((response) => {
          window.alert(`Pembayaran Transaksi Telah Diubah`);
          this.getData();
        })
        .catch((error) => console.log(error));
    }
  }

  changeStatus(id, status) {
    if (
      window.confirm("Apakah anda yakin ingin mengganti status transaksi ini?")
    ) {
      let endpoint = `${baseUrl}/transaksi/status/${id}`;

      let data = {
        status: status,
      };

      axios
        .post(endpoint, data, authorization)
        .then((response) => {
          window.alert(`Status Transaksi Telah Diubah`);
          this.getData();
        })
        .catch((error) => console.log(error));
    }
  }

  convertToPdf() {
    let element = document.getElementById(`target`);
    let options = {
      filename: `laporan_${this.getParams()}.pdf`,
      overrideWidth: 800,
    };

    domToPdf(element, options, () => {
      window.alert("Dokumen akan dicetak");
    });
  }

  convertStatus(id_transaksi, status) {
    if (status === 1) {
      return (
        <div className="d-flex justify-content-between">
          <div>
            <h6>Status Proses</h6>
            <h6 className="text-info">Transaksi baru</h6>
          </div>
          <button
            className="btn btn-md btn-primary"
            onClick={() => this.changeStatus(id_transaksi, 2)}
          >
            Update Status
          </button>
        </div>
      );
    } else if (status === 2) {
      return (
        <div className="d-flex justify-content-between">
          <div>
            <h6>Status Proses</h6>
            <h6 className="text-warning">Sedang Di Proses</h6>
          </div>
          <button
            className="btn btn-md btn-primary"
            onClick={() => this.changeStatus(id_transaksi, 3)}
          >
            Update Status
          </button>
        </div>
      );
    } else if (status === 3) {
      return (
        <div className="d-flex justify-content-between">
          <div>
            <h6>Status Proses</h6>
            <h6 className="text-success">Siap Di Ambil</h6>
          </div>
          <button
            className="btn btn-md btn-primary"
            onClick={() => this.changeStatus(id_transaksi, 4)}
          >
            Update Status
          </button>
        </div>
      );
    } else if (status === 4) {
      return (
        <>
          <h6>Status Proses</h6>
          <h6 className="text-success">Sudah Diambil</h6>
        </>
      );
    }
  }

  convertBayar(id_transaksi, status) {
    if (status === 0) {
      return (
        <div className="d-flex justify-content-between">
          <div>
            <h6>Status Pembayaran</h6>
            <h6 className="text-danger">Belum Dibayar</h6>
          </div>
          <button
            className="btn btn-md btn-success"
            onClick={() => this.changeBayar(id_transaksi)}
          >
            $ Terbayar $
          </button>
        </div>
      );
    } else if (status === 1) {
      return (
        <>
          <h6>Status Pembayaran</h6>
          <h6 className="text-success">Sudah Dibayar</h6>
        </>
      );
    }
  }

  getData() {
    let endpoint = `${baseUrl}/transaksi/${this.getParams()}`;
    axios
      .get(endpoint, authorization)
      .then((response) => {
        let dataTransaksi = response.data;
        let total = 0;
        for (let j = 0; j < dataTransaksi.detail_transaksi.length; j++) {
          let harga = dataTransaksi.detail_transaksi[j].paket.harga;
          let qty = dataTransaksi.detail_transaksi[j].qty;
          total += harga * qty;
        }
        dataTransaksi.total = total;
        this.setState({ transaksi: dataTransaksi });
      })
      .catch((error) => console.log(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  getParams() {
    let baseUrl = window.location.href;
    var id = baseUrl.substring(baseUrl.lastIndexOf("/") + 1);
    return id;
  }

  printStruk(trans) {
    const target = React.createRef();

    return (
      <div style={{ display: "none" }}>
        <div ref={target} id="target">
          <div className="col-lg-12 p-3" id={`struk${trans.id_transaksi}`}>
            <h3 className="text-center text-info">Dji's Laundry</h3>
            <h5 className="text-center">
              Jl. Sudimoro No.1, Mojolangu, Malang
              <br />
              Telp. 0341-6969-8484 | IG: @Dji_
            </h5>

            <h4 className="text-dark">Member: {trans.member.nama}</h4>
            <h4 className="text-dark" ss>
              Tgl: {trans.tgl}
            </h4>

            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nama Paket</th>
                  <th scope="col">Harga Paket</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                {trans.detail_transaksi.map((detail, index) => (
                  <>
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{detail.paket.jenis_paket}</td>
                      <td>{detail.paket.harga}</td>
                      <td>{detail.qty}</td>
                      <td>
                        Rp {formatNumber(detail.paket.harga * detail.qty)}
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
            <div className="row mt-2">
              <div className="col-lg-9"></div>
              <div className="col-lg-3">
                <h4> Total: Rp {trans.total} </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const { transaksi, isLoading } = this.state;

    if (isLoading) {
      return (
        <div
          class="spinner-border text-primary position-absolute top-50 start-50 translate-middle"
          role="status"
        ></div>
      );
    } else {
      return (
        <div className="container">
          {this.printStruk(transaksi)}
          <br />
          <div className="card">
            <div className="card-body">
              <div className=" d-flex justify-content-between">
                <h4 className="card-title">
                  Transaksi Id: {transaksi.id_transaksi}
                </h4>
                <div className="">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      this.convertToPdf();
                    }}
                  >
                    Cetak
                  </button>
                </div>
              </div>
              <br />
              <div className="row d-flex  justify-content-between">
                <div className="text-white col-lg-4">
                  <h6>Nama Member</h6>
                  {transaksi.member.nama}
                  <br /> <br />
                  <h6>Tanggal Transaksi</h6>
                  {transaksi.tgl}
                  <br /> <br />
                  <h6>Batas Waktu</h6>
                  {transaksi.batas_waktu}
                  <br /> <br />
                  <h6>Tanggal Bayar</h6>
                  {transaksi.tgl_bayar}
                  <br /> <br />
                  {this.convertBayar(transaksi.id_transaksi, transaksi.dibayar)}
                  <br />
                  {this.convertStatus(transaksi.id_transaksi, transaksi.status)}
                  <br />
                  <h6>Petugas</h6>
                  {transaksi.user.username}
                  <br /> <br />
                  <h6>Total</h6>
                  <h4>Rp {formatNumber(transaksi.total)}</h4>
                </div>
                <div className="text-white col-lg-8">
                  <h2>Detail Transaksi</h2>
                  <br />
                  <table class="table">
                    <thead>
                      <tr>
                        <th className="text-white col">#</th>
                        <th className="text-white col">Nama Paket</th>
                        <th className="text-white col">Harga Paket</th>
                        <th className="text-white col">Qty</th>
                        <th className="text-white col">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaksi.detail_transaksi.map((detail, index) => (
                        <>
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{detail.paket.jenis_paket}</td>
                            <td>{detail.paket.harga}</td>
                            <td>{detail.qty}</td>
                            <td>
                              Rp {formatNumber(detail.paket.harga * detail.qty)}
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}