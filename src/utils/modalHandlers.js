import { message } from 'antd';

export const handleOk = (form, setIsModalVisible) => {

  form.validateFields()
    .then(() => {
      message.destroy();
      message.success('Your order has been placed successfully. We will contact you shortly!', 5);
      setIsModalVisible(false);
      form.resetFields();
    })
    .catch(info => {
      console.log('Validate Failed:', info);
    });
};

export const handleCancel = (form, setIsModalVisible) => {
  form.resetFields();
  setIsModalVisible(false);
};

export const handleOrder = (setSelectedProduct, setIsModalVisible) => (record) => {
  message.destroy();
  setSelectedProduct(record);
  setIsModalVisible(true);
};