//==========================
//    BASE URL DEFINING
//==========================
const BASE_URL = "https://nutriplan-api.vercel.app/api/meals";

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