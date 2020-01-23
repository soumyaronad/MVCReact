import React, { Component } from 'react';
import { Button, Modal, Form, Message } from 'semantic-ui-react';

class ProModal extends Component {
    constructor(props) {
        super(props);
        
    }

 

    render() {

        //Create or edit modal
        let editModal = <Modal open={this.props.isOpen}
            centered={true}
            onClose={this.props.onClose}>
            <Modal.Header>Product Record</Modal.Header>
            <Modal.Content>
                <Form>
                    <input hidden readOnly value={this.props.id}/>
                    <Form.Field inline>
                        <label>Name</label>
                        <Form.Input placeholder='Product Name' value={this.props.name} onChange={this.props.handleName} error={this.props.nameError} />
                    </Form.Field>
                    <Form.Field>
                        {this.props.nameValMessage}
                    </Form.Field>
                    <Form.Field inline>
                        <label>Price</label>
                        <Form.Input placeholder='Product Price' value={this.props.price} onChange={this.props.handlePrice} error={this.props.priceError} />
                    </Form.Field>
                    <Form.Field>
                        {this.props.priceValMessage}
                        {this.props.priceError}
                    </Form.Field>
                    <Modal.Actions>
                    <Button onClick={this.props.onClose}>Close</Button>
                        <Button color='green' onClick={this.props.save}> Save</Button>
                    </Modal.Actions>
                </Form>


            </Modal.Content>
        </Modal>

        // Delete modal
        let deleteModal = <Modal size='tiny' open={this.props.isDelOpen} onClose={this.props.isDelClose}>
            <Modal.Header>Delete Product Record</Modal.Header>
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
                    onClick={this.props.deletePro}
                />
            </Modal.Actions>
        </Modal>
        return (
        <div>
            { editModal }
            { deleteModal }
          </div>  
        );
    }
}

export default ProModal;