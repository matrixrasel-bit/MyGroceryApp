const monthlyItems = [
    "Rice",
    "Chicken",
    "Eggs",
    "Dal",
    "Oil",
    "Salt",
    "Chili Powder",
    "Turmeric",
    "Garlic",
    "Onion",
    "Potato",
    "Noodles",
    "Tuna"
];

const weeklyItems = [
    "Carrot",
    "Cabbage",
    "Broccoli",
    "Eggplant",
    "Cucumber",
    "Tomato",
    "Banana",
    "Apple",
    "Milk",
    "Yogurt",
    "Bread"
];


function openShopping() {
    document.getElementById("home").style.display = "none";
    document.getElementById("shoppingPage").style.display = "block";

    showShoppingList();
}


function goHome() {

    document.getElementById("shoppingPage").style.display = "none";

    document.getElementById("budgetPage").style.display = "none";

    document.getElementById("mealPage").style.display = "none";

    document.getElementById("home").style.display = "block";

    document.getElementById("stockPage").style.display = "none";

    document.getElementById("reminderPage").style.display = "none";
}


function showShoppingList() {

    const monthly = document.getElementById("monthlyList");
    const weekly = document.getElementById("weeklyList");

    monthly.innerHTML = "";
    weekly.innerHTML = "";


    monthlyItems.forEach((item, index) => {

        const id = "monthly" + index;
        const checked = localStorage.getItem(id) === "true";

        monthly.innerHTML += `
            <label class="shopping-item">
                <input
                    type="checkbox"
                    ${checked ? "checked" : ""}
                    onchange="saveItem('${id}', this.checked)"
                >
                ${item}
            </label>
        `;
    });


    weeklyItems.forEach((item, index) => {

        const id = "weekly" + index;
        const checked = localStorage.getItem(id) === "true";

        weekly.innerHTML += `
            <label class="shopping-item">
                <input
                    type="checkbox"
                    ${checked ? "checked" : ""}
                    onchange="saveItem('${id}', this.checked)"
                >
                ${item}
            </label>
        `;
    });

    updateProgress();
}


function saveItem(id, checked) {

    localStorage.setItem(id, checked);

    updateProgress();
}


function updateProgress() {

    const allItems = monthlyItems.length + weeklyItems.length;

    let checkedItems = 0;

    for (let i = 0; i < monthlyItems.length; i++) {
        if (localStorage.getItem("monthly" + i) === "true") {
            checkedItems++;
        }
    }

    for (let i = 0; i < weeklyItems.length; i++) {
        if (localStorage.getItem("weekly" + i) === "true") {
            checkedItems++;
        }
    }

    document.getElementById("progress").innerText =
        `${checkedItems} / ${allItems} items completed`;
}


const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];


function openMealPlan() {

    document.getElementById("home").style.display = "none";

    document.getElementById("mealPage").style.display = "block";

    showMealPlan();
}


function showMealPlan() {

    const mealList =
        document.getElementById("mealList");

    mealList.innerHTML = "";

    days.forEach((day, index) => {

        const savedMeal =
            localStorage.getItem("meal" + index) || "";

        mealList.innerHTML += `

            <div class="meal-card">

                <h3>📅 ${day}</h3>

                <input
                    type="text"
                    id="meal${index}"
                    placeholder="What will you eat?"
                    value="${savedMeal}"
                >

                <button onclick="saveMeal(${index})">
                    Save Meal
                </button>

            </div>

        `;
    });
}


function saveMeal(index) {

    const meal =
        document.getElementById("meal" + index).value;

    localStorage.setItem(
        "meal" + index,
        meal
    );

    alert("🍳 Meal saved!");

}


function openBudget() {

    document.getElementById("home").style.display = "none";

    document.getElementById("budgetPage").style.display = "block";

    loadBudget();
}


function saveBudget() {

    const budget =
        Number(document.getElementById("monthlyBudget").value);

    if (!budget || budget <= 0) {
        alert("Please enter a valid budget.");
        return;
    }

    localStorage.setItem("monthlyBudget", budget);

    loadBudget();

    alert("💰 Monthly budget saved!");
}


function addExpense() {

    const name =
        document.getElementById("expenseName").value.trim();

    const amount =
        Number(document.getElementById("expenseAmount").value);

    if (!name || !amount || amount <= 0) {
        alert("Please enter item name and amount.");
        return;
    }

    let expenses =
        JSON.parse(localStorage.getItem("expenses")) || [];

    expenses.push({
        name: name,
        amount: amount
    });

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";

    loadBudget();
}


function loadBudget() {

    const budget =
        Number(localStorage.getItem("monthlyBudget")) || 0;

    const expenses =
        JSON.parse(localStorage.getItem("expenses")) || [];

    let spent = 0;

    expenses.forEach(expense => {
        spent += Number(expense.amount);
    });

    const remaining = budget - spent;

    document.getElementById("monthlyBudget").value =
        budget || "";

    document.getElementById("budgetAmount").innerText =
        "₩" + budget.toLocaleString();

    document.getElementById("spentAmount").innerText =
        "₩" + spent.toLocaleString();

    document.getElementById("remainingAmount").innerText =
        "₩" + remaining.toLocaleString();


    const list =
        document.getElementById("expenseList");

    list.innerHTML = "";

    expenses.forEach((expense, index) => {

        list.innerHTML += `
            <div class="expense-item">

                <span>
                    ${expense.name}
                </span>

                <strong>
                    ₩${Number(expense.amount).toLocaleString()}
                </strong>

            </div>
        `;

    });
}
function updateDashboard() {

    // Today's date
    const today = new Date();

    const dateText = today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    });

    document.getElementById("todayDate").innerText =
        dateText;


    // Today's meal

    const dayIndex = today.getDay();

    // JavaScript: Sunday = 0
    const mealIndex = dayIndex === 0 ? 6 : dayIndex - 1;

    const todayMeal =
        localStorage.getItem("meal" + mealIndex);

    document.getElementById("todayMeal").innerText =
        todayMeal || "No meal planned yet";


    // Shopping progress

    let completed = 0;

    for (let i = 0; i < monthlyItems.length; i++) {

        if (localStorage.getItem("monthly" + i) === "true") {
            completed++;
        }

    }

    for (let i = 0; i < weeklyItems.length; i++) {

        if (localStorage.getItem("weekly" + i) === "true") {
            completed++;
        }

    }

    const total =
        monthlyItems.length + weeklyItems.length;

    document.getElementById("shoppingProgress").innerText =
        `${completed} / ${total}`;


    // Budget

    const budget =
        Number(localStorage.getItem("monthlyBudget")) || 0;

    const expenses =
        JSON.parse(localStorage.getItem("expenses")) || [];

    let spent = 0;

    expenses.forEach(expense => {
        spent += Number(expense.amount);
    });

    const remaining = budget - spent;

    document.getElementById("dashboardBudget").innerText =
        "₩" + remaining.toLocaleString();
}
updateDashboard();

function openStock() {

    document.getElementById("home").style.display = "none";

    document.getElementById("stockPage").style.display = "block";

    showStock();

}


function addStock() {

    const name =
        document.getElementById("stockName").value.trim();

    const quantity =
        Number(document.getElementById("stockQuantity").value);

    const unit =
        document.getElementById("stockUnit").value;

    const lowLimit =
        Number(document.getElementById("lowLimit").value);


    if (!name || quantity < 0 || lowLimit < 0) {

        alert("Please enter all stock information.");

        return;
    }


    let stock =
        JSON.parse(localStorage.getItem("foodStock")) || [];


    stock.push({

        name: name,

        quantity: quantity,

        unit: unit,

        lowLimit: lowLimit

    });


    localStorage.setItem(
        "foodStock",
        JSON.stringify(stock)
    );


    document.getElementById("stockName").value = "";

    document.getElementById("stockQuantity").value = "";

    document.getElementById("lowLimit").value = "";


    showStock();

}


function showStock() {

    const list =
        document.getElementById("stockList");

    const stock =
        JSON.parse(localStorage.getItem("foodStock")) || [];


    list.innerHTML = "";


    if (stock.length === 0) {

        list.innerHTML =
            "<p>No food added yet.</p>";

        return;
    }


    stock.forEach((item, index) => {

        const isLow =
            item.quantity <= item.lowLimit;


        list.innerHTML += `

            <div class="stock-item">

                <div>

                    <strong>
                        ${item.name}
                    </strong>

                    <p>
                        ${item.quantity}
                        ${item.unit}
                    </p>

                    ${
                        isLow
                        ? '<span class="low-stock">⚠️ Low Stock</span>'
                        : '<span class="good-stock">✓ Good Stock</span>'
                    }

                </div>


                <button
                    onclick="deleteStock(${index})"
                    class="delete-button"
                >
                    🗑️
                </button>

            </div>

        `;

    });

}


function deleteStock(index) {

    let stock =
        JSON.parse(localStorage.getItem("foodStock")) || [];


    stock.splice(index, 1);


    localStorage.setItem(
        "foodStock",
        JSON.stringify(stock)
    );


    showStock();

}
function openReminders() {

    document.getElementById("home").style.display = "none";

    document.getElementById("reminderPage").style.display = "block";

    loadReminders();

}


function saveShoppingReminder() {

    const day =
        document.getElementById("shoppingDay").value;

    const time =
        document.getElementById("shoppingTime").value;


    if (!time) {

        alert("Please select a time.");

        return;
    }


    localStorage.setItem(
        "shoppingReminderDay",
        day
    );

    localStorage.setItem(
        "shoppingReminderTime",
        time
    );


    showReminderStatus();

    alert("🛒 Shopping reminder saved!");
}


function saveStockReminder() {

    const time =
        document.getElementById("stockTime").value;


    if (!time) {

        alert("Please select a time.");

        return;
    }


    localStorage.setItem(
        "stockReminderTime",
        time
    );


    showReminderStatus();

    alert("📦 Stock reminder saved!");
}


function loadReminders() {

    const shoppingDay =
        localStorage.getItem("shoppingReminderDay");

    const shoppingTime =
        localStorage.getItem("shoppingReminderTime");

    const stockTime =
        localStorage.getItem("stockReminderTime");


    if (shoppingDay !== null) {

        document.getElementById("shoppingDay").value =
            shoppingDay;

    }


    if (shoppingTime) {

        document.getElementById("shoppingTime").value =
            shoppingTime;

    }


    if (stockTime) {

        document.getElementById("stockTime").value =
            stockTime;

    }


    showReminderStatus();

}


function showReminderStatus() {

    const shoppingTime =
        localStorage.getItem("shoppingReminderTime");

    const stockTime =
        localStorage.getItem("stockReminderTime");


    let text = "";


    if (shoppingTime) {

        text += `
            <div class="saved-reminder">
                🛒 Shopping reminder: ${shoppingTime}
            </div>
        `;

    }


    if (stockTime) {

        text += `
            <div class="saved-reminder">
                📦 Stock reminder: ${stockTime}
            </div>
        `;

    }


    document.getElementById("reminderStatus").innerHTML =
        text;

}
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./sw.js")
            .then(() => console.log("PWA Service Worker registered!"))
            .catch(error => console.log("Service Worker error:", error));
    });
}