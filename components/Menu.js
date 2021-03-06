import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories } from '../src/Data.jsx';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import ProductListTable from './ProductListTable.js';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from 'react-router-dom';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/';
const productEndpoint = BASE_URL + 'product/category/';
const getUserCartProductListEndpoint = BASE_URL + 'cart/user/list';
const productSearchNameEndpoint = BASE_URL + 'product/search';
const getUserCartEndpoint = BASE_URL + 'cart/user';
const addProductToCartEndpoint = BASE_URL + 'cart/add';
const updateCartItemEndpoint = BASE_URL + 'cart/update';
const removeCartItemEndpoint = BASE_URL + 'cart/remove';

export default function Menu(props) {
  const [categorySelected, setCategorySelected] = useState(1);
  const [products, setProducts] = useState([]);
  const [productSelected, setProductSelected] = useState([]);
  const [userCart, setUserCart] = useState([]);
  const [userId, setUserId] = useState();
  const [updated, setUpdated] = useState(false);
  const token = localStorage.getItem('user_token');
  const [quantity, setQuantity] = useState(0);
  const [userCartItemId, setUserCartItemId] = useState([]);
  const [userCartId, setUserCartId] = useState([]);
  let [userCartStatus, setUserCartStatus] = useState('');
  const [allProducts, setAllProducts] = useState();
  const [userCartProductList, setUserCartProductList] = useState([]);
  const [open, setOpen] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams({ replace: true });
  const navigate = useNavigate();
  const [guestUserCart, setGuestUserCart] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let categories = getCategories();

  function onClicked(id) {
    setCategorySelected(id);
  }

  useEffect(() => {
    axios.get(productsEndpoint).then(async (res) => {
      setAllProducts(res.data);
    });
  }, allProducts);

  const fetchProducts = () => {
    axios
      .get(productEndpoint, { params: { id: categorySelected } })
      .then(async (res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  };

  const productsEndpoint = 'http://localhost:8080/api/products';

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

  //x
  useEffect(() => {
    if (userCart.length !== 0) {
      console.log('er = ' + userCart);
      setUserCartItemId(-1);
      setQuantity(0);
      console.log(userCart);
      for (var val of userCart) {
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
    if (userCartStatus === '' || guestUserCart === []) {
      return (
        <div>
          <p>Your cart is empty</p>
        </div>
      );
    } else if (userCartStatus == 'PENDING') {
      return (
        <div>
          <p>thank you for ordering, you can still update/remove orders!</p>
        </div>
      );
    } else if (userCart.status === 'FULLFILLING') {
      return (
        <div>
          <p>hang in there!, your order is in the works!</p>
        </div>
      );
    } else {
      console.log(products);

      const rows = [];

      for (var cart of userCart) {
        for (var product of products) {
          if (cart.productId == product.id) {
            let name = JSON.stringify(product.name);
            let qt = JSON.stringify(cart.quantity);
            rows.push(
              createData(name, qt, Math.round(product.price * cart.quantity))
            );
          }
        }
      }

      return (
        <div class="border">
          <ProductListTable rows={rows} />
          <Button
            onClick={() => {
              console.log('hogo' + rows);
              props.setUserCartData(rows);
              navigate('/checkout');
              console.log('hello world..');
            }}
            startIcon={<ShoppingCartCheckoutIcon />}
            class="d-block mr-0 ml-auto"
          >
            CheckOut
          </Button>
        </div>
      );
    }
  }

  const handleCheckoutButton = (data) => {
    console.log('hogo' + data);
    props.setUserCartData(data);
    navigate('/checkout');
    console.log('hello world..');
  };

  function createData(name, quantity, totalPrice) {
    return { name, quantity, totalPrice };
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
      axios.get(getUserCartEndpoint, config).then(async (res) => {
        setUserCart(JSON.parse(res.data.dtos));
        setUserCartId(res.data.userCartId);
        setUserCartStatus(res.data.status);
        setUserId(res.data.userId);
        setUpdated(false);
        renderUserCartList();
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
        <div
          className="box2"
          key={categorySelected}
          style={{ borderRight: 'solid 1px', padding: '1rem' }}
        >
          <div class="row">
            <div>
              <strong>
                Menu {'>'}
                {categories.map((category) => {
                  if (category.id == categorySelected.id) {
                    console.log(category.name);
                    return <p>{category.name}</p>;
                  }
                })}
              </strong>
            </div>
            <br />
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
