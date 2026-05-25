import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState(null);

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

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white scroll-smooth">

      {/* NAVBAR */}

      <nav className="bg-gray-950 border-b border-gray-800 px-8 py-5 flex justify-between items-center sticky top-0 z-50">
        
        <div>
          <h1 className="text-3xl font-bold text-blue-500">
            Advantage Silchar
          </h1>

          <p className="text-sm text-gray-400">
            Electronics Marketplace
          </p>
        </div>

        <div className="hidden md:flex gap-8 text-gray-300">

          <a
            href="#home"
            className="hover:text-blue-500 transition"
          >
            Home
          </a>

          <a
            href="#products"
            className="hover:text-blue-500 transition"
          >
            Products
          </a>

          <a
            href="#about"
            className="hover:text-blue-500 transition"
          >
            About
          </a>

          <a
            href="#contact"
            className="hover:text-blue-500 transition"
          >
            Contact
          </a>
        </div>
      </nav>

      {/* HERO */}

      <section
        id="home"
        className="bg-gradient-to-r from-black via-gray-900 to-blue-950 px-10 py-20"
      >
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          
          <div>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Premium
              <span className="text-blue-500">
                {" "}Laptops
              </span>
              <br />
              Gaming PCs &
              Electronics
            </h2>

            <p className="text-gray-400 mt-6 text-lg leading-relaxed">
              Discover the latest laptops, gaming desktops,
              accessories and premium electronics at
              Advantage Silchar.
            </p>

            <div className="flex gap-4 mt-8">

              <a href="#products">
                <button className="bg-blue-600 hover:bg-blue-500 px-7 py-3 rounded-xl font-semibold">
                  Explore Products
                </button>
              </a>

              <a
                href="https://wa.me/919435070738"
                target="_blank"
                rel="noreferrer"
              >
                <button className="border border-green-500 text-green-400 hover:bg-green-500 hover:text-white px-7 py-3 rounded-xl">
                  WhatsApp Us
                </button>
              </a>
            </div>
          </div>

          <div>
            <img
              src="/shop.jpg"
              alt="Advantage Silchar"
              className="rounded-3xl shadow-2xl h-[500px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* SEARCH */}

      <section className="px-10 py-10">
        
        <div className="max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-lg outline-none focus:border-blue-500"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </section>

      {/* CATEGORIES */}

      <section className="px-10 py-6">

        <h2 className="text-3xl font-bold mb-8">
          Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div className="bg-gray-900 hover:bg-blue-900 transition p-8 rounded-2xl text-center shadow-lg">
            <h3 className="text-xl font-semibold">
              Laptops
            </h3>
          </div>

          <div className="bg-gray-900 hover:bg-blue-900 transition p-8 rounded-2xl text-center shadow-lg">
            <h3 className="text-xl font-semibold">
              Gaming PCs
            </h3>
          </div>

          <div className="bg-gray-900 hover:bg-blue-900 transition p-8 rounded-2xl text-center shadow-lg">
            <h3 className="text-xl font-semibold">
              Accessories
            </h3>
          </div>

          <div className="bg-gray-900 hover:bg-blue-900 transition p-8 rounded-2xl text-center shadow-lg">
            <h3 className="text-xl font-semibold">
              Networking
            </h3>
          </div>
        </div>
      </section>

      {/* ABOUT */}

      <section
        id="about"
        className="px-10 py-20 bg-gray-950"
      >
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          
          <div>
            <img
              src="/shop.jpg"
              alt="Store"
              className="rounded-3xl shadow-2xl"
            />
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-6">
              About Advantage Silchar
            </h2>

            <p className="text-gray-400 leading-relaxed text-lg">
              Advantage Silchar is a trusted electronics
              and computer showroom located in Silchar,
              Assam. We specialize in premium laptops,
              gaming PCs, accessories, networking devices,
              printers and modern electronics solutions.
            </p>

            <p className="text-gray-400 leading-relaxed text-lg mt-6">
              We provide high quality products, expert
              consultation and customer-focused support
              for students, professionals, gamers and
              businesses.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}

      <section
        id="products"
        className="px-10 py-14"
      >

        <div className="flex justify-between items-center mb-10">

          <h2 className="text-3xl font-bold">
            Featured Products
          </h2>

          <p className="text-gray-400">
            {filteredProducts.length} Products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-gray-900 rounded-3xl overflow-hidden shadow-xl hover:scale-105 transition duration-300"
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

                  <span className="bg-blue-600 text-sm px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>

                <p className="text-gray-400 mt-4 leading-relaxed">
                  {product.description}
                </p>

                <p className="text-blue-500 text-3xl font-bold mt-5">
                  ₹ {product.price}
                </p>

                <div className="flex gap-3 mt-6">

                  <button
                    onClick={() =>
                      setSelectedProduct(product)
                    }
                    className="w-full bg-white text-black hover:bg-gray-300 py-3 rounded-2xl font-semibold transition"
                  >
                    View Details
                  </button>

                  <a
                    href={`https://wa.me/919435070738?text=Hello%20I%20am%20interested%20in%20${product.name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full"
                  >
                    <button className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-2xl font-semibold transition">
                      WhatsApp
                    </button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}

      <footer
        id="contact"
        className="bg-gray-950 border-t border-gray-800 mt-20 px-10 py-10"
      >

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

          <div>
            <h3 className="text-2xl font-bold text-blue-500">
              Advantage Silchar
            </h3>

            <p className="text-gray-400 mt-4">
              Premium electronics and computer showroom
              offering laptops, gaming PCs and accessories.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">
              Quick Links
            </h4>

            <div className="flex flex-col gap-2 text-gray-400">
              <a href="#home">Home</a>
              <a href="#products">Products</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">
              Contact
            </h4>

            <div className="text-gray-400 flex flex-col gap-2">
              <p>Silchar, Assam</p>
              <p>+91 9435070738</p>
              <p>advantage@gmail.com</p>
              <p>Mon - Sat: 10:00 AM - 8:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500">
          © 2026 Advantage Silchar. All rights reserved.
        </div>
      </footer>

      {/* PRODUCT MODAL */}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 px-4">

          <div className="bg-gray-950 rounded-3xl max-w-4xl w-full overflow-hidden relative">

            <button
              onClick={() =>
                setSelectedProduct(null)
              }
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl"
            >
              X
            </button>

            <div className="grid md:grid-cols-2">

              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />

              <div className="p-8">

                <h2 className="text-4xl font-bold">
                  {selectedProduct.name}
                </h2>

                <p className="text-blue-500 text-3xl font-bold mt-4">
                  ₹ {selectedProduct.price}
                </p>

                <p className="text-gray-400 mt-6 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="mt-6">
                  <span className="bg-blue-600 px-4 py-2 rounded-full">
                    {selectedProduct.category}
                  </span>
                </div>

                <a
                  href={`https://wa.me/919435070738?text=Hello%20I%20want%20more%20details%20about%20${selectedProduct.name}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="mt-8 w-full bg-green-600 hover:bg-green-500 py-4 rounded-2xl text-lg font-semibold">
                    Chat on WhatsApp
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING WHATSAPP */}

      <a
        href="https://wa.me/919435070738"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-400 p-4 rounded-full shadow-2xl z-50"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
          alt="WhatsApp"
          className="w-10 h-10"
        />
      </a>
    </div>
  );
}

export default App;