import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Router,
  Switch,
  Route,
  Link,
  useParams,
  Routes,
} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getCategories, getProducts } from '../src/Data.jsx';

export default function ProductIndex() {
  //let products = getProducts(1);
  let id = useParams("categoryId");
  
  console.log("id = " + id)

  return (
    <div>
      <p>hello world.</p>
    </div>
  )
}