import React from 'react';
import './FooterComponent.css';
import { Layout } from 'antd';

const { Footer } = Layout;

function FooterComponent() {
  return (
    <Footer className="footer">
      <div className="contact-us">
        <p>Contact us:</p>
        <a href="mailto:dmytro.fefelov@gmail.com" target="_blank" rel="noopener noreferrer">Gmail</a>
        <a href="https://t.me/reseneweb" target="_blank" rel="noopener noreferrer">Telegram</a>
        <a href="https://www.linkedin.com/in/dmytro-fefelov" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://github.com/reseneweb" target="_blank" rel="noopener noreferrer">Github</a>
      </div>
    </Footer>
  );
}

export default FooterComponent;
