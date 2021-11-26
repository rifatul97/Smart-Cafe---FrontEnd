import React, { useEffect, useState } from "react";
import ProductListTable from "./ProductListTable.js";

export default function CheckOut({ userCartData }) {
  return (
    <div>
      {userCartData === undefined ? (
        <p>hey its illegal!</p>
      ) : (
        renderUserCart(userCartData)
      )}
    </div>
  );
}

function renderUserCart(data) {
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");

  const handleAccountNumberChange = (event) => {
    setAccountNumber(event.target.value);
  };

  const handleRoutingNumberChange = (event) => {
    setRoutingNumber(event.target.value);
  };

  return (
    <div className="checkoutBox">
      <div className="box1">
        <p>Account Number: </p>
        <input value={accountNumber} onChange={handleAccountNumberChange} />
        <p>Routing Number: </p>
        <input value={routingNumber} onChange={handleRoutingNumberChange} />
        <br />
        <button>Submit</button>
      </div>
      <div className="box2">
        <p> You have selected the following items: </p>
        <br />
        <ProductListTable rows={data} />
      </div>
    </div>
  );
}
