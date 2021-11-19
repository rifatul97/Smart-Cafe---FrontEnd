import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout({setToken}) {
  const navigate = useNavigate();

  const removeToken = () => {
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_token_decoded')
    setToken()
    navigate('/home')
  }

  return (
    <div>
      {removeToken(setToken)}
    </div>
  );
}

export default Logout;
