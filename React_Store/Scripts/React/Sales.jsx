import React from "react"
import ReactDOM from "react-dom"
import { Button, Header, Icon, Modal, Label, Form, Table, Menu, Popup, Message, Dropdown } from "semantic-ui-react"
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios';
import Nav from './Navbar'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

class Sales extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            CustomerId: '', ProductId: '', StoreId: '', date: moment(), datas: [], Products: [], Customers: [], Stores: [], title: 'Sale Details', m_title: '', open: false, openDelete:false,customerdata: [], size: 'small', Id: '', customerName: '', productName: '', storeName: '', dateSold: '', customerNameError: '', productNameError: '', storeNameError: '', dateSoldError: ''
        };
   
        this.show = this.show.bind(this);///binding only for functions
        this.delete = this.delete.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        axios.get('/Sales/GetAllSales')
            .then(res => {
                this.setState({ datas: JSON.parse(res.data) });
            });
       
    }//no need to use location.reload()

    componentDidMount() {
        axios.get('/Sales/GetAllSales')
            .then(res => {
                console.log(res.data);
                this.setState({ datas: JSON.parse(res.data) });
            });
    }

    handleChangeDate = (date) => {
        this.setState({
            date
        });
    };
    handleChangeCustomer = (event, data) => {

        this.setState({ CustomerId: data.value });
       
    }
    handleChangeProduct = (event, data) => {

        this.setState({ ProductId: data.value });
    }
    handleChangeStore = (event, data) => {

        this.setState({ StoreId: data.value });
    }
    show(event) {
        var Id = event.target.id;
        event.preventDefault();
        this.setState({ Id: event.target.id});
        let add_edit;
        axios.get('/Products/GetAllProducts')
            .then(res => {
                const Products = res.data;

                this.setState({ Products });
            })
        axios.get('/Customers/GetAllCustomers')
            .then(res => {
                const Customers = res.data;

                this.setState({ Customers });
            })
        axios.get('/Stores/GetAllStores')
            .then(res => {
                const Stores = res.data;

                this.setState({ Stores });
            })

        if (event.target.value === '') {
            add_edit = 'Create';
            this.setState({
                Id: '',
                CustomerId:'',
                ProductId:'',
                StoreId:'',
                dateSold: '',
                open: true,
                m_title: add_edit,
                customerNameError: '',
                productNameError: '',
                storeNameError: '',
                dateSoldError: '' });
        }
        else {
  
            add_edit = event.target.value;

            axios.get('/Sales/GetSales/' + Id)
                .then(res => {
                    const Id = res.data.ID;
                    const CustomerId = res.data.CustomerID;
                    const ProductId = res.data.ProductID;
                    const StoreId = res.data.StoreID;
                    const dateSold = res.data.Datesold;
                    this.setState({
                        Id,
                        CustomerId,
                        ProductId,
                        StoreId,
                        dateSold,
                        open: true,
                        m_title: add_edit,
                        customerNameError: '',
                        productNameError: '',
                        storeNameError: '',
                        dateSoldError: ''});
                })
          
        }

       
    }
    delete(event) {
        this.setState({
            Id: event.target.id,
            m_title: 'Delete',
            openDelete: true,
        });
    }
    submit() {
   
        this.setState(state => ({
            customerNameError: '',
            productNameError: '',
            storeNameError: '',
            dateSoldError: ''

        }));
        if (this.state.CustomerId != '' && this.state.ProductId != '' && this.state.StoreId != '' && this.state.date != '' && this.state.m_title === 'Create') {

            axios({
                method: 'post',
                url: '/Sales/Create/',
                data: {
                    CustomerID: this.state.CustomerId,
                    ProductID: this.state.ProductId,
                    StoreID: this.state.StoreId,
                    Datesold: this.state.date,
                }
            });

            this.setState({ open: false })
        }
        else if (this.state.CustomerId != '' && this.state.ProductId != '' && this.state.StoreId != '' && this.state.date != '' && this.state.m_title === 'Edit') {

            axios({
                method: 'post',
                url: '/Sales/Edit/',
                data: {
                    ID: this.state.Id,
                    CustomerID: this.state.CustomerId,
                    ProductID: this.state.ProductId,
                    StoreID: this.state.StoreId,
                    Datesold: this.state.date,
                }
            });
            this.setState({ open: false })
        }
        else if (this.state.m_title === 'Delete') {
            
            axios({
                method: 'post',
                url: '/Sales/Delete/',
                data: {
                    ID: this.state.Id
                }
            });
            this.setState({ openDelete: false })
        }

        else {
            alert("Please fill all the Sale Details.");
            if (this.state.CustomerId === '') {
                this.setState({ customerNameError: 'Please select Customer' })
            }
            if (this.state.ProductId === '') {
                this.setState({ productNameError: 'Please select Product' })
            }
            if (this.state.StoreId === '') {
                this.setState({ storeNameError: 'Please select Store' })
            }
            if (this.state.date === '') {
                this.setState({ dateSoldError: 'Please select Date' })
            }
        }

    }
   
    close = () => this.setState({ open: false, openDelete:false })



    render() {
        const { open, openDelete, size, datas, Customers, Stores, Products, date } = this.state
  
            
        return (

            <div>
 
                <h2> {this.state.title}</h2>
                <br />
                <Button color='blue' id="btnCreate" onClick={this.show}>
                    <i aria-hidden='true' className='plus icon' /> Add New Sale
                     </Button>

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
                                <label>Customer Name</label>
                                <div ><font color="red">{this.state.customerNameError}</font></div>
                                <Dropdown  placeholder='Select Country' onChange={this.handleChangeCustomer} fluid search selection options={Customers.map(customer => ({
                                    key: customer.ID,
                                    value: customer.ID,
                                    text: customer.Name,
                                }))} defaultValue={this.state.CustomerId} />
      
                         </Form.Field>

                            <Form.Field>
                                <label>Product Name</label>
                                <div ><font color="red">{this.state.productNameError}</font></div>
                                <Dropdown  placeholder='Select Product' onChange={this.handleChangeProduct} fluid search selection options={Products.map(product => ({
                                    key: product.ID,
                                    value: product.ID,
                                    text: product.Name,
                                }))} defaultValue={this.state.ProductId} />
                            </Form.Field>

                            <Form.Field>
                                <label>Store Name</label>
                                <div ><font color="red">{this.state.storeNameError}</font></div>
                                <Dropdown placeholder='Select Store' onChange={this.handleChangeStore} fluid search selection options={Stores.map(store => ({
                                    key: store.ID,
                                    value: store.ID,
                                    text: store.Name,
                                }))} defaultValue={this.state.StoreId}/>
                            </Form.Field>

                            <Form.Field>
                                <label>Date Sold</label>
                                <div ><font color="red">{this.state.dateSoldError}</font></div>
                                <DatePicker
                                    selected={this.state.date}
                                    onChange={this.handleChangeDate}
                                    dateFormat="LL"
                                    id="date"
                                    defaultValue={this.state.dateSold}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='blue' type='submit' id="btnSubmit" onClick={() => {
                            this.submit()             
                        }}>Submit</Button>
                        <Button color='red' onClick={this.close}>Close</Button>
                    </Modal.Actions>
                </Modal>



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
                     
                        {datas.map((datas, index) => (
                            <Table.Row key={index}>
                                <Table.Cell>{datas.Customer.Name}</Table.Cell>
                                <Table.Cell>{datas.Product.Name}</Table.Cell>
                                <Table.Cell>{datas.Store.Name}</Table.Cell>
                                <Table.Cell>{moment(datas.Datesold).format('DD-MM-YYYY')}</Table.Cell>
                                <Table.Cell>
                                    <Button color='yellow' id="btnEdit" onClick={this.show} id={datas.ID} value='Edit'>
                                        <i aria-hidden='true' className='pencil icon' />Edit
                                 </Button>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button color='red' id="btnDelete" onClick={this.delete} id={datas.ID} value='Delete' >
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

export default Sales;
