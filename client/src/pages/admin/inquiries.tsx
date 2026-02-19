import AdminLayout from "./AdminLayout"; // ✅ Sidebar wrapper
import React, { useEffect, useState } from "react";
import { Inquiry } from "@shared/schema";
import axios from "axios";

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await axios.get("/api/inquiries");

        const inquiriesArray =
          res.data?.inquiries ||
          res.data?.data ||
          res.data?.data?.inquiries ||
          [];

        setInquiries(Array.isArray(inquiriesArray) ? inquiriesArray : []);
      } catch (err) {
        console.error("Failed to fetch inquiries:", err);
        setInquiries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  return (
    <AdminLayout>
      {" "}
      {/* ✅ Wrap everything */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Inquiries</h2>

        {loading ? (
          <p>Loading...</p>
        ) : inquiries.length === 0 ? (
          <p>No inquiries found.</p>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="border rounded p-4 shadow-sm bg-white"
              >
                <div className="mb-2">
                  <strong>Name:</strong> {inq.name}
                </div>
                <div className="mb-2">
                  <strong>Email:</strong> {inq.email}
                </div>
                {inq.phone && (
                  <div className="mb-2">
                    <strong>Phone:</strong> {inq.phone}
                  </div>
                )}
                <div className="mb-2">
                  <strong>Subject:</strong> {inq.subject}
                </div>
                <div className="mb-2">
                  <strong>Message:</strong> {inq.message}
                </div>
                <div className="text-sm text-gray-500">
                  <strong>Type:</strong> {inq.type || "general"} |{" "}
                  {new Date(inq.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default InquiriesPage;
