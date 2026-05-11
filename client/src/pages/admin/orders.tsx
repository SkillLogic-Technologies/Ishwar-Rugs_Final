import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { toast } from "react-hot-toast";
import { ShoppingBag, Truck, Phone } from "lucide-react";

function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const BASE_URL = "/";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}api/order/all`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await axios.put(
        `${BASE_URL}api/order/admin/order/${orderId}/status`,
        { status },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Shipped":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "Delivered":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen pt-28  bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-neutral-950 text-black dark:text-white">

      {/* Title */}
      <h1 className="text-4xl font-bold mb-14 tracking-wide flex items-center gap-3">
        <ShoppingBag size={34} />
        Admin Orders
      </h1>

      {orders.length === 0 && (
        <p className="text-gray-500 text-lg">No orders found</p>
      )}

      {orders.map((order) => (
        <div
          key={order._id}
          className="mb-12 rounded-3xl border border-neutral-200 dark:border-neutral-800 
                     bg-white/70 dark:bg-neutral-900/60 
                     backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between gap-6 mb-10">
            <div>
              <p className="text-xl font-semibold tracking-wide">
                Order #{order._id.slice(-6).toUpperCase()}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {order.user?.username || order.user?.name} • {order.user?.email}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-2xl font-bold tracking-wide">
                ₹{order.totalAmount}
              </p>

              <span
                className={`inline-block mt-3 px-5 py-1.5 rounded-full border text-sm font-medium ${getStatusBadge(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-6">
            {order.items.map((item: any) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 
                           bg-neutral-50 dark:bg-neutral-800 
                           rounded-2xl p-5 transition hover:scale-[1.01]"
              >
                <Link href={`/product/${item.slug}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 rounded-xl object-cover cursor-pointer shadow"
                  />
                </Link>

                <div className="flex-1">
                  <Link href={`/product/${item.slug}`}>
                    <p className="font-semibold hover:underline cursor-pointer text-lg">
                      {item.title}
                    </p>
                  </Link>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <div className="text-lg font-semibold">
                  ₹{item.subtotal}
                </div>
              </div>
            ))}
          </div>

          {/* Shipping */}
          <div className="mt-10 border-t border-neutral-200 dark:border-neutral-800 pt-6">
            <h3 className="font-semibold text-lg mb-4 tracking-wide flex items-center gap-2">
              <Truck size={20} />
              Shipping Details
            </h3>

            <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p>{order.shippingAddress.pincode}</p>

              <p className="mt-2 font-medium flex items-center gap-2">
                <Phone size={16} />
                {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="mt-10 flex justify-end">
            <div className="relative">
              <select
                value={order.orderStatus}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
                className="appearance-none bg-black text-white dark:bg-white dark:text-black
                           px-6 py-3 pr-10 rounded-xl font-medium shadow-lg 
                           hover:scale-105 transition cursor-pointer"
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm">
                ▼
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;