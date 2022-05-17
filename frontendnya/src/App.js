import React from "react";
// import "./App.css";
import styled from 'styled-components';
import Member from "./pages/Member";
import Paket from "./pages/Paket";
import User from "./pages/User";
import Outlet from "./pages/Outlet";
import Transaksi from "./pages/Transaksi";
import FormTransaksi from "./pages/FormTransaksi";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage/LoginPage";
import Sidebar from "./components/Sidebar";


export default function App() {
    return (
        <Div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<><Sidebar /><Dashboard /></>} />
                    <Route path="/auth" element={<LoginPage />} />
                    <Route path="/member"
                        element={<><Sidebar /><Member /></>} />
                    <Route path="/paket"
                        element={<><Sidebar /><Paket /></>} />
                    <Route path="/user"
                        element={<><Sidebar /><User /></>} />
                    <Route path="/outlet"
                        element={<><Sidebar/><Outlet/></>}/>
                    <Route path="/transaksi"
                        element={<><Sidebar /><Transaksi /></>} />
                    <Route path="/form_transaksi"
                        element={<><Sidebar /><FormTransaksi /></>} />
                </Routes>
            </BrowserRouter>
        </Div>
    );
} 

const Div = styled.div `
position: relative;
`;
