import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { SidePanel } from './';

export default function Layout({ children }) {
  return (
    <div className="search-layout">
      <SidePanel />
      <div className="examples-page-container">{children}</div>
    </div>
  );
};

Layout.propTypes = {};
Layout.defaultProps = {};
