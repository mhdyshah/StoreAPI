const Product = require("../models/Products");

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({
            price: {
                $gt: 30
            }
        })
        .sort("price") // for sorting result
        .select("name price") // for choosing which item user need to show
        .limit(4) // how many item will display 
        .skip(3); // skip the third item in list
    res.status(200).json({
        products,
        nbHits: products.length,
    });
};

const getAllProducts = async (req, res) => {
    const {
        featured,
        company,
        name,
        sort,
        fields,
        numericFilters
    } = req.query;
    const queryObject = {};

    if (featured) {
        queryObject.featured = featured === "true" ? true : false;
    }

    if (company) {
        queryObject.company = company;
    }

    if (name) {
        queryObject.name = {
            $regex: name,
            $option: "i",
        };
    }

    // numericFilters
    if (numericFilters) {
        const operatorMap = {
            ">": '$gt',
            "<": '$lt',
            ">=": '$gte',
            "<=": '$lte',
            "=": 'eq'
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        );
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = {
                    [operator]: Number(value)
                };
            }
        });
    }

    // console.log(queryObject);

    let result = Product.find(queryObject);

    // sort
    if (sort) {
        const sortList = sort.split(",").join(" ");
        result = result.sort(sortList);
    } else {
        result = result.sort("createdAt");
    }
    // filtering result (which part you need to show)
    if (fields) {
        const fieldsList = fields.split(",").join(" ");
        result = result.select(fieldsList);
    }

    // pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)

    const products = await result;
    res.status(200).json({
        products,
        nbHits: products.length,
    });
};

module.exports = {
    getAllProductsStatic,
    getAllProducts,
};