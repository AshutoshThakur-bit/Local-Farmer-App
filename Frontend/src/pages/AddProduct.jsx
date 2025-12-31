import axios from "axios";
import { useState, useEffect } from "react";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [data, setData] = useState({ 
    title: "", 
    description: "", 
    price: "", 
    stock: "" 
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // Check user role on mount
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Decode JWT to get user role
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("User payload:", payload);
        
        // Note: We need to get the full user data including role
        // For now, we'll fetch from a user endpoint or store role in localStorage after login
        const storedRole = localStorage.getItem("userRole");
        setUserRole(storedRole);
        setLoading(false);

        if (storedRole !== "Farmer") {
          swal("Access Denied", "Only farmers can add products", "error").then(() => {
            navigate("/");
          });
        }
      } catch (err) {
        console.error("Error checking role:", err);
        navigate("/login");
      }
    };

    checkUserRole();
  }, [navigate]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        swal("Error", "Image size must be less than 5MB", "error");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const submit = async () => {
    if (!data.title || !data.description || !data.price || !data.stock || !image) {
      return swal("Error", "Please fill all required fields", "error");
    }

    if (userRole !== "Farmer") {
      return swal("Error", "Only farmers can create products", "error");
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("stock", data.stock);
      formData.append("image", image);

      const res = await axios.post("/products/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      swal("Success", res.data.message, "success").then(() => {
        navigate("/");
      });

      // Reset form
      setData({ title: "", description: "", price: "", stock: "" });
      setImage(null);
      setPreview("");
    } catch (err) {
      console.error("Error:", err);
      swal("Error", err.response?.data?.message || "Failed to create product", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  if (userRole !== "Farmer") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-2xl text-red-600 font-bold">Access Denied</p>
          <p className="text-gray-600 mt-2">Only farmers can add products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 py-10 px-4">
      <div className="bg-white w-full max-w-xl shadow-xl rounded-2xl p-6">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Add New Product
        </h1>

        {/* Image Upload */}
        <div className="mb-5">
          <label className="block text-lg font-medium mb-2 text-gray-700">
            Upload Product Image <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center gap-4">
            {/* Preview box */}
            {preview ? (
              <img 
                src={preview} 
                alt="Preview" 
                className="w-24 h-24 rounded-lg object-cover shadow" 
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              disabled={submitting}
              className="block w-full text-sm text-gray-700 
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-100 file:text-blue-700
                       hover:file:bg-blue-200"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">Max 5MB, formats: jpeg, jpg, png, gif, webp</p>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2 text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter product title"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            disabled={submitting}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2 text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Enter product description"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            disabled={submitting}
            className="w-full border rounded-lg p-3 h-24 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Price and Stock (Grid) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-medium mb-2 text-gray-700">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Price"
              value={data.price}
              onChange={(e) => setData({ ...data, price: e.target.value })}
              disabled={submitting}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2 text-gray-700">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Stock"
              value={data.stock}
              onChange={(e) => setData({ ...data, stock: e.target.value })}
              disabled={submitting}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={submit}
          disabled={submitting}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition text-white font-semibold py-3 rounded-xl text-lg shadow-lg"
        >
          {submitting ? "Creating Product..." : "Create Product"}
        </button>
      </div>
    </div>
  );
}
