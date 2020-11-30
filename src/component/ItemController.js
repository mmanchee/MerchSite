import React from "react";
import ListView from "./ListView";
import EditItemForm from "./EditItemForm";
import NewItemForm from "./NewItemForm";
import ItemDelete from "./ItemDelete";
import ItemDetail from './ItemDetail';
import { connect } from 'react-redux';
import PropTypes from "prop-types";

class ItemController extends React.Component{
  
  constructor(props){
    super(props)
    this.state = {
      formVisibleOnPage: false,
      selectedItem: null,
      editing: false
    }
  }
  //event handlers
  handleEditingItemInList = (itemToEdit) => { // editing item in actual array
    const { dispatch } - this.props;
    const { name, description, quantity, id } = itemToEdit;
    const action = {
      type: 'ADD_ITEM',
      Id: id,
      Name: name,
      Description: description,
      Quantity: quantity
    }
    dispatch(action);
    this.setState({
      editing: false,
      selectedItem: null
    });
  }

  handleEditClick = () => { // sets items to edit
    this.setState({editing: true});
  }

  handleDeletingItem = (id) => { /// deletes item from array
    const { dispatch } = this.props;
    const action = {
      type: 'DELETE_ITEM',
      Id: id
    }
    dispatch(action);
    this.setState({selectedItem: null});
  }

  handleClick = () => {  // sets state to normal
    if (this.state.selectedItem != null) {
      this.setState({
        formVisibleOnPage: false,
        selectedItem: null,
        editing: false
      });
    } else {
      this.setState(prevState => ({
        formVisibleOnPage: !prevState.formVisibleOnPage,
      }));
    }
  }

  handleChangingSelectedItem = (id) => { // view item in Detail
    const selectedItem = this.state.itemCatalog
      .filter(item => item.id === id)[0];
    this.setState({selectedItem});
  }

  handleAddingNewItemToList = (newItem) => { // adds new item to Array
    const { dispatch } = this.props;
    const { name, description, quantity, id } = newItem;
    const action = {
      type: 'ADD_ITEM',
      Id: id,
      Name: name,
      Description: description,
      Quantity: quantity
    }
    dispatch(action);
    this.setState({formVisibleOnPage: false});
  }

  handleChangeItemQuantityClick =  (itemToEdit) => {
    const editedItemCatalog = this.state.itemCatalog
      .filter(item => item.id !== this.state.selectedItem.id)
      .concat(itemToEdit);
    this.setState({
      itemCatalog: editedItemCatalog,
    });
  }

  render(){
    let currentlyVisibleState = null;
    let buttonText = null;
    if (this.state.editing) { // edit
      currentlyVisibleState = <EditItemForm 
        item = {this.state.selectedItem} 
        onEditItem =  {this.handleEditingItemInList}/>
      buttonText = "Return to Item List";
    } else if (this.state.selectedItem !== null) { // delete and edit
      
      currentlyVisibleState = <ItemDetail 
        item = {this.state.selectedItem} 
        onClickingDelete = {this.handleDeletingItem} 
        onClickingEdit = {this.handleEditClick}
        onChangeItemQuantityClick = {this.handleChangeItemQuantityClick} 
        />
      buttonText = "Return to Item List";
    } else if (this.state.formVisibleOnPage) { // catch is set
      currentlyVisibleState = <NewItemForm 
        onNewItemCreation={this.handleAddingNewItemToList} />
      buttonText = "Return to Item List";
    } else {                                // default
      currentlyVisibleState = <ListView 
        Items={this.state.itemCatalog} 
        onItemSelection={this.handleChangingSelectedItem} />;
      buttonText = "Add Item";
    }
    
    return (
      <React.Fragment>
        {this.state.itemCatalog[0] === undefined && 
          currentlyVisibleState.props.Items !== undefined ? "There are no items currently in the store" : ""}
        {currentlyVisibleState}
        <button onClick={this.handleClick}>{buttonText}</button>
      </React.Fragment>
    );
  }
}
ItemController.propTypes ={
  itemCatalog:PropTypes.object
};

const mapStateToProps = state => {
  return {
    itemCatalog: state
  }
}

ItemController = connect(mapStateToProps(ItemController);

export default ItemController;