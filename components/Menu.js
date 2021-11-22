import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories } from '../src/Data.jsx';

import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/';
const productEndpoint = BASE_URL + 'product/category/';
const productSearchNameEndpoint = BASE_URL + 'product/search';
const getUserCartEndpoint = BASE_URL + 'cart/user/list';
const addProductToCartEndpoint = BASE_URL + 'cart/add';
const updateCartItemEndpoint = BASE_URL + 'cart/update';
const removeCartItemEndpoint = BASE_URL + 'cart/remove';

export default function Menu(props) {
  const [categorySelected, setCategorySelected] = useState(1);
  const [products, setProducts] = useState([]);
  const [productSelected, setProductSelected] = useState([]);
  const [userCart, setUserCart] = useState([]);
  const [updated, setUpdated] = useState(false);
  const token = localStorage.getItem('user_token');
  const [quantity, setQuantity] = useState(0);
  const [userCartItemId, setUserCartItemId] = useState([]);
  const [userCartId, setUserCartId] = useState([]);

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

  const onChangeQuantity = (event) => {
    setQuantity(event.target.value);
  };

  function renderCart() {
    if (productSelected !== []) {
      return (
        <div className="box3">
          <p>hello {productSelected.name}</p>
          {productSelected.id >= 1 ? renderChoice() : <p>oh.</p>}
        </div>
      );
    } else {
    }
  }

  function addProductToCartEndpoint() {
    const params = {
      userCartId: userCartId,
      productId: productId,
      quantity: quantity,
    };

    axios
      .post(addProductToCartEndpoint, params)
      .then(async (res) => {
        console.log('done with success!!');
        setUpdated(true);
      })
      .catch((err) => console.log(err));
  }

  function updateCartItem() {
    const params = {
      userCartItemId: userCartItemId,
      quantity: quantity,
    };

    axios
      .post(updateCartItem, params)
      .then(async (res) => {
        console.log('update with success!!');
        setUpdated(true);
      })
      .catch((err) => console.log(err));
  }

  function removeCartItem() {
    axios
      .delete(removeCartItem, { params: { id: prod } })
      .then(async (res) => {
        console.log('removed with success!!');
        setUpdated(true);
      })
      .catch((err) => console.log(err));
  }

  function renderChoice() {
    if (userCartItemId == -1) {
      return (
        <div>
          <input type="text" value={quantity} onChange={onChangeQuantity} />{' '}
          <button onClick={() => addProductToUserCart()}>add to cart</button>
        </div>
      );
    } else {
      return (
        <div>
          <input type="text" value={quantity} onChange={onChangeQuantity} />{' '}
          <button onClick={() => updateCartItem()}>update</button>
          <br />
          <button onClick={() => removeCartItem()}>remove</button>
        </div>
      );
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [categorySelected]);

  useEffect(() => {
    if (userCart !== undefined) {
      setUserCartItemId(-1);
      setQuantity(0);
      for (let [key, value] of Object.entries(userCart)) {
        setUserCartId(key);
        for (var val of value) {
          if (val.productId === productSelected.id) {
            setQuantity(val.quantity);
            setUserCartItemId(val.cartItemId);
            break;
          }
        }
      }
    }
  }, [productSelected]);

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    if (token !== null) {
      axios.get(getUserCartEndpoint, config).then((res) => {
        setUserCart(res.data);
        setUpdated(true);
      });
    }
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

        {renderCart()}
      </div>
    </div>
  );
}
