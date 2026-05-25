import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const dashboardRef = useRef(null);
  const productsRef = useRef(null);
  const analyticsRef = useRef(null);

  const [products, setProducts] = useState([]);

  const [formData, setFormData] =
    useState({
      name: "",
      price: "",
      description: "",
      image: "",
      category: "",
    });

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/products",
        formData
      );

      alert("Product Added");

      fetchProducts();

      setFormData({
        name: "",
        price: "",
        description: "",
        image: "",
        category: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/products/${id}`
      );

      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    navigate("/admin/login");
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* SIDEBAR */}

      <div className="w-[280px] bg-gray-950 border-r border-gray-800 p-8 hidden md:flex flex-col justify-between fixed h-screen">

        <div>
          <h1 className="text-4xl font-bold text-blue-500">
            Advantage
          </h1>

          <p className="text-gray-400 mt-2">
            Admin Panel
          </p>

          <div className="mt-12 flex flex-col gap-5">

            <button
              onClick={() =>
                scrollToSection(dashboardRef)
              }
              className="bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl transition"
            >
              Dashboard
            </button>

            <button
              onClick={() =>
                scrollToSection(productsRef)
              }
              className="bg-gray-900 hover:bg-blue-900 py-4 rounded-2xl transition"
            >
              Products
            </button>

            <button
              onClick={() =>
                scrollToSection(analyticsRef)
              }
              className="bg-gray-900 hover:bg-blue-900 py-4 rounded-2xl transition"
            >
              Analytics
            </button>
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-500 py-4 rounded-2xl transition"
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 md:ml-[280px] p-8">

        {/* DASHBOARD */}

        <section ref={dashboardRef}>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">

            <div>
              <h1 className="text-5xl font-bold">
                Admin Dashboard
              </h1>

              <p className="text-gray-400 mt-3 text-lg">
                Manage products and marketplace
              </p>
            </div>

            <div className="bg-blue-600 px-8 py-6 rounded-3xl shadow-2xl">
              <p className="text-sm text-gray-200">
                Total Products
              </p>

              <h2 className="text-5xl font-bold mt-2">
                {products.length}
              </h2>
            </div>
          </div>

          {/* STATS */}

          <div className="grid md:grid-cols-3 gap-8 mb-16">

            <div className="bg-gray-950 p-8 rounded-3xl">
              <p className="text-gray-400">
                Products
              </p>

              <h2 className="text-5xl font-bold mt-3 text-blue-500">
                {products.length}
              </h2>
            </div>

            <div className="bg-gray-950 p-8 rounded-3xl">
              <p className="text-gray-400">
                Categories
              </p>

              <h2 className="text-5xl font-bold mt-3 text-green-500">
                4
              </h2>
            </div>

            <div className="bg-gray-950 p-8 rounded-3xl">
              <p className="text-gray-400">
                Marketplace Status
              </p>

              <h2 className="text-3xl font-bold mt-5 text-green-400">
                Active
              </h2>
            </div>
          </div>
        </section>

        {/* PRODUCTS SECTION */}

        <section
          ref={productsRef}
          className="mb-20"
        >

          {/* ADD PRODUCT */}

          <form
            onSubmit={addProduct}
            className="bg-gray-950 p-8 rounded-3xl mb-14"
          >
            
            <h2 className="text-3xl font-bold mb-8">
              Add Product
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <input
                type="text"
                name="name"
                placeholder="Product Name"
                className="p-5 rounded-2xl bg-gray-900 outline-none"
                value={formData.name}
                onChange={handleChange}
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                className="p-5 rounded-2xl bg-gray-900 outline-none"
                value={formData.price}
                onChange={handleChange}
              />

              <input
                type="text"
                name="image"
                placeholder="Image URL"
                className="p-5 rounded-2xl bg-gray-900 outline-none"
                value={formData.image}
                onChange={handleChange}
              />

              <input
                type="text"
                name="category"
                placeholder="Category"
                className="p-5 rounded-2xl bg-gray-900 outline-none"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <textarea
              name="description"
              placeholder="Description"
              rows="5"
              className="w-full mt-5 p-5 rounded-2xl bg-gray-900 outline-none"
              value={formData.description}
              onChange={handleChange}
            />

            <button className="mt-6 bg-blue-600 hover:bg-blue-500 px-10 py-4 rounded-2xl font-semibold text-lg transition">
              Add Product
            </button>
          </form>

          {/* PRODUCT CARDS */}

          <h2 className="text-4xl font-bold mb-10">
            All Products
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {products.map((product) => (
              <div
                key={product._id}
                className="bg-gray-950 rounded-3xl overflow-hidden shadow-xl"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />

                <div className="p-6">

                  <div className="flex justify-between items-center">
                    
                    <h3 className="text-2xl font-bold">
                      {product.name}
                    </h3>

                    <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                      {product.category}
                    </span>
                  </div>

                  <p className="text-gray-400 mt-4 leading-relaxed">
                    {product.description}
                  </p>

                  <p className="text-blue-500 text-3xl font-bold mt-5">
                    ₹ {product.price}
                  </p>

                  <button
                    onClick={() =>
                      deleteProduct(product._id)
                    }
                    className="mt-6 w-full bg-red-600 hover:bg-red-500 py-4 rounded-2xl transition"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ANALYTICS */}

        <section ref={analyticsRef}>

          <h2 className="text-4xl font-bold mb-10">
            Analytics
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-gray-950 p-8 rounded-3xl">
              <p className="text-gray-400">
                Products Listed
              </p>

              <h2 className="text-5xl font-bold mt-4 text-blue-500">
                {products.length}
              </h2>
            </div>

            <div className="bg-gray-950 p-8 rounded-3xl">
              <p className="text-gray-400">
                Categories
              </p>

              <h2 className="text-5xl font-bold mt-4 text-green-500">
                4
              </h2>
            </div>

            <div className="bg-gray-950 p-8 rounded-3xl">
              <p className="text-gray-400">
                Marketplace
              </p>

              <h2 className="text-3xl font-bold mt-5 text-green-400">
                Running
              </h2>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;