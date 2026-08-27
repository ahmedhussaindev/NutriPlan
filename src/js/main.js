//==========================
//    IMPORT FUNCTIONS
//==========================
import { getMeals, getCategories, getAreas, filterMeals, searchMeals, getMealById, analyzeNutrition, searchProducts, getProductByBarcode, getProductCategories, getProductsByCategory } from "./api/mealdb.js";
import { mealCard, categoryCard, areaButton, allAreasButton, loadingSpinner, emptyState, productCard } from "./ui/components.js";

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
//        SECTIONS
//==========================
const mealDetailsSection = document.getElementById("meal-details");
const allRecipesSection = document.getElementById("all-recipes-section");
const searchFiltersSection = document.getElementById("search-filters-section");
const mealCategoriesSection = document.getElementById("meal-categories-section");
const scannerSection = document.getElementById("products-section");
const foodLogSection = document.getElementById("foodlog-section");

//==========================
//        PRODUCTS
//==========================
const productsGrid = document.getElementById("products-grid");
const productsCount = document.getElementById("products-count");
const productSearchInput = document.getElementById("product-search-input");
const searchProductBtn = document.getElementById("search-product-btn");
const barcodeInput = document.getElementById("barcode-input");
const lookupBarcodeBtn = document.getElementById("lookup-barcode-btn");
const productCategories = document.getElementById("product-categories");
const nutriScoreButtons = document.querySelectorAll(".nutri-score-filter");

//==========================
//       SIDEBAR NAV
//==========================
const mealsNav = document.getElementById("meals-nav");
const scannerNav = document.getElementById("scanner-nav");
const foodLogNav = document.getElementById("food-log-nav");

function setActiveNav(activeNav) {
    const navLinks = document.querySelectorAll(".nav-link");
    for (let link of navLinks) {
        link.classList.remove("bg-emerald-50", "text-emerald-700");
        link.classList.add("text-gray-600");
    }
    activeNav.classList.remove("text-gray-600");
    activeNav.classList.add("bg-emerald-50", "text-emerald-700");
}

mealsNav.addEventListener("click", function (e) {
    e.preventDefault();

    allRecipesSection.classList.remove("hidden");
    searchFiltersSection.classList.remove("hidden");
    mealCategoriesSection.classList.remove("hidden");

    mealDetailsSection.classList.add("hidden");
    scannerSection.classList.add("hidden");
    foodLogSection.classList.add("hidden");
    setActiveNav(mealsNav);
});

scannerNav.addEventListener("click", function (e) {
    e.preventDefault();

    allRecipesSection.classList.add("hidden");
    searchFiltersSection.classList.add("hidden");
    mealCategoriesSection.classList.add("hidden");
    mealDetailsSection.classList.add("hidden");

    scannerSection.classList.remove("hidden");
    foodLogSection.classList.add("hidden");
    setActiveNav(scannerNav);
});

foodLogNav.addEventListener("click", function (e) {
    e.preventDefault();

    allRecipesSection.classList.add("hidden");
    searchFiltersSection.classList.add("hidden");
    mealCategoriesSection.classList.add("hidden");
    mealDetailsSection.classList.add("hidden");

    scannerSection.classList.add("hidden");
    foodLogSection.classList.remove("hidden");
    setActiveNav(foodLogNav);
    updateFoodLog();
});

//==========================
//       BACK BUTTON
//==========================
const backButton = document.getElementById("back-to-meals-btn");

backButton.addEventListener("click", function () {

    mealDetailsSection.classList.add("hidden");

    allRecipesSection.classList.remove("hidden");
    searchFiltersSection.classList.remove("hidden");
    mealCategoriesSection.classList.remove("hidden");

});

//==========================
//     LOG MEAL BUTTON
//==========================
let currentMeal = null;
let currentNutrition = null;
let currentServings = 1;

const logMealButton = document.getElementById("log-meal-btn");
const logMealModal = document.getElementById("log-meal-modal");
const increaseServing = document.getElementById("increase-serving");
const decreaseServing = document.getElementById("decrease-serving");
const logServingCount = document.getElementById("log-serving-count");
const cancelLogMeal = document.getElementById("cancel-log-meal");
const confirmLogMeal = document.getElementById("confirm-log-meal");

logMealButton.addEventListener("click", function () {

    if (!currentMeal || !currentNutrition) {
        return;
    }
    currentServings = 1;
    document.getElementById("log-meal-image").src = currentMeal.thumbnail;
    document.getElementById("log-meal-image").alt = currentMeal.name;
    document.getElementById("log-meal-name").innerText = currentMeal.name;

    updateLogMealModal();

    logMealModal.classList.remove("hidden");
    logMealModal.classList.add("flex");
});

//==========================
//    UPDATE LOG MEAL 
//==========================
function updateLogMealModal() {
    logServingCount.innerText = currentServings;

    const calories = Math.round(currentNutrition.calories * currentServings);
    const protein = Math.round(currentNutrition.protein * currentServings);
    const carbs = Math.round(currentNutrition.carbs * currentServings);
    const fat = Math.round(currentNutrition.fat * currentServings);

    document.getElementById("log-calories").innerText = calories;
    document.getElementById("log-protein").innerText = `${protein}g`;
    document.getElementById("log-carbs").innerText = `${carbs}g`;
    document.getElementById("log-fat").innerText = `${fat}g`;
}

//==========================
//       LOG MEAL
//==========================
confirmLogMeal.addEventListener("click", function () {
    const loggedMeal = {
        id: currentMeal.id,
        name: currentMeal.name,
        thumbnail: currentMeal.thumbnail,
        servings: currentServings,
        calories: Math.round(currentNutrition.calories * currentServings),
        protein: Math.round(currentNutrition.protein * currentServings),
        carbs: Math.round(currentNutrition.carbs * currentServings),
        fat: Math.round(currentNutrition.fat * currentServings),
        date: new Date().toISOString()
    };

    const foodLog = JSON.parse(localStorage.getItem("foodLog")) || [];
    foodLog.push(loggedMeal);
    localStorage.setItem("foodLog", JSON.stringify(foodLog));
    updateFoodLog();
    updateWeeklyOverview();
    logMealModal.classList.add("hidden");
    logMealModal.classList.remove("flex");

    Swal.fire({
        icon: "success",
        title: "Meal Logged!",
        html: `
            <p><strong>${currentMeal.name}</strong>(${currentServings} servings) has been added to your daily log.</p>
            <p style="color:#10b981; font-size:24px; font-weight:bold; margin-top:10px;">+${loggedMeal.calories} calories</p>
        `,
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981"
    });

});

//==========================
//    CANCEL LOG MEAL
//==========================
cancelLogMeal.addEventListener("click", function () {
    logMealModal.classList.add("hidden");
    logMealModal.classList.remove("flex");
});

//==========================
//    SERVINGS BUTTONS
//==========================
increaseServing.addEventListener("click", function () {
    currentServings++;
    updateLogMealModal();
});

decreaseServing.addEventListener("click", function () {
    if (currentServings > 1) {
        currentServings--;
        updateLogMealModal();
    }
});

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

    const mealCards = document.querySelectorAll(".recipe-card");

    for (let card of mealCards) {

        card.addEventListener("click", async function () {
            const mealId = card.dataset.mealId;
            const data = await getMealById(mealId);
            const meal = data.result;

            const videoId = meal.youtube.split("v=")[1];
            document.getElementById("meal-video").src = `https://www.youtube.com/embed/${videoId}`;

            //HERO DATA
            document.getElementById("meal-image").src = meal.thumbnail;
            document.getElementById("meal-image").alt = meal.name;
            document.getElementById("meal-name").textContent = meal.name;
            document.getElementById("meal-category").textContent = meal.category;
            document.getElementById("meal-area").textContent = meal.area;

            // Hide Meals Page
            allRecipesSection.classList.add("hidden");
            searchFiltersSection.classList.add("hidden");
            mealCategoriesSection.classList.add("hidden");

            // Show Details Page
            mealDetailsSection.classList.remove("hidden");

            //==========================
            //      INGREDIENTS
            //==========================
            const ingredientsContainer = document.getElementById("ingredients-container");
            const ingredientsCount = document.getElementById("ingredients-count");

            ingredientsContainer.innerHTML = "";
            ingredientsCount.textContent = `${meal.ingredients.length} items`;

            for (let ingredient of meal.ingredients) {
                ingredientsContainer.innerHTML += `
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                    <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
                    <span class="text-gray-700"><span class="font-medium text-gray-900">${ingredient.measure}</span>
                    ${ingredient.ingredient}</span>
                </div>
            `;
            }

            //==========================
            //      INSTRUCTIONS
            //==========================
            const instructionsContainer = document.getElementById("instructions-container");

            instructionsContainer.innerHTML = "";

            for (let i = 0; i < meal.instructions.length; i++) {
                instructionsContainer.innerHTML += `
                <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">${i + 1}</div>
                    <p class="text-gray-700 leading-relaxed pt-2">${meal.instructions[i]}</p>
                </div>
            `;
            }

            //==========================
            //       NUTRITION
            //==========================

            const nutritionData = await analyzeNutrition(
                meal.name,
                meal.ingredients
            );

            const nutrition = nutritionData.data.perServing;
            const servings = nutritionData.data.servings;

            currentMeal = meal;
            currentNutrition = nutrition;
            currentServings = 1;

            document.getElementById("hero-servings").innerText = `${servings} servings`;
            document.getElementById("hero-calories").innerText = `${nutrition.calories} cal/serving`;
            document.getElementById("nutrition-calories").innerText = `${nutrition.calories}`;
            document.getElementById("nutrition-total-calories").innerText = `Total: ${nutrition.calories * nutritionData.data.servings} cal`;
            document.getElementById("nutrition-protein").innerText = `${nutrition.protein}g`;
            document.getElementById("nutrition-carbs").innerText = `${nutrition.carbs}g`;
            document.getElementById("nutrition-fat").innerText = `${nutrition.fat}g`;
            document.getElementById("nutrition-fiber").innerText = `${nutrition.fiber}g`;
            document.getElementById("nutrition-sugar").innerText = `${nutrition.sugar}g`;
            document.getElementById("nutrition-cholesterol").innerText = `${nutrition.cholesterol}mg`;
            document.getElementById("nutrition-saturated-fat").innerText = `${nutrition.saturatedFat}g`;
            document.getElementById("nutrition-sodium").innerText = `${nutrition.sodium}mg`;

            document.getElementById("protein-bar").style.width = `${nutrition.protein}%`;
            document.getElementById("carbs-bar").style.width = `${nutrition.carbs}%`;
            document.getElementById("fat-bar").style.width = `${nutrition.fat}%`;
            document.getElementById("fiber-bar").style.width = `${nutrition.fiber}%`;
            document.getElementById("sugar-bar").style.width = `${nutrition.sugar}%`;

        });
    }
}

//==========================
//      UPDATE DATE
//==========================
function updateFoodLogDate() {

    const today = new Date();
    const dateText = today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric"
    });
    document.getElementById("foodlog-date").innerText = dateText;
}

//==========================
//      UPDATE FOOD LOG
//==========================
function updateFoodLog() {

    const foodLog = JSON.parse(localStorage.getItem("foodLog")) || [];

    //==========================
    //       GET TODAY
    //==========================
    const today = new Date().toDateString();

    const todayMeals = foodLog.filter(function (meal) {
        return new Date(meal.date).toDateString() === today;
    });

    //==========================
    //     CALCULATE TOTALS
    //==========================
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    for (let meal of todayMeals) {

        totalCalories += meal.calories;
        totalProtein += meal.protein;
        totalCarbs += meal.carbs;
        totalFat += meal.fat;
    }

    //==========================
    //       GOALS
    //==========================
    const calorieGoal = 2000;
    const proteinGoal = 50;
    const carbsGoal = 250;
    const fatGoal = 65;

    //==========================
    //      UPDATE TEXT
    //==========================
    document.getElementById("foodlog-calories-text").innerText = `${totalCalories} / ${calorieGoal} kcal`;
    document.getElementById("foodlog-protein-text").innerText = `${totalProtein} / ${proteinGoal} g`;
    document.getElementById("foodlog-carbs-text").innerText = `${totalCarbs} / ${carbsGoal} g`;
    document.getElementById("foodlog-fat-text").innerText = `${totalFat} / ${fatGoal} g`;

    //==========================
    //      PROGRESS %
    //==========================
    const caloriesPercent = Math.min((totalCalories / calorieGoal) * 100, 100);
    const proteinPercent = Math.min((totalProtein / proteinGoal) * 100, 100);
    const carbsPercent = Math.min((totalCarbs / carbsGoal) * 100, 100);
    const fatPercent = Math.min((totalFat / fatGoal) * 100, 100);

    //==========================
    //       UPDATE BARS
    //==========================
    document.getElementById("foodlog-calories-bar").style.width = `${caloriesPercent}%`;
    document.getElementById("foodlog-protein-bar").style.width = `${proteinPercent}%`;
    document.getElementById("foodlog-carbs-bar").style.width = `${carbsPercent}%`;
    document.getElementById("foodlog-fat-bar").style.width = `${fatPercent}%`;

    //==========================
    //       LOGGED ITEMS
    //==========================
    const loggedItemsList = document.getElementById("logged-items-list");
    const loggedItemsTitle = document.querySelector("#foodlog-today-section h4");
    const clearButton = document.getElementById("clear-foodlog");

    loggedItemsTitle.innerText = `Logged Items (${todayMeals.length})`;

    //==========================
    //       EMPTY STATE
    //==========================
    if (todayMeals.length === 0) {

        loggedItemsList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
                <p class="font-medium">No meals logged today</p>
                <p class="text-sm">Add meals from the Meals page or scan products</p>
            </div>
        `;

        clearButton.style.display = "none";

        updateFoodLogDate();
        return;
    }

    clearButton.style.display = "block";

    //==========================
    //      DISPLAY MEALS
    //==========================
    loggedItemsList.innerHTML = "";

    for (let i = 0; i < todayMeals.length; i++) {

        let meal = todayMeals[i];

        const mealTime = new Date(meal.date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

        loggedItemsList.innerHTML += `
            <div class="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <img src="${meal.thumbnail}" alt="${meal.name}" class="w-16 h-16 rounded-xl object-cover">
                    <div>
                        <h5 class="font-bold text-gray-900">
                            ${meal.name}
                        </h5>
                        <p class="text-sm text-gray-500">
                            ${meal.servings} servings
                            <span class="mx-1">•</span>
                            <span class="text-emerald-600">Recipe</span>
                        </p>
                        <p class="text-xs text-gray-400 mt-1">${mealTime}</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="text-right">
                        <p class="text-xl font-bold text-emerald-600">${meal.calories}</p>
                        <p class="text-xs text-gray-500">kcal</p>
                    </div>
                    <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm">${meal.protein}g P</span>
                    <span class="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-sm">${meal.carbs}g C</span>
                    <span class="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-sm">${meal.fat}g F</span>
                    <button onclick="deleteMeal(${i})" class="text-gray-400 hover:text-red-500 transition-colors">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }
    updateFoodLogDate();
    updateWeeklyOverview();
}

//==========================
//       DELETE MEAL
//==========================
function deleteMeal(index) {
    const foodLog = JSON.parse(localStorage.getItem("foodLog")) || [];
    foodLog.splice(index, 1);
    localStorage.setItem("foodLog", JSON.stringify(foodLog));
    updateFoodLog();
    updateWeeklyOverview();
}
window.deleteMeal = deleteMeal;

//==========================
//     CLEAR FOOD LOG
//==========================
const clearFoodLog = document.getElementById("clear-foodlog");

clearFoodLog.addEventListener("click", function () {

    Swal.fire({
        title: "Clear Food Log?",
        text: "All today's meals will be removed.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, clear it",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#ef4444"
    }).then(function (result) {

        if (result.isConfirmed) {

            localStorage.removeItem("foodLog");
            updateFoodLog();
            updateWeeklyOverview();

            Swal.fire({
                icon: "success",
                title: "Cleared!",
                text: "Your food log has been cleared.",
                confirmButtonColor: "#10b981"
            });
        }
    });

});

//==========================
//  UPDATE WEEKLY OVERVIEW
//==========================
function updateWeeklyOverview() {

    const foodLog = JSON.parse(localStorage.getItem("foodLog")) || [];
    const weeklyChart = document.getElementById("weekly-chart");
    const today = new Date();
    const days = [];

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {

        const date = new Date(today);
        date.setDate(today.getDate() - i);
        days.push(date);
    }

    let weeklyHTML = `<div class="grid grid-cols-7 gap-2 w-full h-full items-center">`;

    for (let date of days) {

        const dateString = date.toDateString();

        // Get meals for this day
        const dayMeals = foodLog.filter(function (meal) {
            return new Date(meal.date).toDateString() === dateString;
        });

        // Calculate calories
        let totalCalories = 0;

        for (let meal of dayMeals) {
            totalCalories += meal.calories;
        }

        const isToday = date.toDateString() === today.toDateString();
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const dayNumber = date.getDate();

        if (isToday) {
            weeklyHTML += `
                <div class="h-40 rounded-xl bg-indigo-100 flex flex-col items-center justify-center">
                    <p class="text-sm text-gray-500">${dayName}</p>
                    <p class="text-lg font-semibold text-gray-900 mb-3">${dayNumber}</p>
                    <p class="text-2xl font-bold text-emerald-600">${totalCalories}</p>
                    <p class="text-xs text-emerald-600">kcal</p>
                    <p class="text-xs text-gray-500 mt-2">${dayMeals.length} ${dayMeals.length === 1 ? "item" : "items"}</p>
                </div>
            `;

        }
        else {
            weeklyHTML += `
                <div class="h-40 flex flex-col items-center justify-center rounded-xl">
                    <p class="text-sm text-gray-500">${dayName}</p>
                    <p class="text-lg font-semibold text-gray-900 mb-3">${dayNumber}</p>
                    <p class="text-2xl font-bold text-gray-300">${totalCalories}</p>
                    <p class="text-xs text-gray-300">kcal</p>
                </div>
            `;
        }
    }

    weeklyHTML += `</div>`;
    weeklyChart.innerHTML = weeklyHTML;
}

//==========================
//       SIDEBAR MENU
//==========================
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const headerMenuBtn = document.getElementById("header-menu-btn");
const sidebarCloseBtn = document.getElementById("sidebar-close-btn");

// OPEN SIDEBAR
headerMenuBtn.addEventListener("click", function () {
    sidebar.classList.add("active");
    sidebarOverlay.classList.add("active");
});

// CLOSE SIDEBAR
sidebarCloseBtn.addEventListener("click", function () {
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
});

// CLOSE WHEN CLICKING OUTSIDE
sidebarOverlay.addEventListener("click", function () {
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
});

//==========================
//     DISPLAY PRODUCTS
//==========================
function displayProducts(data) {

    productsGrid.innerHTML = "";

    if (data.results.length === 0) {

        productsGrid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div class="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                <i class="fa-solid fa-box-open text-4xl text-gray-400"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">No products to display</h3>
            <p class="text-gray-400">Search for a product or browse by category</p>
        </div>
        `;
        productsCount.innerText = "Search for products to see results";
        return;
    }

    productsCount.innerText = `${data.results.length} products`;

    for (let product of data.results) {
        productsGrid.innerHTML += productCard(product);
    }

    const productCards = document.querySelectorAll(".product-card");

    for (let card of productCards) {

        card.addEventListener("click", async function () {
            const barcode = card.dataset.barcode;
            const data = await getProductByBarcode(barcode);

            if (!data.result) {
                return;
            }
            showProductModal(data.result);
        });
    }
}

//==========================
//     SEARCH PRODUCTS
//==========================
searchProductBtn.addEventListener("click", async function () {

    const query = productSearchInput.value.trim();

    if (query === "") {
        return;
    }

    productsGrid.innerHTML = loadingSpinner();
    const data = await searchProducts(query);
    displayProducts(data);
});

//===============================
//  SEARCH PRODUCTS PRESS ENTER
//===============================
productSearchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        searchProductBtn.click();
    }
});

//=============================
//   LOOKUP PRODUCT BARCODE
//=============================
lookupBarcodeBtn.addEventListener("click", async function () {

    const barcode = barcodeInput.value.trim();

    if (barcode === "") {
        return;
    }

    productsGrid.innerHTML = loadingSpinner();

    const data = await getProductByBarcode(barcode);

    productsGrid.innerHTML = "";

    if (!data.result) {
        productsCount.innerText = "0 products";
        return;
    }
    productsCount.innerText = "1 product";

    productsGrid.innerHTML = productCard(data.result);
});

//===============================
//  LOOKUP PRODUCT PRESS ENTER
//===============================
barcodeInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        lookupBarcodeBtn.click();
    }
});

//==========================
//    DISPLAY CATEGORIES
//==========================
function displayCategories(data) {

    productCategories.innerHTML = "";

    for (let category of data.results) {

        productCategories.innerHTML += `
            <button
                class="product-category-btn px-5 py-3 bg-blue-500 text-white rounded-xl text-sm font-semibold whitespace-nowrap hover:scale-105 transition-all"
                data-category="${category.id}">
                ${category.name}
            </button>
        `;
    }

    const categoryButtons = document.querySelectorAll(".product-category-btn");

    for (let button of categoryButtons) {

        button.addEventListener("click", async function () {

            productsGrid.innerHTML = loadingSpinner();

            const category = button.dataset.category;

            const data = await getProductsByCategory(category);

            displayProducts(data);
        });
    }
}

//==========================
//       NUTRI-SCORE
//==========================
for (let button of nutriScoreButtons) {

    button.addEventListener("click", async function () {

        const grade = button.dataset.grade;
        const query = productSearchInput.value.trim();

        if (query === "") {
            return;
        }

        productsGrid.innerHTML = loadingSpinner();

        const data = await searchProducts(query);

        if (grade === "") {
            displayProducts(data);
            return;
        }

        const filteredProducts = data.results.filter(function (product) {
            return product.nutritionGrade === grade;
        });

        displayProducts({ results: filteredProducts });
    });
}

const productModal = document.getElementById("product-modal");
const productModalContent = document.getElementById("product-modal-content");
const closeProductModal = document.getElementById("close-product-modal");

function showProductModal(product) {

    const nutrition = product.nutrients;

    productModalContent.innerHTML = `
        <div class="flex items-start gap-6 mb-8">
            <div class="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center">
                <img
                    src="${product.image}"
                    class="w-full h-full object-contain rounded-xl"
                    alt="${product.name}">
            </div>
            <div class="flex-1">
                <p class="text-emerald-600 font-semibold">${product.brand || "Unknown Brand"}</p>
                <h2 class="text-3xl font-bold text-gray-900 mb-2">${product.name}</h2>
                <p class="text-gray-500 mb-4">Barcode: ${product.barcode}</p>
                <div class="flex gap-3">
                    <div class="bg-yellow-50 rounded-xl px-4 py-3">
                        <div class="flex items-center gap-2">
                            <span class="bg-yellow-400 text-white font-bold text-xl w-10 h-10 rounded-lg flex items-center justify-center">
                                ${(product.nutritionGrade || "?").toUpperCase()}
                            </span>
                            <div>
                                <p class="font-bold text-gray-900">Nutri-Score</p>
                                <p class="text-xs text-gray-500">Nutrition Grade</p>
                            </div>
                        </div>
                    </div>
                    ${product.novaGroup ? `
                        <div class="bg-red-50 rounded-xl px-4 py-3">
                            <div class="flex items-center gap-2">
                                <span class="bg-red-500 text-white font-bold text-xl w-10 h-10 rounded-full flex items-center justify-center">${product.novaGroup}</span>
                                <div>
                                    <p class="font-bold text-gray-900">NOVA</p>
                                    <p class="text-xs text-gray-500">Processing Group</p>
                                </div>
                            </div>
                        </div>` : ""}
                </div>
            </div>
        </div>
        <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6">
            <h3 class="text-xl font-bold text-gray-900 mb-6">
                <i class="fa-solid fa-chart-pie text-emerald-600 mr-2"></i>
                Nutrition Facts
                <span class="text-sm font-normal text-gray-500">(per 100g)</span>
            </h3>
            <div class="text-center mb-6">
                <p class="text-4xl font-bold text-gray-900">${Math.round(nutrition.calories || 0)}</p>
                <p class="text-gray-500">Calories</p>
            </div>
            <div class="grid grid-cols-4 gap-4">
                <div class="text-center">
                    <p class="text-2xl font-bold text-emerald-600">${Number(nutrition.protein || 0).toFixed(1)}g</p>
                    <p class="text-sm text-gray-500">Protein</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-blue-600">${Number(nutrition.carbs || 0).toFixed(1)}g</p>
                    <p class="text-sm text-gray-500">Carbs</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-purple-600">${Number(nutrition.fat || 0).toFixed(1)}g</p>
                    <p class="text-sm text-gray-500">Fat</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-orange-600">${Number(nutrition.sugar || 0).toFixed(1)}g</p>
                    <p class="text-sm text-gray-500">Sugar</p>
                </div>
            </div>
            <div class="border-t border-emerald-200 mt-6 pt-6 grid grid-cols-2 gap-4 text-center">
                <div>
                    <p class="text-xl font-bold text-gray-900">${Number(nutrition.fiber || 0).toFixed(1)}g</p>
                    <p class="text-sm text-gray-500">Fiber</p>
                </div>
                <div>
                    <p class="text-xl font-bold text-gray-900">${Number(nutrition.sodium || 0).toFixed(2)}g</p>
                    <p class="text-sm text-gray-500">Sodium</p>
                </div>
            </div>
        </div>
        ${product.ingredients ? `
            <div class="bg-gray-50 rounded-2xl p-6 mb-6">
                <h3 class="text-xl font-bold text-gray-900 mb-3">
                    <i class="fa-solid fa-list text-gray-600 mr-2"></i>
                    Ingredients
                </h3>
                <p class="text-gray-600 leading-relaxed">${product.ingredients}</p>
            </div>` : ""}
        ${product.allergens ? `
            <div class="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                <h3 class="text-xl font-bold text-red-600 mb-3">
                    <i class="fa-solid fa-triangle-exclamation mr-2"></i>
                    Allergens
                </h3>
                <p class="text-red-600">${product.allergens}</p>
            </div>` : ""}
        <div class="grid grid-cols-2 gap-4">
            <button id="log-product-btn" class="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-4 font-bold">
                <i class="fa-solid fa-plus mr-2"></i>
                Log This Food
            </button>
            <button id="close-product-modal-btn" class="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-4 font-bold">Close</button>
        </div>
    `;

    productModal.classList.remove("hidden");

    document.getElementById("log-product-btn").addEventListener("click", function () {

        const foodLog = JSON.parse(localStorage.getItem("foodLog")) || [];

        foodLog.push({
            name: product.name,
            thumbnail: product.image,
            calories: Math.round(nutrition.calories || 0),
            protein: Number(nutrition.protein || 0),
            carbs: Number(nutrition.carbs || 0),
            fat: Number(nutrition.fat || 0),
            servings: 1,
            date: new Date().toISOString()
        });

        localStorage.setItem("foodLog", JSON.stringify(foodLog));

        productModal.classList.add("hidden");

        updateFoodLog();
        updateWeeklyOverview();
    });

    document.getElementById("close-product-modal-btn")
        .addEventListener("click", function () {
            productModal.classList.add("hidden");
        });
}

closeProductModal.addEventListener("click", function () {
    productModal.classList.add("hidden");
});

productModal.addEventListener("click", function (e) {
    if (e.target === productModal) {
        productModal.classList.add("hidden");
    }
});

//==========================
//      QUICK LOG BUTTONS
//==========================
const quickLogButtons = document.querySelectorAll(".quick-log-btn");

// Log a Meal
quickLogButtons[0].addEventListener("click", function () {

    allRecipesSection.classList.remove("hidden");
    searchFiltersSection.classList.remove("hidden");
    mealCategoriesSection.classList.remove("hidden");

    mealDetailsSection.classList.add("hidden");
    scannerSection.classList.add("hidden");
    foodLogSection.classList.add("hidden");

    setActiveNav(mealsNav);
});

// Scan Product
quickLogButtons[1].addEventListener("click", function () {

    allRecipesSection.classList.add("hidden");
    searchFiltersSection.classList.add("hidden");
    mealCategoriesSection.classList.add("hidden");
    mealDetailsSection.classList.add("hidden");

    scannerSection.classList.remove("hidden");
    foodLogSection.classList.add("hidden");

    setActiveNav(scannerNav);
});

// Custom Entry
quickLogButtons[2].addEventListener("click", function () {

    // I DON'T KNOW WHAT SHOULD I DO IN THIS CASE 🤨 

});

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

    updateFoodLog();

    const productCategoriesData = await getProductCategories();

    displayCategories(productCategoriesData);
}

startApp();