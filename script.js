const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

const dropdowns = document.querySelectorAll(".container select");
const btn = document.querySelector(".exe");
const fromCurr = document.querySelector("select[name='from']");
const toCurr = document.querySelector("select[name='to']");
const msg = document.querySelector(".msg");

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    if (img) {
        img.src = newSrc;
    }
};

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });

    updateFlag(select); // Initial flag update
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount");
    let amtVal = amount.value.trim(); // Trim to remove leading/trailing spaces
    if (amtVal === "" || isNaN(amtVal) || amtVal <= 0) {
        amtVal = 1;
        amount.value = "1";
    }

    const fromCurrency = fromCurr.value.toLowerCase();
    const toCurrency = toCurr.value.toLowerCase();

    const URL = `${BASE_URL}/${fromCurrency}.json`;
    try {
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();

        if (!data[toCurrency]) {
            throw new Error(`Exchange rate ${fromCurrency} to ${toCurrency} not found.`);
        }

        let rate = data[toCurrency];
        let finalAmount = amtVal * rate;

        // Update the message element if it exists
        if (msg) {
            msg.innerText = `${amtVal} ${fromCurrency.toUpperCase()} = ${finalAmount.toFixed(2)} ${toCurrency.toUpperCase()}`;
        } else {
            console.error('Element with class .msg not found.');
        }
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        // Update the message element with error message if it exists
        if (msg) {
            msg.innerText = "Error fetching exchange rate. Please try again later.";
        } else {
            console.error('Element with class .msg not found to display error message.');
        }
    }
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});
