import React, { Component} from 'react';
import { Icon, Table, Pagination  } from 'semantic-ui-react';
import { Button} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import ProModal from './ProModal';
import $ from 'jquery'; 

export class FetchData extends Component {
    static displayName = FetchData.name;

    constructor() {
        super();

        this.replaceModalItem = this.replaceModalItem.bind(this);
        this.showDeleteItem = this.showDeleteItem.bind(this);
        this.saveData = this.saveData.bind(this);
        this.validateForm = this.validateForm.bind(this);

        this.state = {
            currentPage: 1,dataPerPage: 10, proDatas: [], nameError: false, priceError: false, loading: true, isOpen: false, isClose: false, isDelOpen: false, name: '', price: '', id: '', deleteId: '', nameValMessage: '', priceValMessage: '' };

        this.closeModal = this.closeModal.bind(this);
        this.onDelClose = this.onDelClose.bind(this);

        this.handlePrice = this.handlePrice.bind(this);
        this.handleName = this.handleName.bind(this);

        this.createPro = this.createPro.bind(this);
        this.deletePro = this.deletePro.bind(this);
        this.nextPage = this.nextPage.bind(this);

    }

    componentDidMount() {
        
            this.loadProdData();
    }

    componentDidUpdate() {

    }

    // To get product list
    loadProdData() {
        $.ajax({
            url: "/Products/GetProductData",
            type: "GET",
            dataType: "json",
            context:this,
            success: function (data) {
                console.log(data);
                this.setState({ proDatas: data, loading: false });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Uncaught Error.\n' + textStatus);
            }
        });
    }

    // Close edit/create popup modal
    closeModal() {

        this.setState({ isOpen: false });
    }

    // Close delete modal
    onDelClose() {

        this.setState({ isDelOpen: false });
    }

    //Create new product record
    createPro() {
        this.setState({ isOpen: true, id: '', name: '', price: '', nameError: false, priceError: false, nameValMessage: '', priceValMessage: ''});
    }

    // Show edit popup Modal with data
    replaceModalItem(index) {
        this.setState({ nameError: false, priceError: false, nameValMessage: '', priceValMessage: '' });
        var dataId = { id: index.id }
        console.log("Inside edit method");
        $.ajax({
            url: "/Products/GetProductById",
            type: "POST",
            data: dataId,
            context:this,
            success: function (data) {
                this.setState({ isOpen:true, id: data.id, name: data.name, price: data.price });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Uncaught Error.\n');
            }
        });
 
    }


    // Display delete modal by Product Id
    showDeleteItem(index) {

        console.log(index);
        var dataId = { id: index.id }
        console.log("Inside edit method");
        $.ajax({
            url: "/Products/GetProductById",
            type: "POST",
            data: dataId,
            context:this,
            success: function (data) {
                
                this.setState({ isDelOpen: true, deleteId: data.id });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Uncaught Error.\n');
            }
        });

    }

    // delete product record by Id 
    deletePro() {

        this.setState({ isDelOpen: false });
        const item = this.state;
        console.log(item)
        var data = { id: item.deleteId }
        console.log("Inside edit method");
        $.ajax({
            url: "/Products/DeleteProductdata",
            type: "POST",
            data: data,
            context:this,
            datatype: "json",
            success: function (data) {
                console.log(data);
                this.loadProdData();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Uncaught Error.\n');
            }
        });

    }

    // Handle input data for name 
    handleName(e) {

        this.setState({ name: e.target.value});  
      
    }

    //Handle input data for price 
    handlePrice(e) {

        this.setState({ price: e.target.value });
        
    }

    // To Validate form inputs  
    validateForm() {

        let nameEr=false;
        let priceEr = false;
        let formIsValid = true;
        let nameValMessage='';
        let priceValMessage='';
        console.log("inside validateForm Method")

        // validate if name field is empty
        if (this.state.name === '') {
            console.log("Name is Undefined");
            nameEr = true;
            formIsValid = false;
            nameValMessage = 'Please Enter Name';
        }

        //validate if name field has only Alphabet Characters
        if (!this.state.name.match(/^[a-zA-Z ]*$/))
            {
            nameEr = true;
            formIsValid = false;
            nameValMessage = 'Please Enter Alphabet Characters Only';
        }

        // validate if price field is empty
        if (this.state.price === '')
        {

            console.log("HI");

            priceEr = true;
            formIsValid = false;
            priceValMessage = 'Please Enter Price';
          console.log(priceValMessage);
        }

        //validating price field 
        let price = this.state.price;
        if (!String(price).match(/^\d+(\.\d{1,2})?$/) )
        {
            priceEr = true;
            formIsValid = false;
            priceValMessage = 'Please Enter Numbers Only';            
        }

        this.setState(
            { nameError: nameEr, priceError: priceEr, nameValMessage: nameValMessage, priceValMessage: priceValMessage }
             );
        return formIsValid;
    }

    // To save editted or new product record 
    saveData() {
        
        if (this.validateForm()) {
            this.setState({ isOpen: false });
            console.log(this.state.isOpen);
            const item = this.state;
            console.log(item);
            var data = { id: item.id, name: item.name, price: item.price }
            console.log("Inside edit method");
            $.ajax({
                url: "/Products/SaveProductdata",
                type: "POST",
                data: data,
                context: this,
                datatype: "json",
                success: function (data) {
                    this.loadProdData();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert('Uncaught Error.\n');
                }
            });

        }

        else {
            console.log(this.state.nameError);
            this.setState({ isOpen: true });

        }
    }
    // Handle click for pagination 
    nextPage(event, data ) {

        console.log(data.activePage);
        this.setState({ currentPage: data.activePage });
    }
    

    render() {

         
        let button = <Button color='blue' onClick={() => this.createPro()}>Create</Button>
        var proDatas = this.state.proDatas;
        var currentPage = this.state.currentPage;
        var dataPerPage = this.state.dataPerPage;

         // Logic for displaying current pagination data
        const indexOfLastData = currentPage * dataPerPage;
        const indexOfFirstData = indexOfLastData - dataPerPage;
        const currentData = proDatas.slice(indexOfFirstData, indexOfLastData);

     
        // To display prodcut list 
        let contents = this.state.loading && this.state.proDatas!==""
            ? <p><em>Loading...</em></p>
            :
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Price ($)</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>{currentData.map(proData =>
                    <Table.Row key={proData.id} id={proData.id}>
                        <Table.Cell >{proData.name} </Table.Cell>
                        <Table.Cell >{proData.price}</Table.Cell>
                        <Table.Cell> <Button color='yellow' onClick={() => this.replaceModalItem(proData)} > <Icon name='edit' />Edit</Button> </Table.Cell>
                        <Table.Cell> <Button color='red' onClick={() => this.showDeleteItem(proData)}><Icon name='trash'/>Delete</Button></Table.Cell>

                    </Table.Row>

                )}
                </Table.Body>
            </Table>
        // Edit or create modal
        let modal = < ProModal
            isOpen={this.state.isOpen}
            isDelOpen={this.state.isDelOpen}
            onClose={this.closeModal}
            isDelClose={this.onDelClose}
            deleteId={this.deleteId}
            id={this.state.id}
            name={this.state.name}
            price={this.state.price}
            save={this.saveData}
            handleName={this.handleName}
            handlePrice={this.handlePrice}
            deletePro={this.deletePro}
            nameError={this.state.nameError}
            priceError={this.state.priceError}
            nameValMessage={this.state.nameValMessage}
            priceValMessage={this.state.priceValMessage}
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
                totalPages={Math.ceil(proDatas.length / dataPerPage)}
                onPageChange={this.nextPage}
            />
            
        
        return (
            <div>
                <h1>Product Details</h1>
                {button}
                {contents}
                {Page}
                {modal}
            </div>

        );
    }
}

export default FetchData;