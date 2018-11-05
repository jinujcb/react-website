import React from "react"
import ReactDOM from "react-dom"
import { Button, Header, Icon, Modal, Label, Form, Table, Menu, Popup, Message } from "semantic-ui-react"
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios';
import Nav from './Navbar'


class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Product Details', m_title: '', open: false, datas: [], customerdata: [], size: 'small', Id: '', Name: '', Price: '', nameError: '',
            priceError: '',
        };

        this.show = this.show.bind(this);///binding only for functions
    }

    componentDidUpdate(prevProps, prevState) {
        axios.get('/Products/GetAllProducts')
            .then(res => {
                const datas = res.data;
                this.setState({ datas });
            })

    }//no need to use location.reload()

    componentDidMount() {
        axios.get('/Products/GetAllProducts')
            .then(res => {
                const datas = res.data;
                this.setState({ datas });
            })
    }


    show(event) {
        var Id = event.target.id;
        event.preventDefault();

        var fn;
        if (event.target.value === '') {
            fn = 'Create';
            this.setState({ Id: '', Name: '', Price: '' })
        }
        else {
            var form_ID = Id
            fn = event.target.value;

            axios.get('/Products/GetProduct/' + Id)
                .then(res => {
                    const Id = res.data.ID;
                    const Name = res.data.Name;
                    const Price = res.data.Price;
                    this.setState({ Id, Name, Price });
                })

        }

        this.setState(state => ({
            size: 'small',
            open: true,
            m_title: fn,
            nameError: '',
            priceError: ''
        }));
    }

    submit(m_title, Id, Name, Price) {
        console.log(m_title, Id, Name, Price);
        if (Name != '' && Price != '' && m_title === 'Create') {

            axios({
                method: 'post',
                url: '/Products/Create/',
                data: {
                    Name: Name,
                    Price: Price
                }
            });

            this.setState({ open: false })
        }
        else if (Name != '' && Price != '' && m_title === 'Edit') {
            axios({
                method: 'post',
                url: '/Products/Edit/',
                data: {
                    ID: Id,
                    Name: Name,
                    Price: Price
                }
            });
            this.setState({ open: false })
        }
        else if (Name != '' && Price != '' && m_title === 'Delete') {
            axios({
                method: 'post',
                url: '/Products/Delete/',
                data: {
                    ID: Id
                }
            });
            this.setState({ open: false })
        }

        else {
            alert("Please fill all the Product Details.");
            if (Name == '' && Price == '') {
                this.setState({ nameError: 'Please enter Name', priceError: 'Please enter Price' })
            }
            if (Price == '' && Name != '') {
                this.setState({ nameError: '', priceError: 'Please enter Price' })
            }
            if (Price != '' && Name == '') {
                this.setState({ nameError: 'Please enter Name', priceError: '' })
            }

        }

    }
    close = () => this.setState({ open: false })
    render() {
        const { open, size, datas } = this.state

        return (

            <div>


                <Modal size="small" open={open} onClose={this.close} closeIcon>
                    <Modal.Header>{this.state.m_title}</Modal.Header>
                    <Modal.Content id="Add_Edit">

                        <Form key={this.state.Id}>
                            <input id="m_title" value={this.state.m_title} hidden />
                            <input type='text' id="Id" defaultValue={this.state.Id} hidden />


                            <Form.Field>
                                <label>Name</label>
                                <div ><font color="red">{this.state.nameError}</font></div>
                                <input type="text" required className="form-control" name="Name"
                                    id="Name" placeholder='Name...'
                                    defaultValue={this.state.Name} />

                            </Form.Field>

                            <Form.Field>
                                <label>Price</label>
                                <div ><font color="red">{this.state.priceError}</font></div>
                                <input type="text" required className="form-control" name="Price"
                                    id="Price" placeholder='Price...'
                                    defaultValue={this.state.Price} />
                            </Form.Field>

                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='blue' type='submit' id="btnSubmit" onClick={() => {
                            this.submit(m_title.value, Id.value, Name.value, Price.value)
                        }}>Submit</Button>
                        <Button color='red' onClick={this.close}>Close</Button>
                    </Modal.Actions>
                </Modal>

                <h2> {this.state.title}</h2>
                <br />
                <Button color='blue' id="btnCreate" onClick={this.show}>
                    <i aria-hidden='true' className='plus icon' /> Add New Product
                     </Button>

                <Table celled selectable fixed >
                    <Table.Header >
                        <Table.Row active>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Price</Table.HeaderCell>
                            <Table.HeaderCell>Action(Edit)</Table.HeaderCell>
                            <Table.HeaderCell>Action(Delete)</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body >

                        {this.state.datas.map((datas, index) => (
                            <Table.Row key={index}>
                                <Table.Cell>{datas.Name}</Table.Cell>
                                <Table.Cell>{datas.Price}</Table.Cell>
                                <Table.Cell>
                                    <Button color='yellow' id="btnEdit" onClick={this.show} id={datas.ID} value='Edit'>
                                        <i aria-hidden='true' className='pencil icon' />Edit
                                 </Button>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button color='red' id="btnDelete" onClick={this.show} id={datas.ID} value='Delete' icon='trash'>
                                        <i aria-hidden='true' className='trash icon' /> Delete
                                 </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}


                    </Table.Body>
                </Table>

            </div>

        );
    }
}

export default Product;
