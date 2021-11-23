import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout(props) {
  const navigate = useNavigate();

  const removeToken = () => {
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_token_decoded')
    props.setCanCheckOut(false)
    props.setToken()
    navigate('/home')
  }

  return (
    <div>
      {removeToken(props)}
    </div>
  );
}

export default Logout;
