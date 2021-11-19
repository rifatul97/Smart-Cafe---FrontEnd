import React, { useEffect, useState } from 'react';
import destr from 'destr';
import { useSearchParams } from 'react-router-dom';
import { getCategories } from '../src/Data.jsx';
import { Card, ImageHeader, CardBody, CardFooter } from 'react-simple-card';
import jwt_decode from 'jwt-decode';

import axios from 'axios';

const productEndpoint = 'http://localhost:8080/api/product/category/';
const getUserCartEndpoint = 'http://localhost:8080/api/cart/user/2/list';

export default function Menu(props) {
  const [categorySelected, setCategorySelected] = useState(1);
  const [products, setProducts] = useState([]);
  const [productSelected, setProductSelected] = useState([]);
  const [userCart, setUserCart] = useState([]);
  const [updated, setUpdated] = useState(true);

  let categories = getCategories();

  let [searchParams, setSearchParams] = useSearchParams({ replace: true });

  function onClicked(id) {
    setCategorySelected(id);
  }

  const fetchProducts = () => {
    axios
      .get(productEndpoint, { params: { id: categorySelected } })
      .then(async (res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchProducts();
  }, [categorySelected]);

  useEffect(() => {
    axios.get();
  }, [productSelected]);

  useEffect(() => {
    axios.get(getUserCartEndpoint).then(async (res) => {
      setUserCart(res.data);
    });
    setUpdated(false);
  }, [updated]);

  return (
    <div className="container">
      <div className="box1">
        <nav style={{ borderRight: 'solid 1px', padding: '1rem' }}>
          <input
            value={searchParams.get('filter') || ''}
            onChange={(event) => {
              let filter = event.target.value;
              if (filter) {
                setSearchParams({ filter }, { replace: true });
              } else {
                setSearchParams({}, { replace: true });
              }
            }}
          />
          <br />
          {categories
            .filter((category) => {
              let filter = searchParams.get('filter');
              if (!filter) return true;
              let name = category.name.toLowerCase();
              return name.startsWith(filter.toLowerCase());
            })
            .map((category) => (
              <a
                key={category.id}
                style={{
                  display: 'block',
                  margin: '1rem 0',
                  textIndent: '3em',
                }}
                onClick={() => onClicked(category.id)}
              >
                {category.name}
              </a>
            ))}
        </nav>

        <div className="box2" key={categorySelected}>
          <div class="row">
            <div class="column">
              {products.map((product) => (
                <div
                  class="card"
                  onClick={() => setProductSelected(product)}
                  key={product.id}
                >
                  <h3>{product.name}</h3>
                  <br />
                  <p>{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {renderCart(productSelected)}
      </div>
    </div>
  );
}

function renderCart(product) {
  if (product !== []) {
    return (
      <div className="box3">
        <p>hello {product.name}</p>
      </div>
    );
  } else {
  }
}
