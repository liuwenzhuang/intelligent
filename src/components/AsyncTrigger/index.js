import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

const AsyncTrigger = ({loading = false, children}) => {
  return loading ? (
    <span>
      <Spin size="small" />
    </span>
  ) : children;
};

AsyncTrigger.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.object,
};

export default AsyncTrigger;
