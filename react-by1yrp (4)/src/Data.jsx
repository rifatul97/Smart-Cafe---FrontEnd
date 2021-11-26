import axios from 'axios';
import React, { useEffect, useState } from 'react';

const url = 'http://localhost:8080/api/product/categories';
const productEndpoint = 'http://localhost:8080/api/product/category/';

export function getCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(url)
      .then(async (res) => {
        //console.log(res);
        setCategories(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return categories;
}
export function getUserCart() {
  return <p> hello world </p>;
}
