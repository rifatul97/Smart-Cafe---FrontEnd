import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories } from '../src/Data.jsx';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/';
const productEndpoint = BASE_URL + 'product/category/';
const productSearchNameEndpoint = BASE_URL + 'product/search';
const getUserCartEndpoint = BASE_URL + 'cart/user/';
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
  const [userCartProductList, setUserCartProductList] = useState([]);
  const [open, setOpen] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams({ replace: true });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let categories = getCategories();

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
      cartId: userCartId,
      quantity: quantity,
    };

    axios
      .post(updateCartItemEndpoint, params)
      .then(async (res) => {
        setUpdated(true);
      })
      .catch((err) => console.log(err));

    setOpen(false);
  }

  function removeCartItem() {
    axios
      .post(removeCartItemEndpoint, { params: { cartId: userCartItemId } })
      .then(async (res) => {
        setUpdated(true);
      })
      .catch((err) => console.log(err));
    setOpen(false);
  }

  function renderChoice() {
    if (userCartItemId == -1) {
      return (
        <div>
          <input type="text" value={quantity} onChange={onChangeQuantity} />{' '}
          <Button
            onClick={() => addProductToCart()}
            startIcon={<AddShoppingCartIcon />}
          />
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
            />
            <Button
              variant="outlined"
              startIcon={<RemoveShoppingCartIcon />}
              onClick={() => removeCartItem()}
            />
          </Stack>
        </div>
      );
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [categorySelected]);

  useEffect(() => {
    if (userCart.length !== 0) {
      setUserCartItemId(-1);
      setQuantity(0);
      console.log(userCart.dtos);
      for (var val of Object.entries(userCart.dtos)) {
        console.log('val = ' + val);
        if (val.productId === productSelected.id) {
          setQuantity(val.quantity);
          setUserCartItemId(val.cartItemId);
          break;
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
    if (userCart === []) {
      return (
        <div>
          <p>hey create account to track cart!</p>
        </div>
      );
    } else if (userCart.status == 'PENDING') {
      return (
        <div>
          <p>thank you for ordering, you can still update/remove orders!</p>
        </div>
      );
    } else if (userCart.status === 'FULLFILLING') {
      <div>
        <p>hang in there!, your order is in the works!</p>
      </div>;
    } else {
      <p>-NEW CART-</p>;
      //<div>{userCartProductList}</div>;
    }
  }

  const handleProductClickAction = (val) => {
    setProductSelected(val);
    setOpen(true);
  };

  ////
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    if (token !== null) {
      axios.get(getUserCartEndpoint, config).then((res) => {
        setUserCart(JSON.stringify(res.data));
        setUserCartId(JSON.stringify(res.data.usercartid));
        props.setCanCheckOut(true);

        setUpdated(false);
      });

      const params = {
        usercartid: userCart.usercartid,
        status: usercart.status,
      };

      axios.get(getUserCartProductListEndpoint, config, params).then((res) => {
        console.log('UserCartProductRequestDto is ' + res);
        setUserCartProductList(res.data);
      });*
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
        <div
          className="box2"
          key={categorySelected}
          style={{ borderRight: 'solid 1px', padding: '1rem' }}
        >
          <div class="row">
            <div
              class="column"
              style={{ 'flex-flow': 'row wrap', padding: '5px' }}
            >
              {products.map((product) => (
                <Card
                  sx={{ display: 'flex' }}
                  onClick={() => handleProductClickAction(product)}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Stack direction="column" spacing={2}>
                        <Typography component="div" variant="h5">
                          {product.name}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          component="div"
                        >
                          <strong style={{ 'font-size': '18px' }}>
                            $ {product.price}{' '}
                          </strong>
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Box>
                  <CardMedia
                    component="img"
                    sx={{ width: 151 }}
                    image="https://www.qualitylogoproducts.com/images/_graphics/QuickShipBox.png?size=thumb_retina"
                    //alt={product.name}
                  />
                </Card>
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
          {userCart === undefined ? <p>undefined!!!</p> : renderUserCartList()}
        </div>
        ;
      </div>
    </div>
  );
}
