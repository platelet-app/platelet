import React from 'react';
import 'typeface-roboto'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Menu extends React.Component {
    render() {
        return (
            <header>
                <nav>
                    <ul>
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/sessions'>Sessions</Link></li>
                    </ul>
                </nav>
            </header>
        )

    }
}

export default Menu;