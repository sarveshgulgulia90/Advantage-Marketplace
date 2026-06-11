// server/routes/components.js
const express = require('express');
const router = express.Router();
const ComponentPrice = require('../models/ComponentPrice');
const adminAuth = require('../middleware/adminAuth');

// @desc    Get all components grouped by category
// @route   GET /api/components
// @access  Public
router.get('/', async (req, res) => {
  try {
    const components = await ComponentPrice.find({});

    // Group components by category
    const grouped = {};
    components.forEach(component => {
      if (!grouped[component.category]) {
        grouped[component.category] = [];
      }
      grouped[component.category].push(component);
    });

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching components', error: error.message });
  }
});

// @desc    Seed default component prices from PCBuilder data
// @route   POST /api/components/seed
// @access  Private/Admin
router.post('/seed', adminAuth, async (req, res) => {
  try {
    // Import the COMPONENTS data from PCBuilder.jsx
    // Since we can't directly import JSX, we'll define the data here
    // matching what's in src/PCBuilder.jsx
    const COMPONENTS = {
      CPU: {
        label: "Processor (CPU)", icon: "⚙️", required: true,
        options: [
          { id: "i3-12100",  name: "Intel Core i3-12100",   brand: "Intel", socket: "LGA1700", ram: "DDR4/DDR5", tdp: 60,  price: 8500  },
          { id: "i5-12400",  name: "Intel Core i5-12400",   brand: "Intel", socket: "LGA1700", ram: "DDR4/DDR5", tdp: 65,  price: 13000 },
          { id: "i5-13600k", name: "Intel Core i5-13600K",  brand: "Intel", socket: "LGA1700", ram: "DDR4/DDR5", tdp: 125, price: 21000 },
          { id: "i7-12700",  name: "Intel Core i7-12700",   brand: "Intel", socket: "LGA1700", ram: "DDR4/DDR5", tdp: 65,  price: 26000 },
          { id: "r5-5600",   name: "AMD Ryzen 5 5600",      brand: "AMD",   socket: "AM4",     ram: "DDR4",      tdp: 65,  price: 11500 },
          { id: "r5-7600x",  name: "AMD Ryzen 5 7600X",     brand: "AMD",   socket: "AM5",     ram: "DDR5",      tdp: 105, price: 18500 },
          { id: "r7-7700x",  name: "AMD Ryzen 7 7700X",     brand: "AMD",   socket: "AM5",     ram: "DDR5",      tdp: 105, price: 28000 },
        ]
      },
      Motherboard: {
        label: "Motherboard", icon: "🖥️", required: true,
        options: [
          { id: "h610m",    name: "MSI H610M Pro-S",         socket: "LGA1700", ram: "DDR4", maxRam: 64,  price: 6500  },
          { id: "h610k",    name: "Asus Prime H610M-K",       socket: "LGA1700", ram: "DDR4", maxRam: 64,  price: 7200  },
          { id: "b660m",    name: "MSI B660M Pro-A",          socket: "LGA1700", ram: "DDR4", maxRam: 128, price: 9500  },
          { id: "b660k",    name: "Asus Prime B660M-K",       socket: "LGA1700", ram: "DDR4", maxRam: 128, price: 9000  },
          { id: "b550m",    name: "MSI B550M Pro-VDH WiFi",   socket: "AM4",     ram: "DDR4", maxRam: 128, price: 8500  },
          { id: "b550a",    name: "Asus Prime B550M-A",       socket: "AM4",     ram: "DDR4", maxRam: 128, price: 8000  },
          { id: "b650m",    name: "MSI B650M Pro-A",          socket: "AM5",     ram: "DDR5", maxRam: 192, price: 12500 },
          { id: "b650e",    name: "Asus Prime B650M-A WiFi",  socket: "AM5",     ram: "DDR5", maxRam: 192, price: 13500 },
        ]
      },
      RAM: {
        label: "RAM (Memory)", icon: "💾", required: true,
        options: [
          { id: "8d4",  name: "8GB DDR4 3200MHz",  type: "DDR4", size: 8,  price: 2200 },
          { id: "16d4", name: "16GB DDR4 3200MHz", type: "DDR4", size: 16, price: 3800 },
          { id: "32d4", name: "32GB DDR4 3200MHz", type: "DDR4", size: 32, price: 7500 },
          { id: "16d5", name: "16GB DDR5 4800MHz", type: "DDR5", size: 16, price: 5500 },
          { id: "32d5", name: "32GB DDR5 4800MHz", type: "DDR5", size: 32, price: 10000},
        ]
      },
      Storage: {
        label: "Storage", icon: "💿", required: true,
        options: [
          { id: "256ssd",  name: "256GB NVMe SSD",  type: "SSD", size: 256,  price: 2500  },
          { id: "512ssd",  name: "512GB NVMe SSD",  type: "SSD", size: 512,  price: 3500  },
          { id: "1tssd",   name: "1TB NVMe SSD",    type: "SSD", size: 1024, price: 6500  },
          { id: "2tssd",   name: "2TB NVMe SSD",    type: "SSD", size: 2048, price: 12000 },
          { id: "1thdd",   name: "1TB HDD 7200RPM", type: "HDD", size: 1024, price: 3200  },
          { id: "2thdd",   name: "2TB HDD 7200RPM", type: "HDD", size: 2048, price: 5500  },
          { id: "512+1t",  name: "512GB SSD + 1TB HDD (Combo)", type: "Combo", size: 1536, price: 6500 },
        ]
      },
      GPU: {
        label: "Graphics Card (GPU)", icon: "🎮", required: false,
        options: [
          { id: "none",   name: "No GPU (Use CPU Integrated Graphics)", brand: "—",    vram: 0,  price: 0     },
          { id: "1650",   name: "NVIDIA GTX 1650 4GB",                 brand: "NVIDIA", vram: 4,  price: 14000 },
          { id: "3060",   name: "NVIDIA RTX 3060 12GB",                brand: "NVIDIA", vram: 12, price: 25000 },
          { id: "3060ti", name: "NVIDIA RTX 3060 Ti 8GB",              brand: "NVIDIA", vram: 8,  price: 30000 },
          { id: "4060",   name: "NVIDIA RTX 4060 8GB",                 brand: "NVIDIA", vram: 8,  price: 32000 },
          { id: "4060ti", name: "NVIDIA RTX 4060 Ti 16GB",             brand: "NVIDIA", vram: 16, price: 42000 },
          { id: "rx6600", name: "AMD RX 6600 8GB",                     brand: "AMD",   vram: 8,  price: 22000 },
          { id: "rx7600", name: "AMD RX 7600 8GB",                     brand: "AMD",   vram: 8,  price: 27000 },
        ]
      },
      Cabinet: {
        label: "Cabinet (Case)", icon: "🗳️", required: true,
        options: [
          { id: "basic",  name: "Basic ATX Cabinet",                    formFactor: "ATX",   price: 2500 },
          { id: "cm690",  name: "Cooler Master MasterBox Q300L",        formFactor: "mATX",  price: 3500 },
          { id: "mid",    name: "Mid Tower ATX Cabinet",                formFactor: "ATX",   price: 4500 },
          { id: "midglass", name: "Mid Tower ATX with Tempered Glass",   formFactor: "ATX",   price: 5500 },
          { id: "full",   name: "Full Tower ATX Cabinet",               formFactor: "ATX",   price: 7000 },
        ]
      },
      PSU: {
        label: "Power Supply (PSU)", icon: "🔌", required: true,
        options: [
          { id: "450w",  name: "450W 80+ Standard",       wattage: 450, rating: "Standard", price: 3000 },
          { id: "550wb", name: "550W 80+ Bronze",          wattage: 550, rating: "Bronze",   price: 4500 },
          { id: "650wg", name: "650W 80+ Gold",            wattage: 650, rating: "Gold",     price: 6500 },
          { id: "750wg", name: "750W 80+ Gold",            wattage: 750, rating: "Gold",     price: 8000 },
          { id: "850wg", name: "850W 80+ Gold",            wattage: 850, rating: "Gold",     price: 10000},
        ]
      },
      Cooler: {
        label: "CPU Cooler", icon: "❄️", required: false,
        options: [
          { id: "stock",  name: "Stock Cooler (Comes with CPU)",        type: "Air",    price: 0    },
          { id: "hm212",  name: "Cooler Master Hyper 212 Black",        type: "Air",    price: 2500 },
          { id: "noctua", name: "Noctua NH-U12S",                       type: "Air",    price: 5500 },
          { id: "aio240", name: "240mm AIO Liquid Cooler",              type: "Liquid", price: 6000 },
          { id: "aio360", name: "360mm AIO Liquid Cooler",              type: "Liquid", price: 9000 },
        ]
      },
    };

    // Clear existing components and seed with default data
    await ComponentPrice.deleteMany({});

    const componentDocs = [];

    // Flatten the COMPONENTS data into documents for ComponentPrice model
    for (const [category, categoryData] of Object.entries(COMPONENTS)) {
      for (const option of categoryData.options) {
        componentDocs.push({
          category: category,
          componentId: option.id,
          name: option.name,
          price: option.price,
          inStock: true, // Default to in stock
          note: "" // Empty note
        });
      }
    }

    // Insert all components
    const seededComponents = await ComponentPrice.insertMany(componentDocs);

    res.json({
      message: `Successfully seeded ${seededComponents.length} components`,
      count: seededComponents.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding components', error: error.message });
  }
});

// @desc    Update a single component price
// @route   PUT /api/components/:category/:componentId
// @access  Private/Admin
router.put('/:category/:componentId', adminAuth, async (req, res) => {
  try {
    const { category, componentId } = req.params;
    const { name, price, inStock, note } = req.body;;

    // Validate input
    if (price === undefined || price === null || price < 0) {
      return res.status(400).json({ message: 'Price is required and must be non-negative' });
    }

    // Find and update the component
    const updatedComponent = await ComponentPrice.findOneAndUpdate(
  { category, componentId },
  {
    category,
    componentId,
    name,
    price: Number(price),
    inStock: inStock !== undefined ? !!inStock : true,
    note: note !== undefined ? note : ""
  },
  {
    new: true,
    upsert: true,
    runValidators: true
  }
);

    if (!updatedComponent) {
      return res.status(404).json({ message: 'Component not found' });
    }

    res.json(updatedComponent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating component', error: error.message });
  }
});

module.exports = router;