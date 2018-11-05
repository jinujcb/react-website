import React from "react"
import ReactDOM from "react-dom"
import { Button, Header, Icon, Modal, Label, Form, Table, Menu, Popup, Message, Dropdown } from "semantic-ui-react"
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios';
import Nav from './Navbar'

class Sales extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            datas:  null, title: 'Sale Details', m_title: '', open: false, customerdata: [], size: 'small', Id: '', customerName: '', productName: '', storeName: '', dateSold: '', customerNameError: '', productNameError: '', storeNameError: '', 
        };
        this.show = this.show.bind(this);///binding only for functions
    }

    //componentDidUpdate(prevProps, prevState) {
    //    axios.get('/Sales/GetAllSales')
    //        .then(res => {
    //            const datas = res.data;
    //            this.setState({ datas });
    //        })
       
    //}//no need to use location.reload()

    componentDidMount() {
        axios.get('/Sales/GetAllSales')
            .then(res => {
                this.setState({ datas: res.data });
            });
    }


    show(event) {
        var Id = event.target.id;
        event.preventDefault();

        var fn;
        if (event.target.value === '') {
            fn = 'Create';
            this.setState({ Id: '', customerName: '', productName: '', storeName: '', dateSold:'' })
        }
        else {
            var form_ID = Id
            fn = event.target.value;

            axios.get('Sales/GetSales' + Id)
                .then(res => {
                    const Id = res.data.ID;
                    const customerName = res.data.Customer.Name;
                    const productName = res.data.Product.Name;
                    const storeName = res.data.Store.Name;
                    const dateSold = res.data.Datesold;

                    this.setState({ Id, customerName, productName, storeName, dateSold });
                })

        }

        this.setState(state => ({
            size: 'small',
            open: true,
            m_title: fn,
            nameError: '',
            addressError: ''
        }));
    }

    submit(m_title, Id, customerName, productName, storeName, dateSold) {
        console.log(Id, customerName, productName, storeName, dateSold);
        if (customerName != '' && productName != '' && storeName != '' && dateSold!=''&& m_title === 'Create') {

            axios({
                method: 'post',
                url: '/Sales/Create/',
                data: {
                    customerName: Customer.Name,
                    productName: Product.Name,
                    storeName: Store.Name,
                    dateSold: Datesold,
                }
            });

            this.setState({ open: false })
        }
        else if( customerName != '' && productName != '' && storeName != '' && dateSold != ''&& m_title === 'Edit') {
            axios({
                method: 'post',
                url: '/Sales/Edit/',
                data: {
                    ID: Id,
                    customerName: Customer.Name,
                    productName: Product.Name,
                    storeName: Store.Name,
                    dateSold: Datesold,
                }
            });
            this.setState({ open: false })
        }
        else if (customerName != '' && productName != '' && storeName != '' && dateSold != '' && m_title === 'Delete') {
            axios({
                method: 'post',
                url: '/Sales/Delete/',
                data: {
                    ID: Id
                }
            });
            this.setState({ open: false })
        }

        else {
            alert("Please fill all the Sale Details.");
            //if (Name == '' && Address == '') {
            //    this.setState({ nameError: 'Please enter Name', addressError: 'Please enter Address' })
            //}
            //if (Address == '' && Name != '') {
            //    this.setState({ nameError: '', addressError: 'Please enter Address' })
            //}
            //if (Address != '' && Name == '') {
            //    this.setState({ nameError: 'Please enter Name', addressError: '' })
            //}

        }

    }
    close = () => this.setState({ open: false })
    render() {
        const { open, size, datas } = this.state
        debugger
        var data = 
            datas.map((datas, index) => (
                <Table.Row key={index}>
                    <Table.Cell>{datas.CustomerID}</Table.Cell>
                    <Table.Cell>{datas.ProductID}</Table.Cell>
                    <Table.Cell>{datas.StoreID}</Table.Cell>
                    <Table.Cell>{datas.Datesold}</Table.Cell>
                    <Table.Cell>
                        <Button color='yellow' id="btnEdit" onClick={this.show} id={datas.ID} value='Edit'>
                            <i aria-hidden='true' className='pencil icon' />Edit
                                 </Button>
                    </Table.Cell>
                    <Table.Cell>
                        <Button color='red' id="btnDelete" onClick={this.show} id={datas.ID} value='Delete' >
                            <i aria-hidden='true' className='trash icon' /> Delete
                                 </Button>
                    </Table.Cell>
                </Table.Row>
            ))
        
        return (

            <div>
 
                <h2> {this.state.title}</h2>
                <br />
                <Button color='blue' id="btnCreate" onClick={this.show}>
                    <i aria-hidden='true' className='plus icon' /> Add New Sale
                     </Button>

                <Table celled selectable fixed >
                    <Table.Header >
                        <Table.Row active>
                            <Table.HeaderCell>Customer Name</Table.HeaderCell>
                            <Table.HeaderCell>Product Name</Table.HeaderCell>
                            <Table.HeaderCell>Store Name</Table.HeaderCell>
                            <Table.HeaderCell>Date Sold</Table.HeaderCell>
                            <Table.HeaderCell>Action(Edit)</Table.HeaderCell>
                            <Table.HeaderCell>Action(Delete)</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body >
                     


                        {data}


                    </Table.Body>
                </Table>

            </div>

        );
    }
}

export default Sales;
