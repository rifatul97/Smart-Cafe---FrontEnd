import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function TopNavBar(props) {
  const curtoken = props.token;

  const renderSwitch = (param) => {
    console.log(param);
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
        {check !== '' ? renderSwitch(check()) : ''}|{' '}
        {props.token !== '' ? (
          <Link to="/logout">Logout</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
      <Outlet />
    </div>
  );
}

export default TopNavBar;
