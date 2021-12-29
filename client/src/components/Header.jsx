import React from 'react'

const Header = () => {
    const logo = require("../assets/mcIcon.png")
    return (
        <>
        <div className='headerContainer'>
            <div>
            <h1>Welcome to the Montreal Sundae Tracker !</h1>
        <img src={logo} alt="Random logo" />
            </div>
        </div>
        </>
    )
}

export default Header
