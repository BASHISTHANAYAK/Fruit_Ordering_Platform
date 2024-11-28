import { AdminModel } from "../model/AdminSchema.js";
import { ProductModel } from "../model/ProductSchema.js";

// Create a new product
export const createProduct = async (req, res) => {
  const {
    productDetails: { name, price, description, image, category },
    adminId,
  } = req.body;
  console.log({ name, price, description, image, category, adminId });

  try {
    // Validate admin
    const admin = await AdminModel.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Create the product
    const product = new ProductModel({
      name,
      price,
      description,
      image,
      category,
      admin: adminId,
    });

    // Save the product
    await product.save();

    // Add the product to the admin's product list
    admin.products.push(product._id);
    await admin.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().populate("admin", "name email");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get products by admin
export const getProductsByAdmin = async (req, res) => {
  const { adminId } = req.params; // Fetch adminId from URL params

  try {
    // Find products created by a specific admin
    const products = await ProductModel.find({ admin: adminId }).populate(
      "admin",
      "name email"
    );

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found ." });
    }

    res
      .status(200)
      .json({ message: "Products retrieved successfully", products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single product by ID /getProductById/${productId}
export const getProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await ProductModel.findById(productId).populate(
      "admin",
      "name email"
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // Update a product by ID
// export const updateProduct = async (req, res) => {
//   const { id } = req.params;
//   const updates = req.body;

//   try {
//     const product = await ProductModel.findByIdAndUpdate(id, updates, {
//       new: true, // Return the updated document
//     });

//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     res.status(200).json({ message: "Product updated successfully", product });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  console.log("productId-", productId);

  try {
    // Find the product by ID and delete it
    const product = await ProductModel.findByIdAndDelete(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if the admin exists and ensure product's admin reference is valid
    const admin = await AdminModel.findById(product.admin);
    if (!admin) {
      return res
        .status(404)
        .json({ error: "Admin not found for this product" });
    }

    // Remove the product from the admin's product list
    await AdminModel.findByIdAndUpdate(product.admin, {
      $pull: { products: product._id },
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update a product

export const editProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, description, price, image, category } = req.body;

  try {
    // Find the product by ID
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Ensure the product belongs to the admin
    if (product.admin.toString() !== req.body.adminId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this product" });
    }

    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.image = image || product.image;
    product.category = category || product.category;

    // Save the updated product
    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "Product updated successfully", product });
};
