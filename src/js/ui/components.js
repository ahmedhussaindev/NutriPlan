//===========================
//      LOADING DESIGN
//===========================
export function loadingSpinner() {
    return `
        <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
    `;
}

//===========================
//       EMPTY STATE
//===========================
export function emptyState() {
    return `
        <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
            </div>
            <p class="text-gray-500 text-lg">No recipes found</p>
            <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
        </div>
    `;
}

//===========================
//    MEAL CARD FUNCTION
//===========================
export function mealCard(meal) {
    return `
    <div
      class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
      data-meal-id="${meal.id}"
    >
      <div class="relative h-48 overflow-hidden">
        <img
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src="${meal.thumbnail}"
          alt="${meal.name}"
          loading="lazy"
        />

        <div class="absolute bottom-3 left-3 flex gap-2">
          <span
            class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700"
          >
            ${meal.category}
          </span>

          <span
            class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"
          >
            ${meal.area || "Unknown"}
          </span>
        </div>
      </div>

      <div class="p-4">
        <h3
          class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
        >
          ${meal.name}
        </h3>

        <p class="text-xs text-gray-600 mb-3 line-clamp-2">
          ${meal.instructions[0]}
        </p>

        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-gray-900">
            <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
            ${meal.category}
          </span>

          <span class="font-semibold text-gray-500">
            <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
            ${meal.area || "Unknown"}
          </span>
        </div>
      </div>
    </div>
  `;
}

//===========================
//  CATEGORY CARD FUNCTION
//===========================
function getCategoryStyle(categoryName) {
    if (categoryName === "Beef") {
        return {
            icon: "fa-drumstick-bite",
            color: "bg-gradient-to-br from-red-400 to-rose-500",
            background: "bg-gradient-to-br from-red-50 to-rose-50",
            border: "border-red-200 hover:border-red-400"
        };
    }

    if (categoryName === "Chicken") {
        return {
            icon: "fa-drumstick-bite",
            color: "bg-gradient-to-br from-amber-400 to-orange-500",
            background: "bg-gradient-to-br from-amber-50 to-orange-50",
            border: "border-amber-200 hover:border-amber-400"
        };
    }

    if (categoryName === "Dessert") {
        return {
            icon: "fa-cake-candles",
            color: "bg-gradient-to-br from-pink-400 to-rose-500",
            background: "bg-gradient-to-br from-pink-50 to-rose-50",
            border: "border-pink-200 hover:border-pink-400"
        };
    }

    if (categoryName === "Lamb") {
        return {
            icon: "fa-drumstick-bite",
            color: "bg-gradient-to-br from-orange-400 to-amber-500",
            background: "bg-gradient-to-br from-orange-50 to-amber-50",
            border: "border-orange-200 hover:border-orange-400"
        };
    }

    if (categoryName === "Miscellaneous") {
        return {
            icon: "fa-bowl-rice",
            color: "bg-gradient-to-br from-slate-400 to-gray-500",
            background: "bg-gradient-to-br from-slate-50 to-gray-50",
            border: "border-slate-200 hover:border-slate-400"
        };
    }

    if (categoryName === "Pasta") {
        return {
            icon: "fa-bowl-food",
            color: "bg-gradient-to-br from-yellow-400 to-amber-500",
            background: "bg-gradient-to-br from-yellow-50 to-amber-50",
            border: "border-yellow-200 hover:border-yellow-400"
        };
    }

    if (categoryName === "Pork") {
        return {
            icon: "fa-bacon",
            color: "bg-gradient-to-br from-rose-400 to-red-500",
            background: "bg-gradient-to-br from-rose-50 to-red-50",
            border: "border-rose-200 hover:border-rose-400"
        };
    }

    if (categoryName === "Seafood") {
        return {
            icon: "fa-fish",
            color: "bg-gradient-to-br from-cyan-400 to-blue-500",
            background: "bg-gradient-to-br from-cyan-50 to-blue-50",
            border: "border-cyan-200 hover:border-cyan-400"
        };
    }

    if (categoryName === "Side") {
        return {
            icon: "fa-plate-wheat",
            color: "bg-gradient-to-br from-green-400 to-emerald-500",
            background: "bg-gradient-to-br from-green-50 to-emerald-50",
            border: "border-green-200 hover:border-green-397"
        };
    }

    if (categoryName === "Starter") {
        return {
            icon: "fa-utensils",
            color: "bg-gradient-to-br from-teal-400 to-cyan-500",
            background: "bg-gradient-to-br from-teal-50 to-cyan-50",
            border: "border-teal-200 hover:border-teal-400"
        };
    }

    if (categoryName === "Vegan") {
        return {
            icon: "fa-leaf",
            color: "bg-gradient-to-br from-emerald-400 to-green-500",
            background: "bg-gradient-to-br from-emerald-50 to-green-50",
            border: "border-emerald-200 hover:border-emerald-400"
        };
    }

    if (categoryName === "Vegetarian") {
        return {
            icon: "fa-seedling",
            color: "bg-gradient-to-br from-lime-400 to-green-500",
            background: "bg-gradient-to-br from-lime-50 to-green-50",
            border: "border-lime-200 hover:border-lime-400"
        };
    }
    return {
        icon: "fa-seedling",
        color: "bg-gradient-to-br from-lime-400 to-green-500",
        background: "bg-gradient-to-br from-lime-50 to-green-50",
        border: "border-lime-200 hover:border-lime-400"
    };
}

//===========================
//  CATEGORY CARDS FUNCTION
//===========================
export function categoryCard(category) {
    const style = getCategoryStyle(category.name);

    return `
    <div
    class="category-card ${style.background} rounded-xl p-3 border ${style.border} hover:shadow-md cursor-pointer transition-all group"
    data-category="${category.name}"
    >
    <div class="flex items-center gap-2.5">
    
    <div
    class="text-white w-9 h-9 ${style.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
    >
    <i class="fa-solid ${style.icon}"></i>
    </div>
    
    <div>
    <h3 class="text-sm font-bold text-gray-900">
    ${category.name}
    </h3>
    </div>
    
    </div>
    </div>
    `;
}

//===========================
//   AREAS BUTTONS FUNCTION
//===========================
export function areaButton(area) {
    return `
    <button 
    class="area-filter-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all"
    data-area="${area.name}">
    ${area.name}
    </button>
  `;
}

//===========================
//     ALL AREAS BUTTON
//===========================
export function allAreasButton() {
    return `
    <button 
        class="area-filter-btn px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap"
        data-area="">
        All Cuisines
    </button>
    `;
}

//===========================
//      PRODUCT CARD
//===========================
export function productCard(product) {

    const nutrition = product.nutrients;

    return `
        <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            data-barcode="${product.barcode}">
            <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    src="${product.image || 'https://via.placeholder.com/400x300?text=No+Image'}"
                    alt="${product.name}"
                    loading="lazy"/>
                <!-- Nutri-Score Badge -->
                <div class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                    Nutri-Score ${product.nutritionGrade || "Unknown"}
                </div>
                <!-- NOVA Badge -->
                ${product.novaGroup ? `
                <div
                    class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    title="NOVA ${product.novaGroup}">
                    ${product.novaGroup}
                </div> ` : ""}
            </div>
            <div class="p-4">
                <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">${product.brand || "Unknown Brand"}</p>
                <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">${product.name}</h3>
                <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span><i class="fa-solid fa-barcode mr-1"></i>${product.barcode}</span>
                    <span><i class="fa-solid fa-fire mr-1"></i> ${Math.round(nutrition.calories)} kcal/100g</span>
                </div>
                <!-- Mini Nutrition -->
                <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                        <p class="text-xs font-bold text-emerald-700"> ${nutrition.protein}g</p>
                        <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                        <p class="text-xs font-bold text-blue-700">${nutrition.carbs}g</p>
                        <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                        <p class="text-xs font-bold text-purple-700">${nutrition.fat}g</p>
                        <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                        <p class="text-xs font-bold text-orange-700">${nutrition.sugar}g</p>
                        <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}