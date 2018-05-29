import React from 'react';
import PropTypes from 'prop-types'
import styles from './PageHeaderLayout.less';

const PageHeaderLayout = ({ wrapperClassName, title, extraContent, children, ...restProps }) => (
  <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
    <h1 className={styles.title}>{title}</h1>
    {extraContent ? <div className={styles.extra}>{extraContent}</div> : null}
    {children ? <div className={styles.content}>{children}</div> : null}
  </div>
);

PageHeaderLayout.propTypes = {
  title: PropTypes.string.isRequired
};

export default PageHeaderLayout;
