import React from "react"
import ReactDOM from "react-dom"
import { Button, Modal, } from "semantic-ui-react"
import 'semantic-ui-css/semantic.min.css'
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isToggleOn: true, date: new Date() };
        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);///binding only for functions
    }

    handleClick(event) {
        alert(event.target.value);
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }

    tick() {
        this.setState({
            date: new Date()
        });//use setState inside functions to check if state has changed.
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );//setInterval funct defined here passing tick function
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render() {
        return (
            <div>
            <h2>{this.state.date.toLocaleTimeString()}</h2>
                <button onClick={this.handleClick} value='43'>
                {this.state.isToggleOn ? 'ON1' : 'OFF'}
                </button>

                <Button color="blue">No</Button>
              
            </div>
        );
    }
}

export default App;