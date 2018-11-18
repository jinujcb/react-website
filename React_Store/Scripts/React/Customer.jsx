import React from "react"
import ReactDOM from "react-dom"
import { Button, Header, Icon, Modal, Label, Form, Table, Menu, Popup, Message } from "semantic-ui-react"
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios';
import Nav from './Navbar'


class Customer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Customer Details', m_title: '', open: false, openDelete:false,datas: [], customerdata: [], size: 'small', Id: '', Name: '', Address: '', nameError: '',
            addressError: '',
        };

        this.show = this.show.bind(this);///binding only for functions within customer class or else show function is out of scope instead of binding we can arrow function
        this.delete = this.delete.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        axios.get('/Customers/GetAllCustomers')
            .then(res => {
                const datas = res.data;
                this.setState({ datas });
            })

    }//no need to use location.reload()

    componentDidMount() {
        axios.get('/Customers/GetAllCustomers')
            .then(res => {
                const datas = res.data;
                this.setState({ datas });
            })
    }


    show(event) {
        const Id = event.target.id;

        event.preventDefault();

        let add_edit;
        if (event.target.value === '') {
            add_edit = 'Create';
            this.setState({ Id: '', Name: '', Address: '' })
        }
        else {
         
            add_edit = event.target.value;

            axios.get('/Customers/GetCustomer/' + Id)
                .then(res => {
                    const Id = res.data.ID;
                    const Name = res.data.Name;
                    const Address = res.data.Address;
                    this.setState({ Id, Name, Address });
                })

        }

        this.setState(state => ({
            size: 'small',
            open: !this.state.open,
            m_title: add_edit,
            nameError: '',
            addressError: ''
        }));
    }

    submit(m_title, Id, Name, Address) {
        console.log(m_title, Id, Name, Address);
        if (Name != '' && Address != '' && m_title === 'Create') {

            axios({
                method: 'post',
                url: '/Customers/Create/',
                data: {
                    Name: Name,
                    Address: Address
                }
            });

            this.setState({ open: false })
        }
        else if (Name != '' && Address != '' && m_title === 'Edit') {
            axios({
                method: 'post',
                url: '/Customers/Edit/',
                data: {
                    ID: Id,
                    Name: Name,
                    Address: Address
                }
            });
            this.setState({ open: false })
        }
        else if (this.state.m_title === 'Delete') {

            axios({
                method: 'post',
                url: '/Customers/Delete/',
                data: {
                    ID: this.state.Id
                }
            });
            this.setState({ openDelete: false })
        }

        else {
            alert("Please fill all the Customer Details.");
            if (Name == '' && Address == '') {
                this.setState({ nameError: 'Please enter Name', addressError: 'Please enter Address' })
            }
            if (Address == '' && Name != '') {
                this.setState({ nameError: '', addressError: 'Please enter Address' })
            }
            if (Address != '' && Name == '') {
                this.setState({ nameError: 'Please enter Name', addressError: '' })
            }

        }

    }
    delete(event) {
        this.setState({
            Id: event.target.id,
            m_title: 'Delete',
            openDelete: true,
        });
    }
    close = () => this.setState({ open: false, openDelete:false })
    render() {
        const { open, openDelete,size, datas } = this.state

        return (

            <div>

                <Modal size="small" open={openDelete} onClose={this.close} closeIcon>
                    <Modal.Header>{this.state.m_title}</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to delete the item?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' onClick={this.close}>Cancel</Button>
                        <Button positive icon='checkmark' labelPosition='right' content='Yes' type='submit' onClick={() => {
                            this.submit()
                        }} />
                    </Modal.Actions>
                </Modal>

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
                                <label>Address</label>
                                <div ><font color="red">{this.state.addressError}</font></div>
                                <input type="text" required className="form-control" name="Address"
                                    id="Address" placeholder='Address...'
                                    defaultValue={this.state.Address} />
                            </Form.Field>

                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='blue' type='submit' id="btnSubmit" onClick={() => {
                            this.submit(m_title.value, Id.value, Name.value, Address.value)
                        }}>Submit</Button>
                        <Button color='red' onClick={this.close}>Close</Button>
                    </Modal.Actions>
                </Modal>

                <h2> {this.state.title}</h2>
                <br />
                <Button color='blue' id="btnCreate" onClick={this.show}>
                    <i aria-hidden='true' className='plus icon' /> Add New Customer
                     </Button>

                <Table celled selectable fixed >
                    <Table.Header >
                        <Table.Row active>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Address</Table.HeaderCell>
                            <Table.HeaderCell>Action(Edit)</Table.HeaderCell>
                            <Table.HeaderCell>Action(Delete)</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body >

                        {this.state.datas.map((datas, index) => (
                            <Table.Row key={index}>
                                <Table.Cell>{datas.Name}</Table.Cell>
                                <Table.Cell>{datas.Address}</Table.Cell>
                                <Table.Cell>
                                    <Button color='yellow' id="btnEdit" onClick={this.show} id={datas.ID} value='Edit'>
                                        <i aria-hidden='true' className='pencil icon' />Edit
                                 </Button>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button color='red' id="btnDelete" onClick={this.delete} id={datas.ID} value='Delete' icon='trash'>
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

export default Customer;
