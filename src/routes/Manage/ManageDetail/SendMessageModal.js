import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

const SendMessageModal = ({ onOk, checkboxOptions, ...modalProps }) => {
  const defaultValues = checkboxOptions.map(option => {
    switch(typeof option) {
      case 'string':
        return option;
      case 'object':
        if(option.hasOwnProperty('value')) {
          return option['value'];
        } else {
          throw new Error('checkboxOption should be arrayOf({label, value})');
        }
      default:
        throw new Error('checkboxOption should be arrayOf({label, value}) or arrayOf(string)');
    }
  });

  let values = [...defaultValues];

  const onChange = checkedValues => {
    values = [...checkedValues];
  };

  const handleOk = () => {
    onOk(values);
  };

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <CheckboxGroup options={checkboxOptions} defaultValue={defaultValues} onChange={onChange} />
    </Modal>
  );
};

SendMessageModal.propTypes = {
  onOk: PropTypes.func,
  checkboxOptions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object]))
    .isRequired,
};

export default SendMessageModal;
