import React, { useEffect, useState } from 'react';

function RegisterForm() {
  /*{https://www.w3schools.com/html/tryit.asp?filename=tryhtml_form_legend}'*/
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit() {
    console.log('hhh');
  }

  return (
    <div>
      <form>
        <label onSubmit={handleSubmit()}>
          username: <input type="text" name="username" /> <br /> <br />
          password: <input type="text" name="username" />{' '}
        </label>
        <br />
        <input type="submit" value="submit" />
      </form>
    </div>
  );
}

export default RegisterForm;
