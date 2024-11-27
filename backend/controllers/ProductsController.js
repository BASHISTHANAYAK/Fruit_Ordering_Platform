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

// Get a single product by ID
// export const getProductById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const product = await ProductModel.findById(id).populate(
//       "admin",
//       "name email"
//     );
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

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

// // Delete a product by ID
// export const deleteProduct = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const product = await ProductModel.findByIdAndDelete(id);

//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     // Remove the product from the admin's product list
//     await AdminModel.findByIdAndUpdate(product.admin, {
//       $pull: { products: product._id },
//     });

//     res.status(200).json({ message: "Product deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
