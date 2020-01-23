import React, { Component } from 'react';
import { Icon, Table, Pagination } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import StrModal from './StrModal';
import $ from 'jquery';

export class Store extends Component {
    static displayName = Store.name;

    constructor() {

        super();

        this.replaceModalItem = this.replaceModalItem.bind(this);
        this.showDeleteItem = this.showDeleteItem.bind(this);
        this.saveData = this.saveData.bind(this);
        this.validateForm = this.validateForm.bind(this);

        this.state = {
            currentPage: 1, dataPerPage: 10, strData: [], nameError: false, addressError: false, loading: true, isOpen: false, isClose: false, isDelOpen: false, name: '', address: '', id: '', deleteId: '', nameValMessage: '', addressValMessage: ''
        };

        this.closeModal = this.closeModal.bind(this);
        this.onDelClose = this.onDelClose.bind(this);

        this.handleaddress = this.handleaddress.bind(this);
        this.handleName = this.handleName.bind(this);

        this.createStr = this.createStr.bind(this);
        this.deleteStr = this.deleteStr.bind(this);

    }



    componentDidMount() {

        this.loadStrData();
    }

    // To get Store List 
    loadStrData() {
        $.ajax({
            url: "/Stores/GetStoreData",
            type: "GET",
            dataType: "json",
            context: this,
            success: function (data) {
                console.log(data);
                this.setState({ strData: data, loading: false });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Uncaught Error.\n');
            }
        });

    }

    // To Close edit or create modal
    closeModal() {

        this.setState({ isOpen: false });
    }

    // To Close delete modal
    onDelClose() {

        this.setState({ isDelOpen: false });
    }

    // To display create modal 
    createStr() {
        this.setState({ isOpen: true, id: '', name: '', address: '', nameError: false, addressError: false, nameValMessage: '', addressValMessage: '' });
    }

    // To display modal by store Id  
    replaceModalItem(index) {
        this.setState({ nameError: false, addressError: false, nameValMessage: '', addressValMessage: '' });
        var dataId = { id: index.id }
        console.log("Inside edit method");
        $.ajax({
            url: "/Stores/GetStoreById",
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

    // To display delete modal by Id 
    showDeleteItem(index) {

        console.log(index);
        var dataId = { id: index.id }
        console.log("Inside edit method");
        $.ajax({
            url: "/Stores/GetStoreById",
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

    // To delete store record by Id 
    deleteStr() {

        this.setState({ isDelOpen: false });
        const item = this.state;
        console.log(item)
        var data = { id: item.deleteId }
        console.log("Inside edit method");
        $.ajax({
            url: "/Stores/DeleteStoredata",
            type: "POST",
            data: data,
            context: this,
            datatype: "json",
            success: function (data) {
                console.log(data);
                this.loadStrData();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Uncaught Error.\n');
            }
        });

    }

    //Handle name field 
    handleName(e) {

        this.setState({ name: e.target.value });

    }

    // Handle address field
    handleaddress(e) {

        this.setState({ address: e.target.value });

    }

    // To Validate form inputs  
    validateForm() {

        let nameEr = false;
        let addressEr = false;
        let formIsValid = true;
        let nameValMessage = '';
        let addressValMessage = '';
        console.log("inside validateForm Method")

        //validate if name field is empty
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

        // validate if address field is empty
        if (this.state.address === '') {

            console.log("HI");

            addressEr = true;
            formIsValid = false;
            addressValMessage = 'Please Enter address';
            console.log(addressValMessage);
        }

        let address = this.state.address;
        //validating lenght of address 
        if (address.length > 150) {
            addressEr = true;
            formIsValid = false;
            addressValMessage = 'Address cannot be more than 150 characters';
        }

        this.setState(
            { nameError: nameEr, addressError: addressEr, nameValMessage: nameValMessage, addressValMessage: addressValMessage }
        );
        return formIsValid;
    }

    // To save editted or new Store record 
    saveData() {

        if (this.validateForm()) {
            this.setState({ isOpen: false });
            console.log(this.state.isOpen);
            const item = this.state;
            console.log(item);
            var data = { id: item.id, name: item.name, address: item.address }
            console.log("Inside edit method");
            $.ajax({
                url: "/Stores/SaveStoredata",
                type: "POST",
                data: data,
                context: this,
                datatype: "json",
                success: function (data) {
                    this.loadStrData();
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
       

        let button = <Button color='blue' onClick={() => this.createStr()}>Create</Button>
        var strDatas = this.state.strData;

        var currentPage = this.state.currentPage;
        var dataPerPage = this.state.dataPerPage;

        // Logic for displaying current pagination data
        const indexOfLastData = currentPage * dataPerPage;
        const indexOfFirstData = indexOfLastData - dataPerPage;
        const currentData = strDatas.slice(indexOfFirstData, indexOfLastData);

        // To display store list
        let contents = this.state.loading && this.state.strDatas !== ""
            ? <p><em>Loading...</em></p>
            :
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Address</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>{currentData.map(strData =>
                    <Table.Row key={strData.id} id={strData.id}>
                        <Table.Cell >{strData.name} </Table.Cell>
                        <Table.Cell >{strData.address}</Table.Cell>
                        <Table.Cell> <Button color='yellow' onClick={() => this.replaceModalItem(strData)} > <Icon name='edit' />Edit</Button> </Table.Cell>
                        <Table.Cell> <Button color='red' onClick={() => this.showDeleteItem(strData)}><Icon name='trash' />Delete</Button></Table.Cell>

                    </Table.Row>

                )}
                </Table.Body>
            </Table>

        // Edit or create modal
        let modal = < StrModal
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
            deleteStr={this.deleteStr}
            nameError={this.state.nameError}
            addressError={this.state.addressError}
            nameValMessage={this.state.nameValMessage}
            addressValMessage={this.state.addressValMessage}
        />

         // Table Pagination
        let Page =
            <Pagination
                boundaryRange={0}
                defaultActivePage={1}
                ellipsisItem={null}
                firstItem={null}
                lastItem={null}
                siblingRange={1}
                totalPages={Math.ceil(strDatas.length / dataPerPage)}
                onPageChange={this.nextPage}
            />

        return (
            <div>
                <h1>Store Details</h1>
                {button}
                {contents}
                {Page}
                {modal}
            </div>

        );
    }
}

export default Store;