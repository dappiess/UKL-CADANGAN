import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AiOutlineCalendar } from "react-icons/ai";
import avatarImage from "../images/avatar.png";

export default function NavbarPage() {
    const [dateState, setDateState] = useState(new Date());
    useEffect(() => {
        setInterval(() => setDateState(new Date()), 30000);
    }, []);
    let user = JSON.parse(localStorage.getItem('user'))
    return (
        <Nav>
            <div className="title">
                <h2>Hai {user.role}, {user.nama} !!!</h2>
            </div>
            <div className="notification">
                <div className="date">
                    <AiOutlineCalendar />
                    <span>
                        {' '}
                        {dateState.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        })}
                    </span>
                </div>
                <div className="icon">
                    <div className="image">
                        <img src={avatarImage} alt="" />
                    </div>
                </div>
            </div>
        </Nav>
    )
}

const Nav = styled.nav`
display: flex;
justify-content: space-between;
color: white;
.title {
    h2{
        margin-left: 0.5rem;
        color: black;
        font-weight: bold;
        margin-top: 0.5rem;
    }
}
.notification {
    display: flex;
    align-items: center;
    margin-top: -10px;
    .date {
        background-color: #f8f9fe;
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-radius: 1rem;
        svg {
            color: black;
        }
        span {
            color: black;
        }
    }
    .icon {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        svg {
            color: black;
        }
        span {
            color: black;
        }
        .image {
            display: flex;
            gap: 1rem;
            img{
                height: 2.5rem;
                width: 2.5rem;
                border-radius: 3rem;
            }
        }
    }
}
`;