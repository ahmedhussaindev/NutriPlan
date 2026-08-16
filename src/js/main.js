//==========================
//    IMPORT FUNCTIONS
//==========================
import { getMeals, getCategories, getAreas, filterMeals, searchMeals } from "./api/mealdb.js";
import { mealCard, categoryCard, areaButton, allAreasButton, loadingSpinner, emptyState } from "./ui/components.js";

//==================================
//  RECIPES COUNT & GRID DEFFINING
//==================================
const recipesGrid = document.getElementById("recipes-grid");
const recipesCount = document.getElementById("recipes-count");

//==========================
//       SHOW LOADING
//==========================
function showLoading() {
    recipesGrid.innerHTML = loadingSpinner();
}

//==========================
//      DISPLAY MEALS
//==========================
function displayMeals(data, type = "", value = "") {

    recipesGrid.innerHTML = "";

    if (type === "search") {
        recipesCount.textContent = `Showing ${data.results.length} recipes for "${value}"`;
    }
    else if (type === "category") {
        recipesCount.textContent = `Showing ${data.results.length} ${value} recipes`;
    }
    else if (type === "area") {
        recipesCount.textContent = `Showing ${data.results.length} ${value} recipes`;
    }
    else {
        recipesCount.textContent = `Showing ${data.results.length} recipes`;
    }

    if (data.results.length === 0) {
        recipesGrid.innerHTML = emptyState();
        return;
    }

    for (let meal of data.results) {
        recipesGrid.innerHTML += mealCard(meal);
    }
}

//==========================
//    START APP FUNCTION
//==========================
async function startApp() {

    //==========================
    //   GET MEALS & SHOW IT
    //==========================
    const data = await getMeals();
    displayMeals(data);

    //==========================
    // GET CATEGORIES & SHOW IT
    //==========================
    const categoriesData = await getCategories();
    const categoriesGrid = document.getElementById("categories-grid");

    categoriesGrid.innerHTML = "";

    const categories = categoriesData.results.slice(0, 12);

    for (let category of categories) {
        categoriesGrid.innerHTML += categoryCard(category);
    }

    //==========================
    //   GET AREAS & SHOW IT
    //==========================
    const areasData = await getAreas();
    const areasContainer = document.getElementById("areas-container");

    areasContainer.innerHTML = "";

    areasContainer.innerHTML += allAreasButton();

    const areas = areasData.results.slice(0, 10);

    for (let area of areas) {
        areasContainer.innerHTML += areaButton(area);
    }

    //==========================
    //  CATEGORY FILTER MEALS
    //==========================
    const categoryCards = document.querySelectorAll(".category-card");

    for (let card of categoryCards) {
        card.addEventListener("click", async function () {
            const category = card.dataset.category;

            showLoading();

            const data = await filterMeals("category", category);

            displayMeals(data, "category", category);
        });
    }

    //==========================
    //    AREA FILTER MEALS
    //==========================

    // ACTIVE AREA BUTTON STYLE
    function setActiveArea(button) {
        const areaButtons = document.querySelectorAll(".area-filter-btn");

        for (let btn of areaButtons) {
            btn.classList.remove("bg-emerald-600", "text-white");
            btn.classList.add("bg-gray-100", "text-gray-700", "hover:bg-gray-200", "transition-all");
        }

        button.classList.remove("bg-gray-100", "text-gray-700", "hover:bg-gray-200", "transition-all");
        button.classList.add("bg-emerald-600", "text-white");
    }

    const areaButtons = document.querySelectorAll(".area-filter-btn");

    for (let button of areaButtons) {
        button.addEventListener("click", async function () {

            setActiveArea(button);

            const area = button.dataset.area;

            showLoading();

            if (area === "") {
                const data = await getMeals();
                displayMeals(data);
            }
            else {
                const data = await filterMeals("area", area);
                displayMeals(data, "area", area);
            }
        });
    }

    //==========================
    //       SEARCH MEALS
    //==========================
    const searchInput = document.getElementById("search-input");

    searchInput.addEventListener("input", async function () {

        showLoading();

        const query = searchInput.value;
        const data = await searchMeals(query);

        displayMeals(data, "search", query)
    });
}

startApp();