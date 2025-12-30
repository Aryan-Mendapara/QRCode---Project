import axios from "axios";

// Add QR Code
export const addQRCode = async (data) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/project/qrcode/add-qrcode`, data);
    return response.data; 
  } catch (err) {
    if (err.response?.status === 409) {
      alert("❌ This QR key already exists");
    }
    throw err;
  }
};

// Get all QR Codes
export const getQRCodes = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/project/qrcode/get-qrcodes`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching QR codes:", error);
    throw error;
  }
};

// Update QR Code by ID
export const updateQRCode = async (id, data) => {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/project/qrcode/update-qrcode/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating QR code:", error);
    throw error;
  }
};

// Delete QR Code by ID
export const deleteQRCode = async (id) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/project/qrcode/delete-qrcode/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting QR code:", error);
    throw error;
  }
};

export const scanQRCode = async (req, res) => {
  try {
    const { key } = req.params;

    const qr = await getQRCodeByKey(key);

    if (!qr) {
      return res.status(404).json({ error: "QR not found" });
    }

    res.redirect(qr.url);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

