import React from 'react';
import { Modal } from 'antd';
import './ModalComponent.css';
import FormComponent from '../FormComponent/FormComponent';
import PropTypes from 'prop-types';
import { validPrice } from '../../utils/validPrice';


function ModalComponent({
  isModalVisible, boundHandleOk, boundHandleCancel, selectedProduct, form
}) {
  return (
    <Modal
      open={isModalVisible}
      onOk={boundHandleOk}
      onCancel={boundHandleCancel}
      okText="Confirm Order"
    >
      {selectedProduct && (
        <>
          <div className="modal-content">
            <div className="product-image-container">
              <img
                className="product-image"
                src={selectedProduct.api_featured_image}
                alt={selectedProduct.name}
              />
            </div>
            <div className="product-details">
              <p className="orderDetails"><strong>Order Details:</strong></p>
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Price:</strong> {validPrice(selectedProduct.price)}</p>
              <p><strong>Brand:</strong> {selectedProduct.brand || 'none'}</p>
              <p><strong>Type:</strong> {selectedProduct.product_type || 'none'}</p>
              <p><strong>Category:</strong> {selectedProduct.category || 'none'}</p>
            </div>
          </div>

          <FormComponent form={form} selectedProduct={selectedProduct} />
        </>
      )}
    </Modal>
  )
}

ModalComponent.propTypes = {
  isModalVisible: PropTypes.bool.isRequired,
  boundHandleOk: PropTypes.func.isRequired,
  boundHandleCancel: PropTypes.func.isRequired,
  selectedProduct: PropTypes.object,
  form: PropTypes.object.isRequired
};

export default ModalComponent;