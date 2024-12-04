// import { Button } from "@/components/ui/button";
import {
  Palette,
  PenTool,
  CloudSun,
  PaintbrushVertical,
  Image,
  Amphora,
  Images,
  Brush,
  FileHeart,
  TvMinimal,
  ShoppingBag,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, Pagination,EffectFade, Navigation } from 'swiper/modules';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";

import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "painting", label: "Painting", icon: Palette },
  { id: "photography", label: "Photography", icon: Image },
  { id: "sculpture", label: "Sculpture", icon: Amphora },
  { id: "drawing", label: "Drawing", icon: PenTool },
  { id: "digital-art", label: "Digital Art", icon: TvMinimal },
];
const brandsWithIcon = [
  
    { id: "sotheby", label: "Sotheby" , icon: CloudSun},
    { id: "christie", label: "Christie" , icon: PaintbrushVertical},
    { id: "gagosian", label: "Gagosian" , icon: Palette },
    { id: "Phillips", label: "Phillips" , icon: Brush  },
    { id: "art_basel", label: "Art Basel" , icon: ShoppingBag},
    { id: "original_art", label: "Original Art" , icon: FileHeart},

  ];
function ShoppingHome() {
  // const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  // const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
  //   }, 15000);

  //   return () => clearInterval(timer);
  // }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);
  const bannerImages = ["/eric-park-QbX8A8eHfzw-unsplash.jpg", "/mike-von-tC7G9eTrORQ-unsplash.jpg", "/pexels-daiangan-102127.jpg", "/pexels-jessbaileydesign-743986.jpg", "/pexels-pixabay-161154.jpg", "/rhondak-native-florida-folk-artist-_Yc7OtfFn-0-unsplash.jpg"]

  console.log(bannerImages);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen dark:bg-background">
      <div className="relative w-full h-[650px] overflow-hidden">
        
        <Swiper spaceBetween={30}
          className="mySwiper w-[100%] h-full"
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          // effect={'fade'}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          >

          {bannerImages.map((slide, index) => (
            <SwiperSlide className="bg-center bg-cover">
              <img
                src={slide}
                key={index}
                className="w-full h-full"
                
              />

            </SwiperSlide>
          ))
          }
        </Swiper>
        
      </div>
      <section className="py-12 bg-gray-50 dark:bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem, index) => (
              <Card key={index}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow dark:bg-green-50"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold dark:text-background">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 dark:bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem, index) => (
              <Card key={index}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow dark:bg-green-50"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold dark:text-background">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem, index) => (
                <ShoppingProductTile key={index}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
