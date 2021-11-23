import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories } from '../src/Data.jsx';
//import 'antd/dist/antd.css';
import DeleteIcon from '@mui/icons-material/Delete';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const showModal = () => {
    console.log('hll');
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
      return <div className="box3"></div>;
    } else {
    }
  }

  function addProductToCart() {
    const params = {
      userCartId: userCartId,
      productId: productSelected.id,
      quantity: quantity,
    };

    axios
      .post(addProductToCartEndpoint, params)
      .then(async (res) => {
        console.log('done with success!!');
        setUpdated(true);
      })
      .catch((err) => console.log(err));

    setOpen(false);
  }

  function updateCartItem() {
    const params = {
      cartId: userCartItemId,
      quantity: quantity,
    };

    axios
      .post(updateCartItemEndpoint, params)
      .then(async (res) => {
        console.log('update with success!!');
        setUpdated(true);
        setOpen(false);
      })
      .catch((err) => console.log(err));
  }

  function removeCartItem() {
    console.log(userCartItemId);
    axios
      .post(removeCartItemEndpoint, { params: { cartId: userCartItemId } })
      .then(async (res) => {
        console.log('removed with success!!');
        //setQuantity(0)
        setUpdated(true);
        setOpen(false);
      })
      .catch((err) => console.log(err));
    setOpen(false);
  }

  function renderChoice() {
    if (userCartItemId == -1) {
      return (
        <div>
          <input type="text" value={quantity} onChange={onChangeQuantity} />{' '}
          <Button onClick={() => addProductToCart()} startIcon={<AddIcon />}>
            add to cart
          </Button>
        </div>
      );
    } else {
      return (
        <div>
          <Stack direction="row" spacing={2}>
            <input type="text" value={quantity} onChange={onChangeQuantity} />
            <Button
              variant="contained"
              onClick={() => updateCartItem()}
              endIcon={<EditIcon />}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => removeCartItem()}
            >
              Remove
            </Button>
          </Stack>
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

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  function renderUserCartList() {
    return (
      <div>
        <p>hey create account to track cart!</p>
      </div>  
    )
  }

  const handleclick = (val) => {
    setProductSelected(val);
    setOpen(true);
    console.log('wooo');
  };

  useEffect(() => {
    console.log('yes updating..');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    if (token !== null) {
      axios.get(getUserCartEndpoint, config).then((res) => {
        setUserCart(res.data);

        console.log(res.data);
        props.setCanCheckOut(true);

        setUpdated(false);
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
                  onClick={() => handleclick(product)}
                  key={product.id}
                >
                  <h3>{product.name}</h3>
                  <br />
                  <p>{product.price}</p>
                </div>
              ))}

              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <Fade in={open}>
                  <Box sx={style}>
                    <Typography
                      id="transition-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      {productSelected.name}
                    </Typography>
                    <Typography
                      id="transition-modal-description"
                      sx={{ mt: 2 }}
                    >
                      {productSelected.id >= 1 ? renderChoice() : <p></p>}
                    </Typography>
                  </Box>
                </Fade>
              </Modal>
            </div>
          </div>
        </div>

        <div className="box3">
          {renderUserCartList()}
          </div>;
      </div>
    </div>
  );
}
