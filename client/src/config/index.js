export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const resetPasswordFormControls = [
  // {
  //   name: "email",
  //   label: "Email",
  //   placeholder: "Enter your email",
  //   componentType: "input",
  //   type: "email",
  // },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Confirm your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];
export const forgotPasswordFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
];
export const otpFormControls = [
  {
    name: "otp",
    label: "OTP",
    placeholder: "Enter OTP",
    componentType: "otp-input",
    type: "otp",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "painting", label: "Painting" },
      { id: "photography", label: "Photography" },
      { id: "sculpture", label: "Sculpture" },
      { id: "drawing", label: "Drawing" },
      { id: "digital_art", label: "Digital Art" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "sotheby", label: "Sotheby" },
      { id: "christie", label: "Christie" },
      { id: "gagosian", label: "Gagosian" },
      { id: "Phillips", label: "Phillips" },
      { id: "art_basel", label: "Art Basel" },
      { id: "original_art", label: "Original Art" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "painting",
    label: "Painting",
    path: "/shop/listing",
  },
  {
    id: "photography",
    label: "Photography",
    path: "/shop/listing",
  },
  {
    id: "sculpture",
    label: "Sculpture",
    path: "/shop/listing",
  },
  {
    id: "drawing",
    label: "Drawing",
    path: "/shop/listing",
  },
  {
    id: "digital_art",
    label: "Digital Art",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  painting: "Painting",
  photography: "Photography",
  sculpture: "Sculpture",
  drawing: "Drawing",
  digital_art: "Digital Art",
};

export const brandOptionsMap = {
  sotheby: "Sotheby",
  christie: "Christie",
  gagosian: "Gagosian",
  phillips: "Phillips",
  art_basel: "Art Basel",
  original_art: "Original Art",
};

export const filterOptions = {
  category: [
    { id: "painting", label: "Painting" },
      { id: "photography", label: "Photography" },
      { id: "sculpture", label: "Sculpture" },
      { id: "drawing", label: "Drawing" },
      { id: "digital_art", label: "Digital Art" },
    
  ],
  brand: [
    { id: "sotheby", label: "Sotheby" },
    { id: "christie", label: "Christie" },
    { id: "gagosian", label: "Gagosian" },
    { id: "Phillips", label: "Phillips" },
    { id: "art_basel", label: "Art Basel" },
    { id: "original_art", label: "Original Art" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
