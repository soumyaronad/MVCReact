import React, { Component } from 'react';
import { Icon, Table, Pagination } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import CusModal from './CusModal';
import $ from 'jquery';

export class Customer extends Component {
    static displayName = Customer.name;

    constructor() {
        super();

        this.replaceModalItem = this.replaceModalItem.bind(this);
        this.showDeleteItem = this.showDeleteItem.bind(this);
        this.saveData = this.saveData.bind(this);
        this.validateForm = this.validateForm.bind(this);

        this.state = {
            currentPage: 1, dataPerPage: 10,  cusDatas: [], nameError: false, addressError: false, loading: true, isOpen: false, isClose: false, isDelOpen: false, name: '', address: '', id: '', deleteId: '', nameValMessage: '', addressValMessage: ''
        };

        this.closeModal = this.closeModal.bind(this);
        this.onDelClose = this.onDelClose.bind(this);

        this.handleaddress = this.handleaddress.bind(this);
        this.handleName = this.handleName.bind(this);

        this.createCus = this.createCus.bind(this);
        this.deleteCus = this.deleteCus.bind(this);

    }



    componentDidMount() {

        this.loadCusData();
    }

    // To get customer list
    loadCusData() {
        $.ajax({
            url: "/Customers/GetCustomerData",
            type: "GET",
            dataType: "json",
            context: this,
            success: function (data) {
                console.log(data);
                this.setState({ cusDatas: data, loading: false });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Uncaught Error.\n');
            }
        });

    }

    // To close edit or create modal
    closeModal() {

        this.setState({ isOpen: false });
    }

    //To close delete modal
    onDelClose() {

        this.setState({ isDelOpen: false });
    }
    // To display create modal
    createCus() {
        this.setState({ isOpen: true, id: '', name: '', address: '', nameError: false, addressError: false, nameValMessage: '', addressValMessage: '' });
    }

    // To diplay edit modal by Id 
    replaceModalItem(index) {
        this.setState({ nameError: false, addressError: false, nameValMessage: '', addressValMessage: '' });
        var dataId = { id: index.id }
        console.log("Inside edit method");
        $.ajax({
            url: "/Customers/GetCustomerById",
            type: "POST",
            data: dataId,
            context: this,
            success: function (data) {
                this.setState({ isOpen: true, id: data.id, name: data.name, address: data.address });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Uncaught Error.\n');
            }
        });
    }

    // To diplay delelte modal by customer Id 
    showDeleteItem(index) {

        console.log(index);
        var dataId = { id: index.id }
        console.log("Inside edit method");
        $.ajax({
            url: "/Customers/GetCustomerById",
            type: "POST",
            data: dataId,
            context: this,
            success: function (data) {

                this.setState({ isDelOpen: true, deleteId: data.id });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Uncaught Error.\n');
            }
        });

    }

    // To delete customer record by Id
    deleteCus() {

        this.setState({ isDelOpen: false });
        const item = this.state;
        console.log(item)
        var data = { id: item.deleteId }
        console.log("Inside edit method");
        $.ajax({
            url: "/Customers/DeleteCustomerdata",
            type: "POST",
            data: data,
            context: this,
            datatype: "json",
            success: function (data) {
                console.log(data);
                this.loadCusData();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Uncaught Error.\n');
            }
        });

    }

    // To handle name input field 
    handleName(e) {

        this.setState({ name: e.target.value });

    }

    // To handle address Input field
    handleaddress(e) {

        this.setState({ address: e.target.value });

    }

    // To validate input fields of the form 
    validateForm() {

        let nameEr = false;
        let addressEr = false;
        let formIsValid = true;
        let nameValMessage = '';
        let addressValMessage = '';
        console.log("inside validateForm Method")

        // To check if the name field is empty
        if (this.state.name === '') {
            console.log("Name is Undefined");
            nameEr = true;
            formIsValid = false;
            nameValMessage = 'Please Enter Name';
        }

        //To check if name field has only Alphabet Characters
        if (!this.state.name.match(/^[a-zA-Z ]*$/)) {
            nameEr = true;
            formIsValid = false;
            nameValMessage = 'Please Enter Alphabet Characters Only';
        }

        // To Check if address field is empty 
        if (this.state.address === '') {

            console.log("HI");

            addressEr = true;
            formIsValid = false;
            addressValMessage = 'Please Enter address';
            console.log(addressValMessage);
        }

        let address = this.state.address;

      //To Check if the address lenght is more 150 charecters
        if (address.length > 150) {
            addressEr = true;
            formIsValid = false;
            addressValMessage = 'Address cannot be more than 150 characters';
        }

        // To check is address has only alphanumeric characters 
        if (!address.match(/^[a-zA-Z0-9\s,'-]*$/)) {
            addressEr = true;
            formIsValid = false;
            addressValMessage = 'Address can only contain alphanumeric characters, hyphens(-) and Comma(,)';
        }
        this.setState(
            { nameError: nameEr, addressError: addressEr, nameValMessage: nameValMessage, addressValMessage: addressValMessage }
        );
        return formIsValid;
    }

    // To save eddited or new customer record
    saveData() {

        if (this.validateForm()) {
            this.setState({ isOpen: false });
            console.log(this.state.isOpen);
            const item = this.state;
            console.log(item);
            var data = { id: item.id, name: item.name, address: item.address }
            console.log("Inside edit method");
            $.ajax({
                url: "/Customers/SaveCustomerdata",
                type: "POST",
                data: data,
                context: this,
                datatype: "json",
                success: function (data) {
                    this.loadCusData();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert('Uncaught Error.\n');
                }
            });

        }

        else {
            this.setState({ isOpen: true });

        }
    }


    render() {
        var cusDatas = this.state.cusDatas;
        var currentPage = this.state.currentPage;
        var dataPerPage = this.state.dataPerPage;

        // Logic for displaying current pagination data
        const indexOfLastData = currentPage * dataPerPage;
        const indexOfFirstData = indexOfLastData - dataPerPage;
        const currentData = cusDatas.slice(indexOfFirstData, indexOfLastData);

        let button = <Button color='blue' onClick={() => this.createCus()}>Create</Button>

        // To display customer list
        let contents = this.state.loading && this.state.cusDatas !== ""
            ? <p><em>Loading...</em></p>
            :
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>address</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>{currentData.map(cusData =>
                    <Table.Row key={cusData.id} id={cusData.id}>
                        <Table.Cell >{cusData.name} </Table.Cell>
                        <Table.Cell >{cusData.address}</Table.Cell>
                        <Table.Cell> <Button color='yellow' onClick={() => this.replaceModalItem(cusData)} > <Icon name='edit' />Edit</Button> </Table.Cell>
                        <Table.Cell> <Button color='red' onClick={() => this.showDeleteItem(cusData)}><Icon name='trash' />Delete</Button></Table.Cell>

                    </Table.Row>

                )}
                </Table.Body>
            </Table>

        //Edit or create modal
        let modal = < CusModal
            isOpen={this.state.isOpen}
            isDelOpen={this.state.isDelOpen}
            onClose={this.closeModal}
            isDelClose={this.onDelClose}
            deleteId={this.deleteId}
            id={this.state.id}
            name={this.state.name}
            address={this.state.address}
            save={this.saveData}
            handleName={this.handleName}
            handleaddress={this.handleaddress}
            deleteCus={this.deleteCus}
            nameError={this.state.nameError}
            addressError={this.state.addressError}
            nameValMessage={this.state.nameValMessage}
            addressValMessage={this.state.addressValMessage}
        />

        // pagination for the table 
        let Page =
            <Pagination
                boundaryRange={0}
                defaultActivePage={1}
                ellipsisItem={null}
                firstItem={null}
                lastItem={null}
                siblingRange={1}
                totalPages={Math.ceil(cusDatas.length / dataPerPage)}
                onPageChange={this.nextPage}
            />

        return (
            <div>
                <h1>Customer Details</h1>
                {button}
                {contents}
                {Page}
                {modal}
            </div>

        );
    }
}

export default Customer;