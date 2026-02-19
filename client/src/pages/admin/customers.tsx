import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  orders: {
    id: number;
  }[];
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/customers")
      .then((res) => {
        const customersArray =
          res.data?.customers ||
          res.data?.data ||
          res.data?.data?.customers ||
          [];

        setCustomers(Array.isArray(customersArray) ? customersArray : []);
      })
      .catch((err) => {
        console.error("Failed to fetch customers:", err);
        setCustomers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Customers</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-border rounded-lg overflow-hidden">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Orders</th>
                  <th className="px-4 py-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-t">
                    <td className="px-4 py-2">{customer.id}</td>
                    <td className="px-4 py-2">{customer.name}</td>
                    <td className="px-4 py-2">{customer.email}</td>
                    <td className="px-4 py-2">{customer.phone || "-"}</td>
                    <td className="px-4 py-2">{customer.orders.length}</td>
                    <td className="px-4 py-2">
                      {new Date(customer.createdAt).toLocaleDateString()}
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

export default AdminCustomers;
