import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories } from '../src/Data.jsx';

import axios from 'axios';

const productEndpoint = 'http://localhost:8080/api/product/category/';
const getUserCartEndpoint = 'http://localhost:8080/api/cart/user/list';

export default function Menu(props) {
  const [categorySelected, setCategorySelected] = useState(1);
  const [products, setProducts] = useState([]);
  const [productSelected, setProductSelected] = useState([]);
  const [userCart, setUserCart] = useState([]);
  const [updated, setUpdated] = useState(false);
  const token = localStorage.getItem('user_token');
  const [quantity, setQuantity] = useState(0);
  const [userCartItemId, setUserCartItemId] = useState([]);
  const [userCartId, setUserCartId] = useState([])

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

  function renderChoice() {
    if (userCartItemId == -1) {
      return (
        <div>
          <input type="text" value={quantity} onChange={onChangeQuantity} />{' '}
          <button>add to cart</button>
        </div>
      );
    } else {
      return (
        <div>
          <input type="text" value={quantity} onChange={onChangeQuantity} />{' '}
          <button>remove </button>
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
