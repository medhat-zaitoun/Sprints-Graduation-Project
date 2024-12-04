import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createNewOrder } from "@/store/shop/order-slice"; // Stripe action
import { useToast } from "@/components/ui/use-toast";


function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart); // Cart items from the store
  const { user } = useSelector((state) => state.auth); // User data from auth state
  const { stripeSessionId, isLoading , approvalURL} = useSelector((state) => state.shopOrder); // Stripe session ID
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null); // Selected address
  const [isPaymentStart, setIsPaymentStart] = useState(false); // Payment start state
  const dispatch = useDispatch(); // Dispatch action
  const { toast } = useToast(); // Toast for notifications

  // Calculate total cart amount
  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.product.salePrice > 0
              ? currentItem?.product.salePrice
              : currentItem?.product.price) * currentItem?.quantity,
          0
        )
      : 0;

  // Handle Stripe payment initiation
  async function handleInitiateStripePayment() {
    if (!cartItems || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select an address to proceed.",
        variant: "destructive",
      });
      return;
    }

    // Start payment process
    setIsPaymentStart(true);

    const orderData = {
      cartId: cartItems.id,
      userId: user?.id,
      addressId: currentSelectedAddress?.id.toString(),
    };
    dispatch(createNewOrder(orderData));
  }
    console.log(approvalURL)
  // Redirect to Stripe if the session is created
  useEffect(() => {
    if (stripeSessionId) {
      window.location.href = approvalURL;
    }
  }, [stripeSessionId]);

  return (
    <div className="flex flex-col dark:bg-background">
      {/* Image Banner */}
      <div className="relative h-[450px] w-full overflow-hidden">
        <img
          src="/khara-woods-KR84RpMCb0w-unsplash.jpg"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Checkout Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        {/* Address Selection */}
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />

        {/* Cart Items and Payment Summary */}
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0 ? (
            cartItems.items.map((item) => (
              <UserCartItemsContent cartItem={item} key={item.id} />
            ))
          ) : (
            <div>Your cart is empty.</div>
          )}

          {/* Total Amount */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="mt-4 w-full">
            <Button
              onClick={handleInitiateStripePayment}
              className="w-full"
              disabled={isLoading}
            >
              {isPaymentStart
                ? "Processing Stripe Payment..."
                : "Checkout with Stripe"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
