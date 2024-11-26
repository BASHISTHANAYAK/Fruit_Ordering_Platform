import AllProductModel from "../model/allProducts.js";
import "../db_connection/mongoo.js";

// getting all products --> based on search/filters <==============================================================================>

const filterProduct = async (req, res) => {
  try {
    const { Select_Headphone_Type, Company, Colour, Price, Sort_by } =
      req.query.filteredData;

    console.log("A query:- ", Company);

    // query +++++++++++
    let queries = [];

    if (Select_Headphone_Type != "") {
      queries.push({ Heaadphonetype: Select_Headphone_Type });
    }
    if (Company != "") {
      queries.push({
        Company: { $regex: Company, $options: "i" },
      });
    }
    if (Colour != "") {
      queries.push({ ProductColor: { $regex: Colour, $options: "i" } });
    }
    if (Price != "") {
      let priceArr = Price.split("-");
      const minPrice = parseInt(priceArr[0]);
      const maxPrice = parseInt(priceArr[1]);

      queries.push({ Productprice: { $gte: minPrice, $lte: maxPrice } });
    }

    let qry =
      Select_Headphone_Type == "" &&
      Company == "" &&
      Colour == "" &&
      Price == ""
        ? {}
        : { $and: queries };

    // sorting ++++++++++++++++
    let sorting = {};

    if (Sort_by == "Lowest" || Sort_by == "Highest") {
      Sort_by == "Lowest"
        ? (sorting.Productprice = 1)
        : (sorting.Productprice = -1);
    } else if (Sort_by == "A-Z" || Sort_by == "Z-A") {
      Sort_by == "A-Z" ? (sorting.Company = 1) : (sorting.Company = -1);
    }

    // console.log("queries arr:- ", queries);
    // console.log("sorting:- ", sorting);

    const filteredProduct = await AllProductModel.find(qry).sort(sorting);

    // console.log("filteredProduct:- ", filteredProduct);

    filteredProduct.length > 0
      ? res.status(200).json(filteredProduct)
      : res.status(200).json({ message: "No data found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// geting product by id ===============================================================================>
const productById = async (req, res) => {
  try {
    const { _id } = req.params;
    const product = await AllProductModel.find({ _id }, { __v: 0 });
    if (product) {
      return res
        .status(200)
        .send({ IsFound: true, message: "item found", product });
    } else {
      return res
        .status(404)
        .send({ IsFound: false, message: "item not found", product });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unable to get product by its _id" });
  }
};

export { filterProduct, productById };
