//==========================
//    BASE URL DEFINING
//==========================
const BASE_URL = "https://nutriplan-api.vercel.app/api/meals";
const NUTRITION_URL = "https://nutriplan-api.vercel.app/api/nutrition";
const PRODUCTS_URL = "https://nutriplan-api.vercel.app/api/products";

//==========================
//    GET MEALS FUNCTION
//==========================
export async function getMeals() {
    const response = await fetch(`${BASE_URL}/search?q=chicken&page=1&limit=25`);
    const data = await response.json();
    return data;
}

//===========================
//  GET CATEGORIES FUNCTION
//===========================
export async function getCategories() {
    const response = await fetch(`${BASE_URL}/categories`);
    const data = await response.json();
    return data;
}

//===========================
//    GET AREAS FUNCTION
//===========================
export async function getAreas() {
    const response = await fetch(`${BASE_URL}/areas`);
    const data = await response.json();
    return data;
}

//===========================
//   FILTER MEALS FUNCTION
//===========================
export async function filterMeals(type, value) {
    const response = await fetch(`${BASE_URL}/filter?${type}=${value}&page=1&limit=25`);
    const data = await response.json();
    return data;
}

//===========================
//   SEARCH MEALS FUNCTION
//===========================
export async function searchMeals(query) {
    const response = await fetch(`${BASE_URL}/search?q=${query}&page=1&limit=25`);
    const data = await response.json();
    return data;
}

//===========================
//      GET MEAL BY ID
//===========================
export async function getMealById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    const data = await response.json();
    return data;
}

//===========================
//   ANALYZE NUTRITION
//===========================
export async function analyzeNutrition(recipeName, ingredients) {

    const ingredientsList = [];

    for (let item of ingredients) {
        ingredientsList.push(`${item.measure} ${item.ingredient}`);
    }

    const response = await fetch(`${NUTRITION_URL}/analyze`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "x-api-key": "LSZ4c4Kivm3CFOIXUhwuYf0y0x88VOb9CxXTLQb4"
        },

        body: JSON.stringify({
            recipeName: recipeName,
            ingredients: ingredientsList
        })
    });

    const data = await response.json();
    return data;
}

//===========================
//   SEARCH PRODUCTS
//===========================
export async function searchProducts(query) {
    const response = await fetch(`${PRODUCTS_URL}/search?q=${query}&page=1&limit=24`);
    const data = await response.json();
    return data;
}

//===========================
//   PRODUCT BY BARCODE
//===========================
export async function getProductByBarcode(barcode) {
    const response = await fetch(`${PRODUCTS_URL}/barcode/${barcode}`);
    const data = await response.json();
    return data;
}

//===========================
//   PRODUCT CATEGORIES
//===========================
export async function getProductCategories() {
    const response = await fetch(`${PRODUCTS_URL}/categories`);
    const data = await response.json();
    return data;
}

//===========================
//   PRODUCTS BY CATEGORY
//===========================
export async function getProductsByCategory(category) {
    const response = await fetch(`${PRODUCTS_URL}/category/${category}?page=1&limit=24`);
    const data = await response.json();
    return data;
}