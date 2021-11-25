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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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
  const [userCartProductList, setUserCartProductList] = useState([]);
  const [open, setOpen] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams({ replace: true });
  let st = '';

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
    if (userCartStatus === '') {
      return (
        <div>
          <p>hey create account to track cart!</p>
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

      
      let ans = '';
      for (var cart of userCart) {
        for (var product of products) {
          if (cart.productId == product.id) {
            let name = JSON.stringify(product.name);
            let qt = JSON.stringify(cart.quantity);
            row.push(createData(name, qt, (product.price * cart.quantity))))
          }
        }
      }

      return <div>{ans}</div>;
    }
  }

  export default function BasicTable() {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Fat&nbsp;(g)</TableCell>
              <TableCell align="right">Carbs&nbsp;(g)</TableCell>
              <TableCell align="right">Protein&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  

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
        console.log('res is ');
        console.log(res.data.status);
        st = res.data.status;
        setUserCart(JSON.parse(res.data.dtos));
        setUserCartId(res.data.userCartId);
        setUserCartStatus(res.data.status);
        setUserId(res.data.userId);

        for (var x of JSON.parse(res.data.dtos)) {
          console.log(x);
        }

        setUpdated(false);
      });

      const configv = {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          usercartid: userCartId,
          status: 'NEW',
        },
      };

      axios.get(getUserCartProductListEndpoint, configv).then((res) => {
        console.log('UserCartProductRequestDto is ' + res);
        setUserCartProductList(res.data);
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
