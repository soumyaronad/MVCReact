import React, { Component} from 'react';
import { Icon, Table, Pagination } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import fetch from 'isomorphic-fetch';
import 'semantic-ui-css/semantic.min.css';
import $ from 'jquery'; 
import SalesModal from './SalesModal';


export class Sales extends Component {

    constructor() {
        super();

        this.state = { currentPage: 1, dataPerPage: 10, salesData: [], loading: true, proList: [], isopen: false, cusList: [], strList: [], salesEditId: '', cusEditId: '', strEditId: '', proEditId: '', soldDate: '', isDelOpen: false, proError: false, dateError: false, cusError: false, strError: false, proValMessage: '', cusValMessage: '', strValMessage: '', dateValMessage: '', deleteId:'', message:''};
        this.showEditModal = this.showEditModal.bind(this);
        this.onClose = this.onClose.bind(this);
        this.isDelClose = this.isDelClose(this);

        this.onCusChange = this.onCusChange.bind(this);
        this.onProChange = this.onProChange.bind(this);
        this.onStrChange = this.onStrChange.bind(this);
        this.ondateChange = this.ondateChange.bind(this);

        this.saveData = this.saveData.bind(this);
        this.createSales = this.createSales.bind(this);

        this.showDeleteItem = this.showDeleteItem.bind(this);
        this.deleteSales = this.deleteSales.bind(this);
    }

    componentDidMount() {

        this.loadSalesData();
        this.storeList();
        this.customerList();
        this.productList();
    }

  // To Get Sales List
    loadSalesData() {


        $.ajax({
            url: "/Sales/GetSalesData",
            type: "GET",
            dataType: "json",
            context:this,
            success: function (data) {
                console.log(data);

                this.setState({ salesData: data, loading: false });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Uncaught Error.\n');
            }
        });
    }
    // To get all customer list 
    customerList() {
        $.ajax({
            url: "/Customers/GetCustomerList",
            type: "GET",
            dataType: "json",
            context:this,
            success: function (data) {
                console.log(data);
                this.setState({ cusList: data, loading: false });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Uncaught Error.\n');
            }
        });

    }

    // To get all store list
    storeList() {
        
        $.ajax({
            url: "/Stores/GetStoreList",
            type: "GET",
            dataType: "json",
            context:this,
            success: function (data) {
                console.log(data);
                this.setState({ strList: data, loading: false });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Uncaught Error.\n');
            }
        });
    }

    // To get all product list
    productList() {

        $.ajax({
            url: "/Products/GetProductList",
            type: "GET",
            dataType: "json",
            context:this,
            success: function (data) {
                console.log(data);
                this.setState({ proList: data, loading: false });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Uncaught Error.\n' );
            }
        });
    }

    // To display edit modal by sales Id  
    showEditModal(salesData) {
        this.setState({ proError: false, dateError: false, cusError: false, strError: false, dateValMessage: '',proValMessage: '', cusValMessage: '', strValMessage: '' });
        var dataId = { id: salesData.id }
        console.log("Inside edit method");
        $.ajax({
            url: "/Sales/GetSalesById",
            type: "GET",
            data: dataId,
            context:this,
            dataType: "json",
            success: function (data) {
                console.log(data[0].id);
                this.setState({ isOpen: true,salesEditId: data[0].id, cusEditId: data[0].customerId, strEditId: data[0].storeId, proEditId: data[0].productId, soldDate: data[0].dateSold, })
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Uncaught Error.\n');
            }
        
        }); 

    }

    //To handle customer input field 
    onCusChange(event,data) {
        this.setState({ cusEditId: data.value, cusError: false, cusValMessage: '' });
    }

    // To handle product input field 
    onProChange(event, data) {
        this.setState({ proEditId: data.value, proError: false, proValMessage:'' });
    }

    // To handle store input field 
    onStrChange(event, data) {
        this.setState({ strEditId: data.value, strError: false, strValMessage: '' });
    }

    //To handle date input field 
    ondateChange(e) {

        this.setState({ soldDate: e.target.value, dateError: false, dateValMessage: '' });
    }

    // To validate all input fields of the form 
    validateForm() {

        let cusError = false;
        let strError = false;
        let proError = false;
        let dateError = false;
        let formIsValid = true;
        let proValMessage = '';
        let cusValMessage = '';
        let strValMessage = '';
        let dateValMessage = '';

        // To check if customer field is empty
        if (this.state.cusEditId === '') {
            console.log("Name is Undefined");
            cusError = true;
            formIsValid = false;
            cusValMessage = 'Please Select Customer Name';
        }

        // To check if store field is empty
        if (this.state.strEditId === '') {
            console.log("Name is Undefined");
            strError = true;
            formIsValid = false;
            strValMessage = 'Please Select Store Name';
        }

        // To check if product field is empty
        if (this.state.proEditId === '') {
            console.log("Name is Undefined");
            proError = true;
            formIsValid = false;
            proValMessage = 'Please Select Product Name';
        }

        // To check if date field is empty
        if (this.state.soldDate === '') {

            console.log("HI");

            dateError = true;
            formIsValid = false;
            dateValMessage = 'Please Enter Date(MM/DD/YYYY)';

        }

        // Logic to validate date field 
        let date = this.state.soldDate;

        var datePat = /^(\d{2,2})(\/)(\d{2,2})\2(\d{4}|\d{4})$/;

        var matchArray = date.match(datePat);

        if (!matchArray) {
            dateError = true;
            formIsValid = false;
            dateValMessage = 'Date must be in DD/MM/YYYY format';
        }

        var day = date.substring(0, 2); // parse date into variables
        var month = date.substring(3, 5);
        var year = date.substring(6, 11);

        if (month!='' && (month < 1 || month > 12)) { // check month range
            console.log(month);
            dateError = true;
            formIsValid = false;
            dateValMessage = 'Month must be between 1 and 12';
        }
        if (day != '' && (day < 1 || day > 31)) {

            dateError = true;
            formIsValid = false;
            dateValMessage = 'Day must be between 1 and 31';
        }
        if (month != '' && ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31 )) {
            dateError = true;
            formIsValid = false;
            dateValMessage = 'Month entered does not have 31 days!';

        }

        // check for february 29th
        if (month == 2) { 
            var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
            if (day > 29 || (day == 29 && !isleap)) {
                dateError = true;
                formIsValid = false;
                dateValMessage = 'The number of days in February does not match with the year entred';

            }
        }
        this.setState(
            { dateError: dateError, proError: proError, cusError: cusError, strError: strError, proValMessage: proValMessage, cusValMessage: cusValMessage, strValMessage: strValMessage, dateValMessage: dateValMessage}
            );


            return formIsValid;
        
    }
    //To save editted or new sales record 
    saveData() {
        if (this.validateForm()) {
            this.setState({ isOpen: false });
            const item = this.state;
            console.log(item.soldDate);
            var data = { id: item.salesEditId, customerId: item.cusEditId, productId: item.proEditId, StoreId: item.strEditId, dateSold: item.soldDate }
            console.log("Inside edit method");
            $.ajax({
                url: "/Sales/SaveSalesData",
                type: "POST",
                data: data,
                context: this,
                datatype: "json",
                success: function (data) {

                    if (!data.success) {

                        alert(data.data);
                    }

                    this.loadSalesData();
                }
            });
        }
        else {

            this.setState({ isOpen: true });
        }
    }
    // To display create modal
    createSales() {

        this.setState({ isOpen: true, salesEditId: '', cusEditId: '', proEditId: '', strEditId: '', soldDate: '', proError: false, dateError: false, cusError: false, strError: false, proValMessage: '', cusValMessage: '', strValMessage: '', dateValMessage: ''});

    }
    // To display delete modal by sales Id
    showDeleteItem(index) {

        console.log(index);
        var dataId = { id: index.id }
        console.log("Inside edit method");
        $.ajax({
            url: "/Sales/GetSalesById",
            type: "POST",
            context:this,
            data: dataId,
            success: function (data) {

                this.setState({ isDelOpen: true, deleteId: data[0].id });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Uncaught Error.\n');
            }
        });

    }

    //To close edit or create modal
    onClose() {

        this.setState({ isOpen: false });
    }

    //To close delete modal
    isDelClose() {

        this.setState({ isDelOpen: false });
    }

    //To delete sales record by sales Id
    deleteSales() {

        this.setState({ isDelOpen: false });
        const item = this.state;
        console.log(item)
        var data = { id: item.deleteId }
        console.log("Inside edit method");
        $.ajax({
            url: "/Sales/DeleteSalesdata",
            type: "POST",
            context: this,
            data: data,
            datatype: "json",
            success: function (data) {
                console.log(data);
                this.loadSalesData();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Uncaught Error.\n');
            }
        });
    }
    

    render() {
      
    let button = <Button color='blue' onClick={() => this.createSales()}>Create</Button>
        var salesDatas = this.state.salesData;
        var currentPage = this.state.currentPage;
        var dataPerPage = this.state.dataPerPage;

        // Logic for displaying current pagination data
        const indexOfLastData = currentPage * dataPerPage;
        const indexOfFirstData = indexOfLastData - dataPerPage;
        const currentData = salesDatas.slice(indexOfFirstData, indexOfLastData);

        //To diplay sales list
    let contents = this.state.loading && this.state.salesDatas !== ""
        ? <p><em>Loading...</em></p>
        :<Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Product Name</Table.HeaderCell>
                    <Table.HeaderCell>Customer Name</Table.HeaderCell>
                    <Table.HeaderCell>Store Name</Table.HeaderCell>
                    <Table.HeaderCell>Sold Date</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>{currentData.map(data =>
                <Table.Row key={data.id}>
                    <Table.Cell >{data.productName}</Table.Cell>
                    <Table.Cell >{data.customerName}</Table.Cell>
                    <Table.Cell >{data.storeName}</Table.Cell>
                    <Table.Cell >{data.dateSold} </Table.Cell>
                    <Table.Cell> <Button color='yellow' onClick={() => this.showEditModal(data)}> <Icon name='edit' />Edit</Button> </Table.Cell>
                    <Table.Cell> <Button color='red' onClick={() => this.showDeleteItem(data)}><Icon name='trash' />Delete</Button></Table.Cell>

                </Table.Row>

            )}
            </Table.Body>
            </Table>

        // Edit or create modal
    let modal = < SalesModal
        isOpen={this.state.isOpen}
        onClose={this.onClose}
        isDelOpen={this.state.isDelOpen}
        isDelClose={this.isDelClose}
        salesId={this.state.salesEditId}

        dateEr={this.state.dateError}
        cusEr={this.state.cusError}
        strEr={this.state.strError}
        proEr={this.state.proError}

        proMessage={this.state.proValMessage}
        cusMessage={this.state.cusValMessage}
        strMessage={this.state.strValMessage} 
        dateMessage={this.state.dateValMessage}
        cusList={this.state.cusList}
        cusId = { this.state.cusEditId}
        cusChange={this.onCusChange}

        proId={this.state.proEditId}
        proList={this.state.proList}
        proChange={this.onProChange}

        strId = { this.state.strEditId}
        strList={this.state.strList}
        strChange={this.onStrChange}

        date={this.state.soldDate}
        dateChange={this.ondateChange}


        save={this.saveData}

        deleteSales={this.deleteSales} />

        // Pagination for the table 
        let Page =
            <Pagination
                boundaryRange={0}
                defaultActivePage={1}
                ellipsisItem={null}
                firstItem={null}
                lastItem={null}
                siblingRange={1}
                totalPages={Math.ceil(salesDatas.length / dataPerPage)}
                onPageChange={this.nextPage}
            />
        return (
         
            <div>
             <h1>Sales Details</h1>
                {button}
                {contents}
                {Page}
                {modal}
             
            </div>

        );
    }
}

export default Sales;