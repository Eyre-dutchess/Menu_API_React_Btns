//nav
const headerBtn = document.querySelector(".header-btn");
const headerNav = document.querySelector(".header-nav");
headerBtn.addEventListener("click", ()=>{
    const visibility  = headerNav.getAttribute("data-visible");
    if(visibility === "false"){
        headerBtn.setAttribute("aria-expanded", true);
        headerNav.setAttribute("data-visible", true);
    }
    else{
        headerBtn.setAttribute("aria-expanded", false);
        headerNav.setAttribute("data-visible", false);
    }
})

//hero-text
const heroEl = document.querySelector(".hero-section");
let lastScroll = 0;
window.addEventListener("scroll", ()=>{
    const currentScroll = window.scrollY;
    if(currentScroll>lastScroll){
        heroEl.classList.add("scroll-down");
        heroEl.classList.remove("scroll-up");
    }else{
        heroEl.classList.add("scroll-up");
        heroEl.classList.remove("scroll-down");
    }
    lastScroll = currentScroll
})


//title intersect
const sectionTitles= document.querySelectorAll("[data-title]");
const option = {
    rootMargin: "-50px"
};
const titleObserver = new IntersectionObserver(function(entries, observe){
    entries.forEach(entry=>{
        entry.target.classList.toggle("active", entry.isIntersecting);
    })
}, option)

sectionTitles.forEach(sectionTitle=>{
    titleObserver.observe(sectionTitle);
})


//random-recipe
const randomContainer = document.querySelector("[data-random-container]");
const listContainer = document.querySelector("[data-random-list-container]");    
const randomMealItems = Array.from(listContainer.children);
const favContainer = document.querySelector("[data-fav-container]");

const LOCAL_STORAGE_FAVMEAL_KEY = "fav_meal";
let favMeals = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVMEAL_KEY))||[]; 

const APIURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?tags=vegetarian%2Cdessert&number=';
const similarURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/';

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '35f365fc2fmsh8376c7b8d7d70fdp1ef93ejsn52596223556e',
		'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
	}
};

getMeals(APIURL + 1)
function getMeals(url){
    fetch(url, options)
    .then(resp=> resp.json())
    .then(data=>{
        const randomMeal = data.recipes[0];
        displayFocusMeal(randomMeal);        
        // getSimilarMeals(similarURL+randomMeal.id+`/similar`);
    })
}

getSimilarMeals(APIURL + 0, 0);
getSimilarMeals(APIURL + 1, 1);
getSimilarMeals(APIURL + 2, 2);
function getSimilarMeals(url, i){
    fetch(url, options)
    .then(resp=> resp.json())
    .then(data=> {
        const similarMeal = data.recipes[0]
        displaySimilarMeals(similarMeal, i)
    })
    
}


// const randomMeals = [getSimilarMeals(APIURL + 1), getSimilarMeals(APIURL + 2), getSimilarMeals(APIURL + 3)];
// console.log(randomMeals)


// window.addEventListener("DOMContentLoaded", ()=>{
    
//     displaySimilarMeals([getMeals(APIURL + 1),getMeals(APIURL + 2),getMeals(APIURL + 3) ])

// })

function displaySimilarMeals(meal, i){
    const mealItem = randomMealItems[i];
    mealItem.classList.add("recmend-item");
    randomMealItems[0].classList.add("active");
    mealItem.innerHTML = `
             <img src="${meal.image}" alt="">
             <h6 class="recmend-name">${meal.title}</h6>
     `
     listContainer.append(mealItem);
 }
 

function displayFocusMeal(meal){
    randomContainer.innerHTML = `
        <div class="focus-img"><img src="${meal.image}" alt="" ></div>
        <div class="focus-content">
            <h6 class="focus-name">${meal.title}</h6>
            <p>${meal.dishTypes[0]}/healthScore: ${meal.healthScore}</p>
        </div>
        <button class="like-btn"></button>
    `
    const likeBtn = randomContainer.querySelector(".like-btn");
    likeBtn.addEventListener("click", ()=>{
        if(!likeBtn.classList.contains("active")){
            likeBtn.classList.add("active");
            const newFavMeal = createFavMeal(meal);
            favMeals.push(newFavMeal);
            saveANDrender();
        }else{
            likeBtn.classList.remove("active");
            favMeals = favMeals.filter(favMeal=> favMeal.id !== meal.id);
            saveANDrender()
        }
    })
}

//GET similar meals width ID

// function getSimilarMeals(url){
//     fetch(url, options)
//     .then(resp=> resp.json())
//     .then(data=>{
//         console.log(data.slice(0, 3));
//         displaySimilarMeals(data.slice(0, 3))
//     })}

//GET the FIRST two highest nutrients

// function displayNutrient(meal){
//     const newArray = meal.nutrition.nutrients.sort((a, b)=> {
//         return b.amount-a.amount});
//     return newArray.map(item=>item.name).slice(0, 2) ;
    
// }
function createFavMeal (meal){
    return {
        id: meal.id,
        name: meal.title,
        img: meal.image,
    }
}
function saveLS(){
    localStorage.setItem(LOCAL_STORAGE_FAVMEAL_KEY , JSON.stringify(favMeals));
}
function saveANDrender(){
    saveLS();
    renderFav();
}
function renderFav(){
    clearContainer(favContainer);
    favMeals.forEach(favMeal=>{
        const favItem = document.createElement("li");
        favItem.classList.add("fav-item");
        favItem.innerHTML = `
                <img src="${favMeal.img}" alt="" class="fav-img">
                <p class="fav-name">${favMeal.name}</p>
        `
        favContainer.append(favItem)
    })
    
}
renderFav()
function clearContainer(item){
    while(item.firstChild){
        item.removeChild(item.firstChild)
    }
}

const favBtn = document.querySelector(".fav-btn");
const recmendSection = document.querySelector("[data-recmend-section]");
const searchSection = document.querySelector("[data-search-section]");
const showFavSections = document.querySelectorAll("[data-fav-show-section]");

favBtn.addEventListener("click", ()=>{
    favBtn.classList.toggle("active");
    favBtn.parentElement.classList.toggle("active")
})

const favOptions ={ 
    rootMargin: "-50px"
};
const favSectionObserver = new IntersectionObserver(function(entries, observe){
    entries.forEach(entry=>{
        entry.target.parentElement.classList.toggle("fav-active", entry.isIntersecting);
    })
}, favOptions)

showFavSections.forEach(showFavSection=>{
    favSectionObserver.observe(showFavSection);
})
// const recSectionHeight = recmendSection.getBoundingClientRect().height;
// const seaSectionHeight = searchSection.getBoundingClientRect().height;
// window.addEventListener("scroll", ()=>{
//     const recSectionToTop = recmendSection.getBoundingClientRect().top;
//     const recSectionToBot = recmendSection.getBoundingClientRect().bottom;
//     const seaSectionToTop = searchSection.getBoundingClientRect().top;
//     const seaSectionToBot = searchSection.getBoundingClientRect().bottom;
   
//     if(recSectionToTop < recSectionHeight /2 || recSectionToBot > recSectionHeight/2 ){
//         favBtn.classList.add("show");
//     }
//     if(recSectionToTop > recSectionHeight /2 || recSectionToBot < recSectionHeight/2 ){
//        {
//         favBtn.classList.remove("show");
//         }
//     }
// })











const searchAPIURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=" ;
// const searchOptions = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': '35f365fc2fmsh8376c7b8d7d70fdp1ef93ejsn52596223556e',
// 		'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
// 	}
// };


//search-recipe
function getMealBySearch(url, a, b){
// function getMealBySearch(url){
        fetch(url)
        .then(resp=> resp.json())
        .then(data=>{
            const searchMeals = data.meals.slice(a,b);
            // const searchMeals = data.meals;
            console.log(searchMeals);
            displaySearchedMeals(searchMeals)
            const categories = searchMeals.map(item=>item.strArea)  ;
            const cateList = searchMeals.reduce((values, item) =>{
                if(!values.includes(item.strArea)){
                    values.push(item.strArea)
                }
                return values
            }, ["All"]);
            displayFilterBtns(cateList);
            const filterBtns = filterBtnContainer.querySelectorAll(".filter-btn");
            
            filterBtns.forEach(filterBtn=>{
                filterBtn.addEventListener("click", (e)=>{
                    const currentCate = e.target.dataset.ID;
                    const currentMeals = searchMeals.filter((item)=>{
                        if(item.strArea === currentCate){
                            return item;
                        }
                    })
                    if(currentCate === "all"){
                        displaySearchedMeals(searchMeals); 
                    }else{
                        displaySearchedMeals(currentMeals);
                    }
                })
            })
        })
    }


const searchForm = document.querySelector("[data-search-form]");
const searchInput = document.querySelector("[data-search-input]");
const searchContainer = document.querySelector("[data-search-container]")
const refreshBtn = document.querySelector(".refresh-search-btn");
const filterBtnContainer = document.querySelector("[data-filter-btn-container]");

searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const searchTerm = searchInput.value;
    if(searchTerm == null || searchTerm === "") return;
    getMealBySearch(searchAPIURL + searchTerm, 0, 10);
    getMealBySearch(searchAPIURL + searchTerm);
    refreshBtn.addEventListener("click", ()=>{
            searchContainer.classList.remove("anima");
            getMealBySearch(searchAPIURL + searchTerm, 10, 20);
            })
    // let randomIndex = 0;
    // refreshBtn.addEventListener("click", ()=>{
    //     searchContainer.classList.remove("anima");
    //     // const randomIndex =  Math.floor(Math.random()*2)*5;
    //     randomIndex ++;
    //         getMealBySearch(searchAPIURL + searchTerm, randomIndex, randomIndex + 5);
    //     }

    // )
    
})

function displayFilterBtns(btns){
    clearContainer(filterBtnContainer);
    btns.forEach(btn=>{
        const cateBtn = document.createElement("button");
        cateBtn.classList.add("filter-btn");
        cateBtn.dataset.ID = btn;
        cateBtn.innerText = btn;
        filterBtnContainer.append(cateBtn);
    })
   
}
function displaySearchedMeals(meals){
    clearContainer(searchContainer);
    meals.forEach(meal=>{
        const mealItem = document.createElement("li");
        mealItem.classList.add("search-item");
        mealItem.innerHTML = `
                <img src="${meal.strMealThumb}" alt="" class="search-img">
                <h6 class="searched-name">${meal.strMeal}</h6>
                <button class="like-search-btn"><i class="fa fa-heart"></i></button>
                <button class="extand-btn" aria-expanded="false"><i class="fa fa-pencil"></i></button>
                <ul class="plan-week-btn-list" data-visible="false">
                    <li class="plan-week-item"><button>Monday</button></li>
                    <li class="plan-week-item"><button>Tuesday</button></li>
                    <li class="plan-week-item"><button>Wednesday</button></li>
                    <li class="plan-week-item"><button>Thursday</button></li>
                    <li class="plan-week-item"><button>Friday</button></li>
                    <li class="plan-week-item"><button>Saturday</button></li>
                    <li class="plan-week-item"><button>Sunday</button></li>
                </ul>
       
        `
        const likeSearchBtn = mealItem.querySelector(".like-search-btn");
        if(favMeals.find(favMeal=> favMeal.id === meal.id) ? likeSearchBtn.classList.add("active") : likeSearchBtn.classList.remove("active"));
        likeSearchBtn.addEventListener("click", ()=>{
            if(!likeSearchBtn.classList.contains("active")){
                likeSearchBtn.classList.add("active");
                const newFavMeal = createFavMeal(meal);
                favMeals.push(newFavMeal);
                saveANDrender();
            }else{
                likeSearchBtn.classList.remove("active");
                favMeals = favMeals.filter(favMeal=> favMeal.id !== meal.id);
                saveANDrender()
            }
        })
        searchContainer.classList.add("anima");
        searchContainer.append(mealItem);
    })
}
















//Plan recipe
const mainContainer = document.querySelector("[data-container]");
const addNewBtn = document.querySelector("[data-add-btn]");

const LOCAL_STORAGE_DAILYPLAN_KEY = "daily_plans";
let dailyMeals = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DAILYPLAN_KEY))||[];
const LOCAL_STORAGE_PLANID_KEY = "meal_plan_ID";
let selectedMealID = localStorage.getItem(LOCAL_STORAGE_PLANID_KEY)

addNewBtn.addEventListener("click", (e)=>{
    const targetBtn = e.target.tagName.toLowerCase() === "i" ? e.target.parentElement : e.target;
    const newPlan = createNewDaily("newNote");
    dailyMeals.push(newPlan);
    saveANDrenderPlan();
})


function createNewDaily(dayName){
    return {
        id: Date.now(),
        name: dayName,
        content: [],
    }
}
function createNewContent(name){
    return {
        id: Date.now(),
        name: name,
    }
}

function saveANDrenderPlan(){
    savePlanLS();
    renderContainer();
}
function savePlanLS(){
    localStorage.setItem(LOCAL_STORAGE_DAILYPLAN_KEY, JSON.stringify(dailyMeals));
    localStorage.setItem(LOCAL_STORAGE_PLANID_KEY,  selectedMealID);
}


function renderContainer(){
    clearContainer(mainContainer);
    showCaseDailyMeal(dailyMeals);
    // const mealLists = mainContainer.querySelectorAll("[data-meal-list-container]");
    // console.log(mealLists)
}
function showCaseDailyMeal(mealPlans){
    mealPlans.forEach(mealPlan=>{
        const dayContainer = document.createElement("div");
        dayContainer.classList.add("day-container");
        dayContainer.dataset.ID = mealPlan.id;
        dayContainer.innerHTML = `
            <div class="top" >
                <form class="top-left" data-top-left>
                    <input class="day-name-input" type="text" data-day-name-input>
                    <p class="day-name-output active" data-day-name-output>${mealPlan.name}</p>
                </form>
            
                <button class="del-btn" data-ID = ${mealPlan.id}></button>
                <button class="edit-btn"></button>
            </div>
            <div class="content-container" >
                <form class="new-form" data-ID = ${mealPlan.id}>
                    <input type="text" class="new-input">
                </form>
                <ul class="new-list" data-meal-list-container>
                    <li class="new-item"></li>
                </ul>
            </div>
        `
        const dayNameInput = dayContainer.querySelector("[data-day-name-input]");
        const dayNameOutput = dayContainer.querySelector("[data-day-name-output]");
        const dayTopLeft= dayContainer.querySelector("[data-top-left]");
        
        
        const editBtn = dayContainer.querySelector(".edit-btn");
        const delBtn = dayContainer.querySelector(".del-btn");
        const mealNewForm = dayContainer.querySelector(".new-form");
        const mealNewInput = dayContainer.querySelector(".new-input");
        const mealNewList = dayContainer.querySelector(".new-list");
        
        


        // for(let i = 0; i<mealPlan.content.length; i++){
        //     const newContentArray = mealPlan.content[i].name;
        //     console.log(newContentArray)
        //     mealNewList.innerContent = newContentArray;
        // }
        
        function displayMeal(listContents){
            clearContainer(mealNewList);
            listContents.forEach(listContent=>{
                const mealItem = document.createElement("li");
                mealItem.innerHTML = `
                    ${listContent.name}
                `
                mealNewList.append(mealItem)
            })          
        }
        dayContainer.addEventListener("click", (e)=>{
            e.preventDefault();
            console.log(dayContainer.dataset.ID)
            selectedMealID = dayContainer.dataset.ID;
            savePlanLS();
            

            if(e.target.classList.contains("day-name-output")){
                dayNameInput.classList.add("active");
                dayNameOutput.classList.remove("active");
                changeName(mealPlan);
            }
            if(e.target.classList.contains("edit-btn")){
                editBtn.addEventListener("click", ()=>{
                    mealNewForm.classList.toggle("active");
                    if(mealPlan.content === []){
                        mealNewList.style.display = "none"
                    }else{
                        mealNewList.style.display = "";
                        displayMeal(mealPlan.content);
                    }
                })
            }
           
            if(e.target.classList.contains("new-input")){
                    e.target.parentElement.addEventListener("submit", (event)=>{
                        event.preventDefault();
                        const newInput = e.target.value;
                        if(newInput == null || newInput === "") return;
                        const newContent = createNewContent(newInput);
                        mealPlan.content.push(newContent);
                        savePlanLS();
                        mealNewInput.value = "";
                        displayMeal(mealPlan.content);
                    })         
            }

           
    
            function changeName(meal){
                dayTopLeft.addEventListener("submit", (e)=>{
                    e.preventDefault();
                    const newName = dayNameInput.value;
                    if(newName == null || newName === "") return;
                    meal.name = newName;
                    dayNameOutput.content  = newName;
                    dayNameInput.classList.remove("active");
                    dayNameOutput.classList.add("active");
                    saveANDrenderPlan();
                })
            }
            })
                
        delBtn.addEventListener("click", (e)=>{
            e.preventDefault();
            dailyMeals = dailyMeals.filter(dailyMeal=> dailyMeal!== mealPlan) ;
            saveANDrenderPlan() 
            })

        
        displayMeal(mealPlan.content)
        
    
        
        // function displayNewMealItem(items){
        //     items.forEach(item=>{
        //         const mealItem = document.createElement("li");
        //         mealItem.innerContent =  item.name;
        //         mealNewList.append(mealItem);
        //     })  
        // }
       

        //textarea doesn't work!
            // mealTextArea.addEventListener("input", (e)=>{
            //     e.preventDefault();
            //     if(mealTextArea.classList.contains("active")){
            //         mealTextArea.ariaDisabled = "false"
            //     }else{
            //         mealTextArea.ariaDisabled = "true"
            //     }
            //     newValue = e.target.value;
            //     dailyMeal.content = newValue;
            //     saveANDrenderPlan();
            // })
        mainContainer.append(dayContainer);
    })
}

renderContainer();






//cta verify email
const emailForm = document.querySelector(".cta-form");
const emailInput = emailForm.querySelector("input");
const emailAlert = emailForm.querySelector(".email-alert");

emailForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    validateInput();
})
const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function setError(message){
    
    emailAlert.innerText = message;
    emailForm.classList.add("error");
    emailForm.classList.remove("success");
}
function setSuccess(){
    emailAlert.innerText = "";
    emailForm.classList.remove("error");
    emailForm.classList.add("success");
}

function validateInput(){
    if(emailInput.value === ""){
        setError( "Email is Required!")
    }else if(!isValidEmail(emailInput.value)){
        setError( "Enter a valid Email!")
    }else{
        setSuccess();
    }
}
