//==========================
//    IMPORT FUNCTIONS
//==========================
import { getMeals, getCategories, getAreas, filterMeals, searchMeals, getMealById, analyzeNutrition } from "./api/mealdb.js";
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
//        SECTIONS
//==========================
const mealDetailsSection = document.getElementById("meal-details");
const allRecipesSection = document.getElementById("all-recipes-section");
const searchFiltersSection = document.getElementById("search-filters-section");
const mealCategoriesSection = document.getElementById("meal-categories-section");
const scannerSection = document.getElementById("products-section");
const foodLogSection = document.getElementById("foodlog-section");


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