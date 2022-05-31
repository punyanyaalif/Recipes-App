const meals = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav_meals');

getRandomMeal();
fetchFavMeals();

// acak menu buat ditampilin di layar
// get random menu 
async function getRandomMeal() {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');

    const respData = await resp.json();
    const randomMeal = respData.meals[0];
    
    addMeal(randomMeal, true);
}

// nampilin foto makanan yg udah ditentuin
// post food pic by ID
async function getMealById(id) {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);

    const respData = await resp.json();

    const meal = respData.meals[0];

    return meal;
}

// nampilin makanan berdasarkan pencarian
// show food search result
async function getMealsBySearch(term) {
    const meals = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+term);
}

// nampilin makanan scr otomatis
// automaticaly post food pic
function addMeal(mealData, random = false) {

    console.log(mealData);
    const meal = document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = `
    <div class="meal_header">
        ${random ? `<span class="random"> Random Meals </span>` : ''}
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"/>
    </div>
    <div class="meal_body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav_btn">
            <i class="far fa-heart"></i>
        </button>
    </div>`;

    // buat tombol like-nya bisa diinteraksi 
    // interactable like button
    const btn = meal.querySelector(".meal_body .fav_btn");

    btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) {
            removeMealLS(mealData.idMeal);
            btn.classList.remove("active");
        } else {
            addMealLS(mealData.idMeal);
            btn.classList.add("active");
        }
    });

    meals.appendChild(meal);
}

// memproses total like
// processing amount of likes
// LS = Local Storage
function addMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id) => id !== mealId)));
}


function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));
    
    // kalo hasilnya null, iterate yg ada aja
    
    return mealIds === null ? [] : mealIds;
}


async function fetchFavMeals() {
    const mealIds = getMealsLS();
 
    for(let i=0; i<mealIds.length; i++) {
        const mealId = mealIds[i];
        meal = await getMealById(mealId);
        
        addFavMeal(meals);
    }
    
}

function addFavMeal(mealData) {
    
    const favMeal = document.createElement('li');
    
    favMeal.innerHTML = `
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"/><span>${mealData.strMeal}</span>`;
    favoriteContainer.appendChild(favMeal);
}