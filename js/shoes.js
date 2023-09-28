function shoeCatalogue() {
    let auth = {
        username: "",
        password: "",
        adminUser: false,

        login() {
            const userData = {
                username: this.username,
                password: this.password,
            };

            axios
                .post("https://shoe-catalogue-api.onrender.com/api/auth/login", userData)
                .then((response) => {
                    if (response.data.userAccessToken) {
                        localStorage.setItem("jwtToken", response.data.userAccessToken);
                        localStorage.setItem("user", JSON.stringify(response.data.user) );
                        this.adminUser = JSON.parse(localStorage.getItem('user')).adminUser ;
                        this.adminUser = console.log(this.adminUser)
                        
                        window.location.href = "index.html";
                    } else {
                        // Handle authentication error (e.g., show an error message).
                        alert("Invalid login credentials");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        },
    };

    let shoes = {
        positiveFeedback: "",
        negativeFeedback: "",
        shoesList: [],
        brandsList: [],
        colorsList: [],

        colorFilterValue: "",
        sizeFilterValue: "",
        brandFilterValue: "",

        checkFilter() {
            if (this.colorFilterValue != "" && this.sizeFilterValue == "" && this.brandFilterValue == "") {
                axios.get(`https://shoe-catalogue-api.onrender.com/api/shoes/color/${this.colorFilterValue}`).then((result) => {
                    this.shoesList = result.data;
                });
            } else if (this.colorFilterValue == "" && this.sizeFilterValue != "" && this.brandFilterValue == "") {
                axios.get(`https://shoe-catalogue-api.onrender.com/api/shoes/size/${this.sizeFilterValue}`).then((result) => {
                    this.shoesList = result.data;
                });
            } else if (this.colorFilterValue == "" && this.sizeFilterValue == "" && this.brandFilterValue != "") {
                axios.get(`https://shoe-catalogue-api.onrender.com/api/shoes/brand/${this.brandFilterValue}`).then((result) => {
                    this.shoesList = result.data;
                });
            } else if (this.colorFilterValue == "" && this.sizeFilterValue != "" && this.brandFilterValue != "") {
                axios.get(`https://shoe-catalogue-api.onrender.com/api/shoes/brand/${this.brandFilterValue}/size/${this.sizeFilterValue}`).then((result) => {
                    this.shoesList = result.data;
                });
            } else if (this.colorFilterValue != "" && this.sizeFilterValue != "" && this.brandFilterValue == "") {
                axios.get(`https://shoe-catalogue-api.onrender.com/api/shoes/size/${this.sizeFilterValue}/color/${this.colorFilterValue}`).then((result) => {
                    this.shoesList = result.data;
                });
            } else if (this.colorFilterValue != "" && this.sizeFilterValue == "" && this.brandFilterValue != "") {
                axios.get(`https://shoe-catalogue-api.onrender.com/api/shoes/brand/${this.brandFilterValue}/color/${this.colorFilterValue}`).then((result) => {
                    this.shoesList = result.data;
                });
            } else if (this.colorFilterValue != "" && this.sizeFilterValue != "" && this.brandFilterValue != "") {
                axios.get(`https://shoe-catalogue-api.onrender.com/api/shoes/brand/${this.brandFilterValue}/size/${this.sizeFilterValue}/color/${this.colorFilterValue}`).then((result) => {
                    this.shoesList = result.data;
                });
            } else {
                this.getAllShoes();
            }
        },

        setColorFilter(color) {
            this.colorFilterValue = color;
            this.checkFilter();
        },
        setSizeFilter(size) {
            console.log(size)
            this.sizeFilterValue = size;
            this.checkFilter();
        },
        setBrandFilter(brand) {
            this.brandFilterValue = brand;
            this.checkFilter();
        },

        getAllShoes() {
            axios.get("https://shoe-catalogue-api.onrender.com/api/shoes").then((result) => {
                this.shoesList = result.data;
                this.getBrands();
                this.getColors();
            });
        },

        getShoesByBrand(brandName) {
            axios.get(`https://shoe-catalogue-api.onrender.com/api/shoes/brand/${brandName}`).then((result) => {
                this.shoesList = result.data;
            });
        },
        getBrands() {
            let brands = new Set(this.shoesList.map((shoe) => shoe.brand));
            this.brandsList = [...brands];
        },
        getColors() {
            let colors = new Set(this.shoesList.map((shoe) => shoe.color));
            this.colorsList = [...colors];
        },
    };

    let cart = {
        message: "This is a test message",
        cartList: [],
        shoeInCart: [],

        getCartItems() {
            axios.get("https://shoe-catalogue-api.onrender.com/api/cart/", { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }).then((result) => {
                this.cartList = result.data;
                this.checkShoeInCart();
            });
        },
        addToCart(id) {
            axios.post(`https://shoe-catalogue-api.onrender.com/api/cart/add-to-cart/${id}`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }).then(() => {
                this.getCartItems();
            });
        },
        removeFromCart(id) {
            axios.post(`https://shoe-catalogue-api.onrender.com/api/cart/remove-from-cart/${id}`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }).then(() => {
                this.getCartItems();
            });
        },
        checkShoeInCart() {
            let shoeIDs = this.cartList.map((obj) => obj.id);
            this.shoeInCart = shoeIDs;
        },
        updateCart(id, qty) {
            axios.post(`https://shoe-catalogue-api.onrender.com/api/cart/update-cart/${id}`, { quantity: qty }, { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }).then(() => {
                this.getCartItems();
            });
        },
    };

    let dom = {
        dropdownBrand: false,
        dropdownColor: false,
        dropdownSize: false,

        setDropdownBrand() {
            this.dropdownBrand = !this.dropdownBrand;
        },

        setDropdownColor() {
            this.dropdownColor = !this.dropdownColor;
        },

        setDropdownSize() {
            this.dropdownSize = !this.dropdownSize;
        },
    };

    return {
        auth,
        shoes,
        cart,
        dom,
        init() {
            this.shoes.getAllShoes();
            this.cart.getCartItems();
            // todo: -> get the brands && colors
            // this.shoes.getBrands()
            // console.log(shoes.brandsList)
        },
    };
}
