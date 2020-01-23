import React, { Component } from 'react';
import { Button, Modal, Form, Dropdown } from 'semantic-ui-react';
class SalesModal extends Component {
    constructor(props) {
        super(props);
   
    }
    render() {

        //Create or edit modal
        let editModal = <Modal open={this.props.isOpen}
            centered={true}
            onClose={this.props.onClose}>
            <Modal.Header>Sales Record</Modal.Header>
            <Modal.Content>
                <Form>
                    <input hidden readOnly value={this.props.salesId} />
                    <Form.Field inline>
                        <label>Customer Name</label>
                        <br></br>
                        <Dropdown
                            error={this.props.cusEr}
                            placeholder='Select Customers' options={this.props.cusList} selection onChange={this.props.cusChange} value={this.props.cusId} />
                    </Form.Field>
                    <Form.Field>
                        {this.props.cusMessage}
                    </Form.Field>
                    <Form.Field inline>
                        <label>Product Name</label>
                        <br></br>
                        <Dropdown
                            error={this.props.proEr}
                         placeholder='Select Products' options={this.props.proList} selection onChange={this.props.proChange} value={this.props.proId} />
                    </Form.Field>
                    <Form.Field>
                        {this.props.proMessage}
                    </Form.Field>

                    <Form.Field inline>
                        <label>Store Name</label>
                        <br></br>
                        <Dropdown
                            error={this.props.strEr}
                            placeholder='Select Stores' options={this.props.strList} selection onChange={this.props.strChange} value={this.props.strId} />
                    </Form.Field>
                    <Form.Field>
                        {this.props.strMessage}
                    </Form.Field>
                    <Form.Field inline>
                        <label>Date Sold</label>
                        <Form.Input placeholder='MM /DD/YYYYY' value={this.props.date} onChange={this.props.dateChange} error={this.props.dateEr} />
                    </Form.Field>
                    <Form.Field>
                        {this.props.dateMessage}
                    </Form.Field>
                    <Modal.Actions>
                        <Button onClick={this.props.onClose}>Close</Button>
                        <Button color='green' onClick={this.props.save}>Save</Button>
                    </Modal.Actions>
                </Form>


            </Modal.Content>
        </Modal>

        // Delete Modal
        let deleteModal = <Modal size='tiny' open={this.props.isDelOpen} onClose={this.props.isDelClose}>
            <Modal.Header>Delete Sales Record</Modal.Header>
            <Modal.Content>
                <input hidden readOnly value={this.props.deleteId} />
                <p>Are you sure you want to delete this record</p>
            </Modal.Content>
            <Modal.Actions>
                <Button negative onClick={this.props.isDelClose}>No</Button>
                <Button
                    positive
                    icon='checkmark'
                    labelPosition='right'
                    content='Yes'
                    onClick={this.props.deleteSales}
                />
            </Modal.Actions>
        </Modal>

        return (
            <div>
                {editModal}
                {deleteModal}
            </div>
        );
    }
}

export default SalesModal;