const BASE_URL = "https://api.currencyapi.com/v3/latest";
const API_KEY = "cur_live_cgTu6hIzQgX3wcmIt7bREnbPwAM0t811pWNCJFgK";
const btn = document.querySelector("form button");
const dropdownSelects = document.querySelectorAll(".dropdown select");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amountVal = parseFloat(amount.value);
    if (isNaN(amountVal) || amountVal < 1) {
        amountVal = 1;
        amount.value = "1";
    }

    const URL = `${BASE_URL}?apikey=${API_KEY}`;
    try {
        let response = await fetch(URL);
        if (!response.ok) throw new Error('Network response was not ok');
        let data = await response.json();

       
        let rates = data.data;
        if (!rates[fromCurr.value] || !rates[toCurr.value]) {
            throw new Error("Invalid currency code");
        }

        let fromRate = rates[fromCurr.value].value;
        let toRate = rates[toCurr.value].value;

       
        if (isNaN(fromRate) || isNaN(toRate)) {
            throw new Error("Invalid rate data");
        }

        
        let rate = toRate / fromRate;
        let finalAmount = amountVal * rate;
        msg.innerText = `${amountVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = `Error: ${error.message}`;
    }
}

window.addEventListener("load", () => {
    updateExchangeRate();
})

for (let select of dropdownSelects) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}


const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
    
});

