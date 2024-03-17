import React, { useState, useEffect } from 'react';


import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete } from 'primereact/autocomplete';
import { ProgressSpinner } from 'primereact/progressspinner';
import { classNames } from 'primereact/utils';
import { InputText } from "primereact/inputtext";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { TabView, TabPanel } from 'primereact/tabview';
import { Toast } from 'primereact/toast';


import { useToast } from '../useToastC/useToast';
import { Popup } from "reactjs-popup";
import axios from 'axios';
import 'primeflex/primeflex.css';
import '../PartSearch/part-search.css'
import './admin.css'


export default function Management() {
    const [partsByCategory, setPartsByCategory] = useState([])
    const [filteredItems, setFilteredItems] = useState(null);
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState(Date.now());
    const [update, setUpdate] = useState(false)

    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState(null);

    const [Categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({ name: 'ABS' });

    const { toast, toastBC, confirm } = useToast();


    //getDataTitels
    useEffect(() => {
        axios
            .get(process.env.REACT_APP_SROUTE+'/categories/', { withCredentials: true })
            .then((response) => {
                setCategories(response.data);
                setSelectedCategory({ name: response.data[0].name, id: response.data[0]._id });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);
    //getPartsByCategorie
    useEffect(() => {
        if (selectedCategory.id && (!selectedItems || selectedItems === '')) {
            axios.get(process.env.REACT_APP_SROUTE+'/parts/' + selectedCategory.id, { withCredentials: true })
                .then((data) => {
                    if (update) {
                        setUpdate(false);
                        return setPartsByCategory(data.data);
                    }
                    setKey(Date.now())
                    setPartsByCategory(data.data);
                    setTimeout(() => { setLoading(true); }, 3000)
                });
        }
    }, [selectedCategory, selectedItems, update]);
    //getAllParts
    useEffect(() => {
        axios.get(process.env.REACT_APP_SROUTE+'/parts/').then((data) => {
            setItems(data.data);
            if (update) { setUpdate(false) }
        })
    }, [update]);


    //Update Parts Buttons
    const bodyButtons = (Part) => {
        return (
            <div className="card flex">
                {UpdatePartModal(Part)}
                <Button icon="pi pi-times" onClick={() => notInStockBtn(Part._id, Part.name)} severity="warning" aria-label="Cancel" disabled={Part.notInStock} raised rounded />
            </div>
        )
    };

    const notInStockBtn = (Id, name) => {
        axios.delete(process.env.REACT_APP_SROUTE+'/parts/' + Id, { withCredentials: true })
            .then(() => {
                confirm(name + ' Not in stock anymore', 'Users will not be able to add this part to their list', 'pi-times')
                setUpdate(true);
                // setTimeout(() => { return search({ query: selectedItems }); }, 3000);
            }).catch(err => { console.log(err); });
    };
    //Update Parts Buttons

    //Modals - Update|Add
    const UpdatePartModal = (Part) => {
        const [partName, setPartName] = useState(Part.name);
        const [category, setCategory] = useState({ name: Part.categoryName, id: Part.category });

        const backToStockBtn = () => {
            const data = { notInStock: false };
    
            axios.put(process.env.REACT_APP_SROUTE+`/parts/${Part._id}`, data, { withCredentials: true })
                .then(() => {
                    confirm(Part.name + ' Is Back To Stock', 'Users will be able to add this part to their list now', 'pi-check')
                    setUpdate(true);
                    // setTimeout(() => { search({ query: selectedItems }); }, 3000);
                })
                .catch(err => console.log(err));
        };
    
        const updateBtn = () => {
            axios.put(process.env.REACT_APP_SROUTE+'/parts/' + Part._id, {
                name: partName,
                category: category.id
            }, { withCredentials: true }).then(() => {
                if (Part.name !== partName && Part.categoryName !== category.name) {
                    confirm(`Part Name '${Part.name}' Changed To '${partName}' And His Category Changed To '${category.name}'`, 'Users will now see the new name you updated and find the part under the new category you set', 'pi-sync');
                } else if (Part.name !== partName) {
                    confirm(`Part Name '${Part.name}' Changed To '${partName}'`, 'Users will now see the new name you updated', 'pi-sync');
                } else if (Part.categoryName !== category.name) {
                    confirm(`'${Part.name}' Category Changed To '${category.name}'`, 'Users will now see this part under the new category you updated', 'pi-sync');
                }
                setUpdate(true);
                // setTimeout(() => { search({ query: selectedItems }); }, 3000); 
            }).catch(err => console.log(err))
        };

        return (
            <Popup
                trigger={
                    <Button
                        icon="pi pi-pencil"
                        className='mr-2'
                        raised
                        rounded
                    />
                }
                modal
                nested
                className='my-popup-update'
            >
                {(close) => (
                    <div className="modal" disabled={loading}>
                        <button className="close" onClick={close}>
                            &times;
                        </button>
                        <div className="modal-container">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="Part">Part Name</label>
                                <InputText id="partname" value={partName} onChange={(e) => setPartName(e.target.value)} />
                            </div>
                            <div className="flex flex-column gap-2 mt-3">
                                <label htmlFor="Category">Category</label>
                                <Dropdown id='drp-down' value={category} onChange={(e) => setCategory(e.target.value)} options={outputArray} optionLabel="name" className="w-full md:w-16rem" />
                            </div>
                            <div className="card flex flex-row mt-4">
                                <Button className='mr-2' label="Update" onClick={() => updateBtn(Part, partName, category)} />
                                <Button label="Back to Stock" onClick={() => { backToStockBtn(Part._id, Part.name) }} severity="warning" disabled={!Part.notInStock} />
                            </div>
                        </div>
                    </div>
                )}
            </Popup>
        );
    };

    const AddPartsAndCategoryModal = () => {
        const [partName, setPartName] = useState();
        const [category, setCategory] = useState();
        const [newCategory, setNewCategory] = useState();
        const [addedPart, setAddedPart] = useState(false);
        const [addedCategory, setAddedCategory] = useState(false);
        const [error, setError] = useState(false);

        const addNewPart = () => {
            if (partName === undefined || category === undefined || category.id === undefined) {
                setError(true);
                setTimeout(() => { setError(false); }, 7000)
            } else {
                axios.post(process.env.REACT_APP_SROUTE+'/parts', { name: partName, category: category.id }, { withCredentials: true })
                    .then(() => {
                        setUpdate(true);
                        setAddedPart(true);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }

        const addNewCategory = () => {
            if (newCategory === undefined) {
                setError(true);
                setTimeout(() => { setError(false); }, 7000)
            } else {
                axios.post(process.env.REACT_APP_SROUTE+'/categories', { name: newCategory}, { withCredentials: true })
                    .then(() => {
                        setUpdate(true);
                        setAddedCategory(true);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }

        return (
            <Popup
                trigger={
                    <Button
                        icon="pi pi-plus"
                        label="Add new"
                        className='mr-2'
                        raised
                    />
                }
                modal
                nested
                className='my-popup-add'
            >
                {(close) => (
                    <div className="modal" disabled={loading}>
                        <button className="close" onClick={() => { close(); setAddedPart(false);setAddedCategory(false); setPartName(''); }}>
                            &times;
                        </button>
                        <TabView>
                            <TabPanel header="Add New Part">
                                <div className="add-part-container card flex justify-content-center animate__animated animate__fadeIn">
                                    {addedPart ? (
                                        <div className="flex flex-column text-center">
                                            <i className="pi pi-check" style={{ fontSize: '4rem', color: 'orange' }}></i>
                                            <h2><span style={{ color: 'black' }}>'{partName}'</span> Added Successfully</h2>
                                            <p>Users can now see this part and add him to their lists</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-column gap-2" style={{}}>
                                            <h2>Add New Part</h2>

                                            <label htmlFor="partname">Part Name</label>
                                            <InputText id="partname" value={partName} onChange={(e) => setPartName(e.target.value)} />

                                            <label htmlFor="categoryname">Category</label>
                                            <Dropdown id='categoryname' value={category} onChange={(e) => setCategory(e.target.value)} options={outputArray} optionLabel="name" className="w-full md:w-16rem mb-3" />

                                            {error && (
                                                <h4 className="w-full md:w-16rem text-center m-0 animate__animated animate__fadeIn" style={{ color: 'red' }}>Fill all fields to add new part</h4>
                                            )}
                                            <Button className='mb-3' label="Add New Part" onClick={() => { addNewPart(); }} severity="warning" rounded />
                                        </div>
                                    )}
                                </div>
                            </TabPanel>
                            <TabPanel header="Add New Category">
                                <div className="add-part-container card flex justify-content-center animate__animated animate__fadeIn">
                                    {addedCategory ? (
                                        <div className="flex flex-column text-center">
                                            <i className="pi pi-check" style={{ fontSize: '4rem', color: 'orange' }}></i>
                                            <h2><span style={{ color: 'black' }}>'{newCategory}'</span> Added Successfully</h2>
                                            <p>Users can now see this category</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-column gap-2">
                                            <h2>Add New Category</h2>
                                            <label htmlFor="newcategoryname">Category Name</label>
                                            <InputText id="newcategoryname" className="mb-3" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                                            {error && (
                                                <h4 className="w-full md:w-16rem text-center m-0 animate__animated animate__fadeIn" style={{ color: 'red' }}>Fill all fields to add new category</h4>
                                            )}
                                            <Button className=' w-full md:w-16rem mb-3 ' label="Add New Category" onClick={()=>{addNewCategory()}} severity="warning" rounded />
                                        </div>
                                    )}
                                </div>
                            </TabPanel>
                        </TabView >
                    </div >
                )
                }
            </Popup >
        )
    };
    //Modals - Update|Add


    //Filter Functions
    const search = (event) => {
        try {
            let _filteredItems;

            if (event.query && event.query.trim().length === 0) {
                _filteredItems = [...items];
            } else {
                _filteredItems = items.filter((item) => {
                    return item.name.toLowerCase().startsWith((event.query || '').toLowerCase());
                });
            }

            setFilteredItems(_filteredItems);
            setPartsByCategory(_filteredItems);
            setKey(Date.now());
        } catch (err) {
            console.log(err);
        }
    };

    const outputArray = Categories.map(category => {
        return { name: category.name, id: category._id };
    });
    //Filter Functions

    //Part Card View
    const itemTemplate = (Part) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                <img className="w-9 sm w-10rem h-10rem shadow-2 block xl:block mx-auto border-round" src={`images/Parts/${Part.img}`} alt={Part.name} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className={classNames('text-2xl font-bold text-900', { 'line-through': Part.notInStock })}>{Part.name}</div>
                            {/* Body condition */}
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className={classNames('font-semibold', { 'line-through': Part.notInStock })}>{Part.categoryName}</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            {bodyButtons(Part)}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    //Part Card View

    return (
        <div className="card">
            <div>
                <Accordion activeIndex={1}>
                    <AccordionTab header="Filters & Actions">
                        <div className='card flex flex-row'>
                            <div className="flex flex-column gap-2 mr-4">
                                <label htmlFor='drp-down'>Category</label>
                                <Dropdown id='drp-down' value={selectedCategory} onChange={(e) => setSelectedCategory(e.value)} options={outputArray} optionLabel="name" className="w-full md:w-14rem" />
                            </div>
                            <div className="flex flex-column gap-2 mr-4">
                                <label htmlFor='drp-down'>Search</label>
                                <AutoComplete placeholder="Search Parts" field="name" value={selectedItems} suggestions={filteredItems} completeMethod={search} onChange={(e) => { setSelectedItems(e.value) }} />
                            </div>
                        </div>
                        <div className='card flex flex-row'>
                            <div className="flex flex-column gap-2 mr-4" style={{ marginTop: '27px' }}>
                                {AddPartsAndCategoryModal()}
                            </div>
                        </div>
                    </AccordionTab>
                </Accordion>
                {!loading ? (<ProgressSpinner className="progress-spinner" strokeWidth="8" />) :
                    (
                        <>
                            <Toast ref={toast} />
                            <Toast ref={toastBC} position="center" />
                            <DataView key={key} className='animate__animate animate__fadeIn' value={partsByCategory} itemTemplate={itemTemplate} filter="true" filterby='name' paginator rows={6} />
                        </>
                    )}
            </div>
        </div>
    );
}