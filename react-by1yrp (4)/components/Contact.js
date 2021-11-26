import React, { useEffect, useState } from 'react';

function Contact() {
  return (
    <div>
      <p>Contact number is {JSON.parse(localStorage.getItem('user_token'))}</p>
    </div>
  );
}

export default Contact;
