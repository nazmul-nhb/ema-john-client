import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    // const [cart, setCart] = useState([]);
    const cart = useLoaderData();
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    // const { count } = useLoaderData();
    // const count = 60;
    const [count, setCount] = useState(0);
    // const itemsPerPage = 12;
    const totalPages = Math.ceil(count / itemsPerPage);
    // const storedCartIDs = Object.keys(storedCart);

    // const pages = [];
    // for (let i = 0; i < totalPages; i++) {
    //     pages.push(i);
    // }

    const pages = [...Array(totalPages).keys()];

    console.log(pages);

    useEffect(() => {
        fetch('http://localhost:5000/products-count')
            .then(res => res.json())
            .then(data => setCount(data.count))
    },[])

    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${currentPage - 1}&size=${itemsPerPage}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentPage, itemsPerPage]);

    // useEffect(() => {
    //     const storedCart = getShoppingCart();
    //     const savedCart = [];
    //     // step 1: get id of the addedProduct
    //     for (const id in storedCart) {
    //         // step 2: get product from products state by using id
    //         const addedProduct = products.find(product => product._id === id)
    //         if (addedProduct) {
    //             // step 3: add quantity
    //             const quantity = storedCart[id];
    //             addedProduct.quantity = quantity;
    //             // step 4: add the added product to the saved cart
    //             savedCart.push(addedProduct);
    //         }
    //         // console.log('added Product', addedProduct)
    //     }
    //     // step 5: set the cart
    //     setCart(savedCart);
    // }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    const handleItemsPerPage = (e) => {
        const pageValue = parseInt(e.target.value);

        e.target.value !== '' && setItemsPerPage(pageValue);
        setCurrentPage(1);
    }

    const handlePreviousPage = () => {
        currentPage > 1 && setCurrentPage(currentPage - 1)
    }

    const handleNextPage = () => {
        currentPage < pages.length && setCurrentPage(currentPage + 1)
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className="pagination">
                <p>Current Page: {currentPage}</p>
                {
                    currentPage > 1 && <button onClick={handlePreviousPage}>Previous</button>
                }
                {
                    pages.map(page => <button
                        className={currentPage === page + 1 ? 'selected' : ''}
                        onClick={() => setCurrentPage(page + 1)}
                        key={page}
                    >{page + 1}</button>)
                }
                {
                    currentPage < pages.length && <button onClick={handleNextPage}>Next</button>
                }
                <select value={itemsPerPage} onChange={handleItemsPerPage} name="" id="">
                    <option value="">Select Items Per Page</option>
                    <option value="6">Items Per Page: 6</option>
                    <option value="12">Items Per Page: 12</option>
                    <option value="24">Items Per Page: 24</option>
                    <option value="48">Items Per Page: 48</option>
                </select>
            </div>
        </div>
    );
};

export default Shop;