import React, { useEffect, useState } from 'react';

export default function CheckOut(props) {
  return (
    <div>
      <p>You have selected</p>
      <ProductListTable rows={props.data}
    </div>
  );
}
