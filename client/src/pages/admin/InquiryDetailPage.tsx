"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "wouter";
import toast from "react-hot-toast";

export default function InquiryDetailPage() {
  const { id } = useParams();
  const [inquiry, setInquiry] = useState<any>(null);
  const [reply, setReply] = useState("");

  const handleReply = async () => {
    try {
      await axios.post(`http://localhost:5000/api/contact-us/${id}/reply`,
        { replyMessage: reply }
      );
      toast.success("Reply sent successfully");
      setReply("");

    } catch (error) {
      console.log(error);
      toast.error("Message sent failed")
    }
  };

  useEffect(() => {
    const fetchInquiry = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/contact-us/${id}`
      );
      setInquiry(res.data.data);
    };

    fetchInquiry();
  }, [id]);

  if (!inquiry)
    return (
      <div className="p-6 mt-20 text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );

  return (
    <div className="p-6 mt-20">
      <div
        className="max-w-3xl mx-auto rounded-xl shadow-md p-6 space-y-4
          bg-white text-gray-800
          dark:bg-black/10 dark:text-gray-200">
        <h2 className="text-2xl font-semibold border-b pb-3 border-gray-200 dark:border-gray-700">
          Inquiry Details
        </h2>

        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {inquiry.fullName}
          </p>

          <p>
            <span className="font-semibold">Email:</span>{" "}
            {inquiry.email}
          </p>

          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {inquiry.phone}
          </p>

          <p>
            <span className="font-semibold">Subject:</span>{" "}
            {inquiry.subject}
          </p>

          <p>
            <span className="font-semibold">Message:</span>{" "}
            {inquiry.message}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-2">Reply</h3>

          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-lg border outline-none transition
              bg-gray-50 text-gray-800 border-gray-300 focus:ring-2 focus:ring-blue-500
               dark:bg-black/10 dark:text-gray-200 dark:border-gray-700
              dark:focus:ring-blue-400"
            placeholder="Write your reply..."
          />

          <button
            onClick={handleReply}
            className=" bg-premium-gold text-white mt-2 px-4 py-2 rounded-lg shadow-md dark:bg-gradient-to-r
             dark:from-yellow-400 dark:to-yellow-600 dark:text-black ">
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
}