import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { Link } from "wouter";
import { useLocation } from "wouter";
import Login from "./login";
import Verify from "./verify";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const { setCartCount } = useCart();
  const [, navigate] = useLocation();

  const BASE_URL = "/";

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [showAuthFlow, setShowAuthFlow] = useState(false);
  const [currentStep, setCurrentStep] = useState<"login" | "verify">("login");
  const [isAuthCompleted, setIsAuthCompleted] = useState(false);

  type VerifiedUser = {
    username: string;
    email?: string;
  };

  const [verifiedUser, setVerifiedUser] = useState<VerifiedUser | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const user = localStorage.getItem("verifiedUser");
      setVerifiedUser(user ? JSON.parse(user) : null);
    };

    loadUser();

    window.addEventListener("userVerified", loadUser);

    return () => {
      window.removeEventListener("userVerified", loadUser);
    };
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const res = await axios.get(`${BASE_URL}api/user/cart`, {
      withCredentials: true,
    });

    setCartItems(res.data.items);
    setCartTotal(res.data.cartTotal);

    const count = res.data.items.reduce(
      (acc: number, item: any) => acc + item.quantity,
      0,
    );

    setCartCount(count);
  };

  const handleAddressChange = (e: any) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 STRONG VALIDATION FUNCTION
  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const pincodeRegex = /^[0-9]{6}$/;

    if (!nameRegex.test(shippingAddress.fullName)) {
      toast.error("Enter valid full name (letters only)");
      return false;
    }

    if (!phoneRegex.test(shippingAddress.phone)) {
      toast.error("Enter valid Indian phone number (starts with 6-9)");
      return false;
    }

    if (shippingAddress.addressLine.length < 5) {
      toast.error("Address too short");
      return false;
    }

    if (shippingAddress.city.length < 2) {
      toast.error("Enter valid city");
      return false;
    }

    if (shippingAddress.state.length < 2) {
      toast.error("Enter valid state");
      return false;
    }

    if (!pincodeRegex.test(shippingAddress.pincode)) {
      toast.error("Enter valid 6 digit pincode");
      return false;
    }

    return true;
  };

  const updateQuantity = async (itemId: string, action: "inc" | "dec") => {
    const res = await axios.put(
      `${BASE_URL}api/user/cart/update-quantity`,
      { itemId, action },
      { withCredentials: true },
    );

    setCartItems(res.data.items);
    setCartTotal(res.data.cartTotal);

    const count = res.data.items.reduce(
      (acc: number, item: any) => acc + item.quantity,
      0,
    );

    setCartCount(count);
  };

  const removeItem = async (itemId: string) => {
    const res = await axios.delete(`${BASE_URL}api/user/cart/remove-item`, {
      data: { itemId },
      withCredentials: true,
    });

    setCartItems(res.data.items);
    setCartTotal(res.data.cartTotal);

    const count = res.data.items.reduce(
      (acc: number, item: any) => acc + item.quantity,
      0,
    );

    setCartCount(count);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      navigate("/collections");
      return;
    }

    if (!validateForm()) return;

    if (!verifiedUser && !isAuthCompleted) {
      setShowAuthFlow(true);
      setCurrentStep("login");
      setIsAuthCompleted(false);
      return;
    }

    try {
      const orderItems = cartItems.map((item: any) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      const res = await axios.post(
        `${BASE_URL}api/order/create`,
        {
          items: orderItems,
          shippingAddress,
        },
        { withCredentials: true },
      );

      const { order, razorpayOrder } = res.data;
      setIsAuthCompleted(false);
      setShowAuthFlow(false);
      openRazorpayCheckout(order, razorpayOrder);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to place order. Please try again.";
      toast.error(errorMessage);
    }
  };

  const openRazorpayCheckout = async (order: any, razorpayOrder: any) => {
    console.log("RAZORPAY KEY:", import.meta.env.VITE_RAZORPAY_KEY_ID);
    console.log("RAZORPAY ORDER:", razorpayOrder);

    if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
      toast.error("Razorpay key not configured");
      return;
    }

    // 🔧 In dev mode with mock orders, simulate payment success
    if (razorpayOrder._dev_note) {
      console.log("🧪 Dev Mode: Simulating successful payment...");
      try {
        const verifyRes = await axios.post(
          `${BASE_URL}api/payment/verify`,
          {
            razorpay_order_id: razorpayOrder.id,
            razorpay_payment_id: "dev_payment_" + Date.now(),
            razorpay_signature: "dev_signature_" + Date.now(),
            orderId: order._id,
          },
          { withCredentials: true },
        );

        if (verifyRes.data.success) {
          setCartItems([]);
          setCartTotal(0);
          setCartCount(0);
          window.dispatchEvent(new Event("cartUpdated"));
          toast.success("Payment Successful (Dev Mode)");
          navigate("/orders");
        }
      } catch (error: any) {
        console.error("Dev payment error:", error);
        toast.error(error.response?.data?.message || "Payment failed");
      }
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: "INR",
      name: "Ishwar Rugs",
      order_id: razorpayOrder.id,

      handler: async function (response: any) {
        try {
          const verifyRes = await axios.post(
            `${BASE_URL}api/payment/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            },
            { withCredentials: true },
          );

          if (verifyRes.data.success) {
            setCartItems([]);
            setCartTotal(0);
            setCartCount(0);
            window.dispatchEvent(new Event("cartUpdated"));
            toast.success("Payment Successful");
            navigate("/orders");
          } else {
            toast.error("Payment verification failed");
          }
        } catch (error) {
          console.error("Payment verify error:", error);
          toast.error("Payment verification failed");
        }
      },

      theme: {
        color: "#d4af37",
      },

      modal: {
        ondismiss: function () {
          console.log("Razorpay modal dismissed");
        },
      },
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Razorpay initialization error:", error);
      toast.error("Failed to initialize payment gateway. Please try again.");
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-10">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.length === 0 && (
            <p className="text-muted-foreground">Your cart is empty</p>
          )}

          {cartItems.map((item: any) =>
            item.product ? (
            <Link key={item._id} href={`/product/${item.product.slug}`}>
              <div className="group flex gap-6 p-6 rounded-2xl border bg-card hover:shadow-lg transition">
                <img
                  src={item.product?.thumbnail}
                  className="w-28 h-28 object-cover rounded-xl"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {item.product?.title}
                  </h2>

                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        updateQuantity(item._id, "dec");
                      }}
                      className="w-8 h-8 border rounded-lg"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        updateQuantity(item._id, "inc");
                      }}
                      className="w-8 h-8 border rounded-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">₹{item.price}</p>
                  <p className="text-sm text-muted-foreground">
                    Total: ₹{item.total}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      removeItem(item._id);
                    }}
                    className="text-red-500 text-sm mt-3"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </Link>
            ) : null
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 rounded-2xl border bg-card space-y-6 h-fit sticky top-32">
          <h2 className="text-xl font-semibold">Shipping Address</h2>

          {["fullName", "phone", "addressLine", "city", "state", "pincode"].map(
            (field) => (
              <input
                key={field}
                name={field}
                type={field === "phone" ? "tel" : "text"}
                maxLength={field === "phone" ? 10 : undefined}
                value={shippingAddress[field as keyof typeof shippingAddress]} // ✅ IMPORTANT
                placeholder={field.replace(/([A-Z])/g, " $1")}
                onChange={(e) => {
                  if (field === "phone") {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);

                    setShippingAddress({
                      ...shippingAddress,
                      phone: value,
                    });
                  } else {
                    handleAddressChange(e);
                  }
                }}
                className="w-full border p-3 rounded-lg bg-background"
              />
            ),
          )}

          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-bold">₹{cartTotal}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black transition"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>

      {showAuthFlow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-md p-8 rounded-2xl bg-[#020617] border shadow-2xl">
            <button
              onClick={() => {
                setShowAuthFlow(false);
                setCurrentStep("login");
                setIsAuthCompleted(false);
              }}
              className="absolute top-3 right-3 text-white"
            >
              ✖
            </button>

            {currentStep === "login" && (
              <Login onOtpSent={() => setCurrentStep("verify")} />
            )}

            {currentStep === "verify" && (
              <Verify
                inline={true}
                onVerified={() => {
                  setIsAuthCompleted(true);
                  setShowAuthFlow(false);
                  setCurrentStep("login");
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
