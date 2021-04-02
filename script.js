
// Modulleri olusturma
//Storage Controller
const storageconrotroller = (function () {

    return {
        storeproduct: function (product) {
            let products;
            if (localStorage.getItem('products') === null) {
                products = [];
                products.push(product);

            } else {
                products = JSON.parse(localStorage.getItem('products'));
                products.push(product);
            }
            localStorage.setItem('products', JSON.stringify(products));
        },
        getproducts: function () {
            let products;
            if (localStorage.getItem('products') == null) {
                products = [];
            }
            else {
                products = JSON.parse(localStorage.getItem('products'));

            }
            return products;
        },
        updateproduct:function(product){
            
            let products=JSON.parse(localStorage.getItem('products'));
            products.forEach(function(prd,index){
if(product.id==prd.id){
    products.splice(index,1,product);

}
            });
            localStorage.setItem('products',JSON.stringify(products));
        },
deleteProduct:function(id){

    let products=JSON.parse(localStorage.getItem('products'));
    products.forEach(function(prd,index){
        if(id==prd.id){
            products.splice(index,1);
        }
                    });
                    localStorage.setItem('products',JSON.stringify(products));

}

    }


})();

const ProductController = (function () {
    //private module
    const product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        products: storageconrotroller.getproducts(),
        selectedproduct: null,
        totalprice: 0
    }
    //public
    return {
        getproducts: function () {

            return data.products;
        },
        getData: function () {
            return data;
        },
        getproductById: function (id) {
            let product = null;
            data.products.forEach(function (prd) {

                if (prd.id == id) {
                    product = prd;
                }
            })
            return product;

        },
        setCurrentProduct: function (product) {
            data.selectedproduct = product;

        },
        getCurrentproduct: function () {
            return data.selectedproduct;
        },

        addproduct: function (name, price) {
            let id;
            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;
            } else {
                id = 0;

            }
            const newProduct = new product(id, name, parseFloat(price));
            data.products.push(newProduct);
            return newProduct;

        },
        updatemoreproduct: function (name, price) {
            let product = null;

            data.products.forEach(function (prd) {
                if (prd.id == data.selectedproduct.id) {
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd;
                }


            });
            return product;


        },
        deleteProduct: function (product) {
            data.products.forEach(function (prd, index) {
                if (prd.id == product.id) {
                    data.products.splice(index, 1);
                }
            });
        },
        getTotal: function () {
            let Total = 0;
            data.products.forEach(function (item) {

                Total += item.price;


            });
            data.totalprice = Total;
            return data.totalprice;
        }


    }

})();

//UI controller
const UIcontroller = (function () {

    const selectors = {
        productList: "#item-list",
        productlistItems: "#item-list tr",
        AddButton: '.addBtn',
        Addidbtn: '#Addbtn',
        PruductName: '#productname',
        ProductPrice: '#productprice',
        productCard: '#product-card',
        Totaltl: '#total-tl',
        Totaldalar: '#total-dolar',
        updateButton: '.updatebtn',
        deleteButton: '.deletebtn',
        cancelButton: '.cancelbtn'

    }

    return {
        createProductList: function (products) {
            let html = "";
            products.forEach(prd => {
                html += `
    <tr>
<td>${prd.id}</td>
<td>${prd.name}</td>
<td>${prd.price} $</td>
<td class="text-right">
    <i class="fas fa-edit edit-product"></i>
    </td>
                  </tr>
    `;
            });

            document.querySelector(selectors.productList).innerHTML = html;

        },
        getSelectors: function () {
            return selectors;
        },
        addproduct: function (prd) {

            document.querySelector(selectors.productCard).style.display = 'block';
            var item = `
<tr>
<td>${prd.id}</td>
<td>${prd.name}</td>
<td>${prd.price} $</td>
<td class="text-right">
    <i class="fas fa-edit edit-product"></i>
    </td>
                  </tr>

`;
            document.querySelector(selectors.productList).innerHTML += item;

        },
        clearInput: function () {
            document.querySelector('#productname').value = '';
            document.querySelector('#productprice').value = '';

        },
        clearwraming: function () {
            const items = document.querySelectorAll(selectors.productlistItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.classList.remove('bg-warning');
                }
            });

        },
        HideCard: function () {

            document.querySelector(selectors.productCard).style.display = 'none';
            //document.getElementById("product-card").style.display='none';
        },
        showTotal: function (Total) {
            document.querySelector('#total-dolar').textContent = Total;
            document.querySelector('#total-tl').textContent = Total * 6.90;

        },

        addproductToForm: function () {
            const selectedproduct = ProductController.getCurrentproduct();
            document.querySelector('#productname').value =
                selectedproduct.name;
            document.querySelector('#productprice').value =
                selectedproduct.price;

        },

        addingState: function (item) {
            UIcontroller.clearwraming();
            UIcontroller.clearInput();
            //document.getElementById("AddBtn").style.display='inline';
            document.querySelector(selectors.AddButton).style.display = 'inline';
            //document.getElementById("updatebtn").style.display='none';
            document.querySelector(selectors.updateButton).style.display = 'none';
            //document.getElementById("deletebtn").style.display='none';
            document.querySelector(selectors.deleteButton).style.display = 'none';
            //document.getElementById("cancelbtn").style.display='none';
            document.querySelector(selectors.cancelButton).style.display = 'none';

        },
        editState: function (tr) {


            tr.classList.add('bg-warning');
            document.querySelector(selectors.AddButton).style.display = 'none';
            document.querySelector(selectors.updateButton).style.display = 'inline';
            document.querySelector(selectors.deleteButton).style.display = 'inline';
            document.querySelector(selectors.cancelButton).style.display = 'inline';
        },
        updateproduct: function (prd) {

            let updatedItem = null;
            let items = document.querySelectorAll(selectors.productlistItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price + ' $';
                    updatedItem = item;
                }
            });
            return updatedItem;
        },
        deleteproduct: function () {
            let items = document.querySelectorAll(selectors.productlistItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.remove();
                }
            });
        }

    }
})();





//App Controller
const App = (function (Productctrl, UIctrl, storagectrl) {
    //private

    const UIselecttors = UIctrl.getSelectors();
    //Load Event Listeners
    const loadEventListeners = function () {


        //add product event
        var el = document.querySelector('.addBtn');

        if (el) {
            el.addEventListener('click', function (e) {

                const productName = document.querySelector('#productname').value;
                const ProductPrice = document.querySelector('#productprice').value;

                if (productName !== '' && ProductPrice !== '') {
                    //add product
                    const newProduct = Productctrl.addproduct(productName, ProductPrice);

                    //add item to list
                    UIctrl.addproduct(newProduct);

                    //add product to local storage
                    storagectrl.storeproduct(newProduct);

                    //get total
                    const total = Productctrl.getTotal();
                    //console.log(total);

                    UIctrl.showTotal(total);

                    UIctrl.clearInput();


                }

                console.log(productName, ProductPrice);

                e.preventDefault();

            });

            document.querySelector(UIselecttors.productList).addEventListener('click', productEditclick);
            //edit product submit
            document.querySelector(UIselecttors.updateButton).addEventListener('click', producteditSubmit);
            //cancel button click
            document.querySelector(UIselecttors.cancelButton).addEventListener('click', cancelupdate);
            //delete button
            document.querySelector(UIselecttors.deleteButton).addEventListener('click', deleteproductsubmit);


        }
    }
    const productEditclick = function (e) {

        if (e.target.classList.contains('edit-product')) {

            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

            //get selected product
            const product = Productctrl.getproductById(id);
            //set current product
            Productctrl.setCurrentProduct(product);

            //add product to UI
            UIctrl.addproductToForm();
            UIctrl.clearwraming();


            //console.log();
            UIctrl.editState(e.target.parentNode.parentNode);

        }

        e.preventDefault();
    }
    const producteditSubmit = function (e) {

        const productName = document.querySelector('#productname').value;
        const ProductPrice = document.querySelector('#productprice').value;

        if (productName !== '' && ProductPrice !== '') {

            const updatedproduct = Productctrl.updatemoreproduct(productName, ProductPrice);

            //update UI
            let item = UIctrl.updateproduct(updatedproduct);


            const total = Productctrl.getTotal();
            //console.log(total);

            UIctrl.showTotal(total);

            //update storage
            storagectrl.updateproduct(updatedproduct);

            UIctrl.clearInput();

            UIctrl.addingState();
        }
        e.preventDefault();
    }
    const cancelupdate = function (e) {

        UIctrl.addingState();
        UIctrl.clearwraming();
        e.preventDefault();
    }
    const deleteproductsubmit = function (e) {
        //get selected product
        const selectedproduct = Productctrl.getCurrentproduct();
        //delete product
        Productctrl.deleteProduct(selectedproduct);

        //delete UI
        UIctrl.deleteproduct(selectedproduct);

        const total = Productctrl.getTotal();
        //console.log(total);

        UIctrl.showTotal(total);

        //delete from ls
        storagectrl.deleteProduct(selectedproduct.id);

        UIctrl.clearInput();

        UIctrl.addingState();

        if (total == 0) {
            UIctrl.HideCard();
        }

        e.preventDefault();
    }


    return {
        init: function () {
            console.log('Starting App...');


            UIctrl.addingState();

            const products = Productctrl.getproducts();

            if ( products.length == 0) {
                UIctrl.HideCard();
            } else {
                UIctrl.createProductList(products);
            }
            //load event listeners
            loadEventListeners();


        }
    }
})(ProductController, UIcontroller, storageconrotroller);

App.init();
