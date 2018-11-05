import React from "react"
import ReactDOM from "react-dom"
import { Menu, Segment } from "semantic-ui-react"
import 'semantic-ui-css/semantic.min.css'


class Nav extends React.Component {
    state = { activeItem: 'home' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state

        return (
            <Segment inverted >
                <Menu inverted secondary size='large' >
                    <Menu.Item name='React-Onboarding'/>
                    <Menu.Item
                        name='Customers'
                        active={activeItem === 'Customers'}
                        onClick={this.handleItemClick}
                        href='/Customers/Index' 
                    />
                    <Menu.Item
                        name='Products'
                        active={activeItem === 'Products'}
                        onClick={this.handleItemClick}
                        href='/Products/Index' 
                    />
                    <Menu.Item
                        name='Stores'
                        active={activeItem === 'Stores'}
                        onClick={this.handleItemClick}
                        href='/Stores/Index'
                    />
                    <Menu.Item
                        name='Sales'
                        active={activeItem === 'Sales'}
                        onClick={this.handleItemClick}
                        href='/Sales/Index'
                    />
                </Menu>
            </Segment>
        )
    }
}

ReactDOM.render(
    <Nav />,
    document.getElementById('nav-root')
);
  