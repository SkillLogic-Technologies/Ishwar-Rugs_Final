import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

interface Order {
  id: number;
  customer: {
    name: string;
    email: string;
  };
  product: {
    name: string;
  };
  quantity: number;
  status: string;
  createdAt: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/orders")
      .then((res) => {
        const ordersArray =
          res.data?.orders || res.data?.data || res.data?.data?.orders || [];

        setOrders(Array.isArray(ordersArray) ? ordersArray : []);
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Orders</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-border rounded-lg overflow-hidden">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">
                      <div>{order.customer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.customer.email}
                      </div>
                    </td>
                    <td className="px-4 py-2">{order.product.name}</td>
                    <td className="px-4 py-2">{order.quantity}</td>
                    <td className="px-4 py-2">
                      <span className="capitalize">{order.status}</span>
                    </td>
                    <td className="px-4 py-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
