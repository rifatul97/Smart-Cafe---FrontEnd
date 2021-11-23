import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function TopNavBar(props) {
  const token = localStorage.getItem('user_token');
  
  

  const renderSwitch = (param) => {
    //console.log(param);
    if (param.includes('ROLE_ADMIN')) {
      return <Link to="/dashboard">Dashboard </Link>;
    }
    return <Link to="/contact">Contact </Link>;
  };

  var check = () => {
    if (localStorage.getItem('user_token_decoded') !== null) {
      var obj = JSON.parse(localStorage.getItem('user_token_decoded'));
      return obj.roles;
    }
    return '';
  };

  return (
    <div>
      <h1>Smart Cafe</h1>
      <nav style={{ borderBottom: 'solid 1px', paddingBottom: '1rem' }}>
        <Link to="/home">Home</Link> | <Link to="/menu">Menu</Link> |{' '}
        {check !== '' ? renderSwitch(check()) : ''}| {renderLog(token)} {props.canCheckOut ? '|' : ''} {props.canCheckOut ? <Link to="/checkout">Checkout</Link> : ''}
      </nav>
      <Outlet />
    </div>
  );
}

function renderLog(token) {
  //console.log('props.token = ' + token);
  switch (token) {
    case '':
      return <Link to="/login">Login</Link>;
    case undefined:
      return <Link to="/login">Login</Link>;
    case null:
      return <Link to="/login">Login</Link>;
    default:
      return <Link to="/logout">Logout</Link>;
  }
}

export default TopNavBar;
