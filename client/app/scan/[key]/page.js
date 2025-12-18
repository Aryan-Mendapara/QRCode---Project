"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ScanPage({ params }) {
  const { key } = params;
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/qrcode/scan/${key}`
        );
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [key]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Decoded QR Data</h1>
        <p className="mb-2">
          <b>Key:</b> {data.key}
        </p>
        <p className="mb-2 break-all">
          <b>URL:</b> {data.url}
        </p>
        <a
          href={data.url}
          target="_blank"
          className="text-blue-600 underline"
        >
          Open Link
        </a>
      </div>
    </div>
  );
}
