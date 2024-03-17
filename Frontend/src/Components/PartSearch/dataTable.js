import React, { useState, useEffect } from 'react';

import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete } from 'primereact/autocomplete';
import { ProgressSpinner } from 'primereact/progressspinner';
import { classNames } from 'primereact/utils';

import { useCart } from '../../Contexts/CartContext';

import axios from 'axios';
import 'primeflex/primeflex.css';
import './part-search.css'

const prevData = {}

export default function PartsTable() {
    const [products, setProducts] = useState([]);
    const [Categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({ name: 'ABS' });
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState(null);
    const [filteredItems, setFilteredItems] = useState(null);
    const [loading, setLoading] = useState(false);

    const { cart, addToCart } = useCart();


    //getCategories
    useEffect(() => {
        axios.get(process.env.REACT_APP_SROUTE + '/categories/', { withCredentials: true }).then((response) => {
            setCategories(response.data);
            setSelectedCategory({ name: response.data[1].name, id: response.data[1]._id });
            setTimeout(() => { setLoading(true); }, 3000)
        }).catch((error) => {
                console.error('Error:', error);
            });
    }, []);
    //getPartsByCategorie
    useEffect(() => {
        if (selectedCategory.id && (!selectedItems || selectedItems === '')) {
            axios.get(process.env.REACT_APP_SROUTE + '/parts/' + selectedCategory.id, { withCredentials: true })
                .then((data) => {
                    setProducts(data.data);
                }).catch(error => {
                    // Handle network error
                    console.error('Network Error:', error);
                });
        }
    }, [selectedCategory, selectedItems]);
    //getAllPartForSearch
    useEffect(() => {
        axios.get(process.env.REACT_APP_SROUTE + '/parts/').then((data) => {
            setItems(data.data);
        }).catch(error => {
            console.error('Network Error:', error);
        });
    }, []);

    const outputArray = Categories.map(category => {
        return { name: category.name, id: category._id };
    });

    const bodyCondition = (product) => {
        return (
            <div className="card flex justify-content-center flex-column gap-2">
                <label className='font-bold text-center'>Part Condition</label>
                <SelectButton className='sl-btn' options={['New', 'Used']} checked={product.condition === 'New'} value={product.condition} onChange={(e) => {
                    const updatedProducts = products.map((p) => {
                        if (p === product) {
                            p.condition = e.value
                            const pid = p._id + ""
                            prevData[pid] = [p.condition, p.isClicked]
                            return { ...p, condition: e.value };
                        }
                        return p;
                    });
                    setProducts(updatedProducts);
                }}
                />
            </div>
        );
    };

    const handleButtonClick = (product) => {
        const updatedProducts = products.map((p) => {
            if (p === product) {
                p.isClicked = !p.isClicked;
                const pid = p._id + "";
                prevData[pid] = [p.condition, p.isClicked];
            }
            return p;
        });
        setProducts(updatedProducts);
        addToCart(product);
    };

    const bodyButton = (product) => {
        const isInCart = cart.some(item => item._id === product._id);

        return (
            isInCart ?
                <Button icon="pi pi-check" severity="warning" rounded aria-label="Filter" outlined onClick={() => handleButtonClick(product)} />
                :
                <Button className='add-btn shadow-none' icon="pi pi-cart-plus"
                    onClick={() => handleButtonClick(product)} raised text aria-label="Filter" />
        )
    };

    const itemTemplate = (product) => {
        return (
            <div className={classNames('col-12 part-template', { 'opacity-50': product.notInStock })}>
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <img className="w-9 sm w-14rem h-14rem shadow-5 block xl:block mx-auto border-round " src={`images/Parts/${product.img}`} alt={product.name} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className={classNames('text-2xl font-bold text-900', { 'line-through': product.notInStock })}>{product.name}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-th-large"></i>
                                    <span className="font-semibold">{product.categoryName}</span>
                                </span>
                            </div>
                            {bodyCondition(product)}
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            {bodyButton(product)}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const search = (event) => {

        setTimeout(() => {
            let _filteredItems;

            if (!event.query.trim().length) {
                _filteredItems = [...items];
            }
            else {
                _filteredItems = items.filter((item) => {
                    return item.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredItems(_filteredItems);
            setProducts(_filteredItems)
        }, 250);
    }

    const header = () => {
        return (

            <div className='card flex flex-row'>
                <div className="flex flex-column gap-2 mr-4">
                    <label htmlFor='drp-down'>Category</label>
                    <Dropdown id='drp-down' value={selectedCategory} onChange={(e) => setSelectedCategory(e.value)} options={outputArray} optionLabel="name" className="w-full md:w-14rem" />
                </div>
                <div className="flex flex-column gap-2">
                    <label htmlFor='drp-down'>Search</label>
                    <AutoComplete placeholder="Search" field="name" value={selectedItems} suggestions={filteredItems} completeMethod={search} id="auto-complete" onChange={(e) => { setSelectedItems(e.value) }} />
                </div>
            </div>
        )
    }

    return (
        <div className="card">
            {!loading ? (
                <ProgressSpinner className="progress-spinner" strokeWidth="8" />
            ) : (<DataView className='animate__animate animate__fadeIn' value={products} itemTemplate={itemTemplate} header={header()} filter="true" filterby='name' paginator rows={6} />)}
        </div>
    );
}