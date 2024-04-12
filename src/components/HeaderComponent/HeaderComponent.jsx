import React from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

function HeaderComponent() {
  return (
    <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa', padding: '0 26px' }}>
      <a href="/" className="logo" style={{ color: 'black', fontWeight: 'bold', fontSize: '24px' }}>
        Grandia Solutions
      </a>
    </Header>
  );
}

export default HeaderComponent;