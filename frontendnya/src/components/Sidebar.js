import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AiOutlineAppstore } from "react-icons/ai";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { AiOutlineShopping } from "react-icons/ai";
import { AiOutlineLogout } from "react-icons/ai";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { AiOutlineAudit } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { IoStorefrontOutline } from "react-icons/io5";
import { MdLocalLaundryService } from "react-icons/md";

function Logout() {
  // remove data token dan user dari local storage
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

export default function Sidebar() {
  const [currentLink, setCurrentLink] = useState(1);
  return (
    <div>
      <Section>
        <div className="top">
          <div className="brand">
            <MdLocalLaundryService />
            <span>D-Laundry</span>
          </div>
          <div className="links">
            <ul>
              <li
                className={currentLink === 1 ? "active" : "none"}
                onClick={() => setCurrentLink(1)}
              >
                <Link to="/">
                  <AiOutlineAppstore />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li
                className={currentLink === 2 ? "active" : "none"}
                onClick={() => setCurrentLink(2)}
              >
                <Link to="/member">
                  <AiOutlineAudit />
                  <span>Member</span>
                </Link>
              </li>
              <li
                className={currentLink === 3 ? "active" : "none"}
                onClick={() => setCurrentLink(3)}
              >
                <Link to="/paket">
                  <AiOutlineShopping />
                  <span>Paket</span>
                </Link>
              </li>
              <li
                className={currentLink === 4 ? "active" : "none"}
                onClick={() => setCurrentLink(4)}
              >
                <Link to="/user">
                  <AiOutlineUsergroupAdd />
                  <span>User</span>
                </Link>
              </li>
              <li
                className={currentLink === 5 ? "active" : "none"}
                onClick={() => setCurrentLink(5)}
              >
                <Link to="/outlet">
                  <IoStorefrontOutline />
                  <span>Outlet</span>
                </Link>
              </li>
              <li
                className={currentLink === 6 ? "active" : "none"}
                onClick={() => setCurrentLink(6)}
              >
                <Link to="/transaksi">
                  <AiOutlineShoppingCart />
                  <span>Transaksi</span>
                </Link>
              </li>
              <li
                className={currentLink === 7 ? "active" : "none"}
                onClick={() => setCurrentLink(7)}
              >
                <Link to="/form_transaksi">
                  <BiEdit />
                  <span>Tambah Transaksi</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="logout">
          <Link to="/auth" onClick={() => Logout()}>
            <AiOutlineLogout />
            <span>Logout</span>
          </Link>
        </div>
      </Section>
    </div>
  );
}

const Section = styled.section`
  position: fixed;
  left: 0;
  background-color: #f8f9ef;
  height: 100vh;
  width: 18vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 0;
  gap: 2rem;

  .top {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    .brand {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.3rem 0;
      svg {
        color: #0b3574;
        font-size: 4rem;
      }
      span {
        font-size: 1.5rem;
        font-weight: bold;
        font-family: "Pacifico", cursive;
        color: black;

        @media only screen and (max-width: 768px) {
          font-size: 1rem;
        }

        @media only screen and (max-width: 425px) {
          font-size: 0.8rem;
        }
      }
    }
    .links {
      width: 100%;
      display: flex;
      justify-content: center;
      ul {
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        li {
          padding: 0.6rem 2rem;
          border-radius: 0.3rem;
          &:hover {
            background-color: #4889e9;
            a {
              color: white;
            }
          }
          a {
            text-decoration: none;
            display: flex;
            gap: 1rem;
            color: grey;
            svg {
              font-size: 1.4rem;

              @media only screen and (max-width: 425px) {
                font-size: 1rem;
              }
            }
            span {
              display: flex;
              gap: 2rem;

              @media only screen and (max-width: 768px) {
                display: none;
              }
            }
          }
        }
        .active {
          background-color: #4889e9;
          a {
            color: white;
          }
        }
      }
    }
  }
  .logout {
    padding: 0.6rem 3rem;
    margin-left: -2rem;
    @media only screen and (max-width: 425px) {
      margin-left: 1rem;
    }
    a {
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: black;
      gap: 1rem;
      @media only screen and (max-width: 425px) {
        gap: 0.2rem;
      }
      svg {
        font-size: 1.4rem;

        @media only screen and (max-width: 425px) {
          font-size: 0.8rem;
        }
      }
      span {
        display: flex;

        @media only screen and (max-width: 425px) {
          font-size: 0.8rem;
        }
      }
    }
  }
`;
