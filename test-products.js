const axios = require("axios");

const API_URL = "http://localhost:5000/api";

async function testProducts() {
  try {
    console.log("Testing Products API...\n");

    // Test 1: Get all products
    console.log("1. Fetching all products...");
    const productsRes = await axios.get(`${API_URL}/products`);
    console.log(`Found ${productsRes.data.length} products`);
    console.log("Products:", JSON.stringify(productsRes.data, null, 2));

    if (productsRes.data.length === 0) {
      console.log("\n2. No products found! Creating sample data...");

      // Register a farmer
      console.log("   - Registering farmer...");
      const registerRes = await axios.post(`${API_URL}/auth/register`, {
        name: "Farmer John",
        email: "farmer@test.com",
        password: "password123"
      });
      console.log("   - Farmer registered!");

      // Login as farmer
      console.log("   - Logging in farmer...");
      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email: "farmer@test.com",
        password: "password123"
      });
      const token = loginRes.data.token;
      console.log("   - Farmer logged in!");

      // Add sample products
      const products = [
        {
          title: "Fresh Organic Tomatoes",
          description: "High-quality farm-grown tomatoes, perfect for salads and cooking",
          price: 40,
          stock: 100,
          image: "https://via.placeholder.com/300x300?text=Tomatoes"
        },
        {
          title: "Carrots (1kg)",
          description: "Fresh, crunchy carrots full of vitamins",
          price: 30,
          stock: 150,
          image: "https://via.placeholder.com/300x300?text=Carrots"
        },
        {
          title: "Organic Spinach",
          description: "Leafy green spinach, rich in iron and nutrients",
          price: 25,
          stock: 80,
          image: "https://via.placeholder.com/300x300?text=Spinach"
        },
        {
          title: "Fresh Broccoli",
          description: "Green broccoli heads, perfect for healthy meals",
          price: 50,
          stock: 60,
          image: "https://via.placeholder.com/300x300?text=Broccoli"
        },
        {
          title: "Potatoes (2kg)",
          description: "Best quality potatoes for all your cooking needs",
          price: 60,
          stock: 200,
          image: "https://via.placeholder.com/300x300?text=Potatoes"
        }
      ];

      for (const product of products) {
        console.log(`   - Adding ${product.title}...`);
        await axios.post(`${API_URL}/products/create`, product, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      console.log("   - All products added!");

      // Fetch products again
      console.log("\n3. Fetching products again...");
      const productsRes2 = await axios.get(`${API_URL}/products`);
      console.log(`Found ${productsRes2.data.length} products`);
      console.log("Products:", JSON.stringify(productsRes2.data, null, 2));
    }

    console.log("\n✅ Products API test completed!");
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
}

testProducts();
