const form = document.querySelector('form');
const searchInput = document.querySelector('input');
const accordBtns = document.querySelectorAll('.accordion-button');
const accordText = document.querySelectorAll('.accordion-collapse');
const accordContainer = document.querySelector('.accordion');
const mainHeader = document.querySelector('.lblheader');
const btnEstimates = document.querySelectorAll('.btn-estimate');
const btnCalc = document.querySelector('.btnCalc')



const baseURL = 'https://fortytonstocks.vercel.app/earnings/';
const base2URL = 'https://fortytonstocks.vercel.app/search/';
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const today  = new Date();
const todaysDate = today.toLocaleDateString("en-US", options)
const currentYear = today.getFullYear()

mainHeader.textContent = `Cazzimoto's stock app - ${todaysDate}`
form.addEventListener('submit', formSubmitted);

const clearSubmit = () => {
    document.getElementById('tickerEntered').value = "";
    searchInput.focus();
};
searchInput.focus();


const blobber = () => {
    console.log('blobbing');
}

accordContainer.addEventListener("click", function(e) {
    e.preventDefault();
    const button = e.target;
    if (!button.classList.contains("accordion-button")) return;
    button.closest(".accordion-item")
          .querySelector(".accordion-collapse")
          .classList.toggle("collapse")
});


accordContainer.addEventListener("click", function(e) {
    e.preventDefault();
    const button = e.target;
    if (!button.classList.contains("btn-estimate")) return;
    const btnNum = button.classList[3];  // Zero Index to select proper #ID
    const boots = document.getElementById(`estimate${btnNum}`).value
    const input = Array.from(document.querySelectorAll(`.accordion-body${btnNum}`))[0].innerHTML;
    // console.log(typeof input);
    const blob = input.trim().split(':')
    for (const item of blob) {
        console.log(item.slice(0, item.indexOf('<br>')).trim());
    }
});




function formSubmitted(e) {
    e.preventDefault();
    const stockTicker = searchInput.value;
    accordContainer.textContent = "";
    getEarnings(stockTicker);
};


const displayTickerResults = function(arr, i) {
        // console.log(`this is ${i}`);
    const tickerHTML = `<div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
        ${arr.ticker.toUpperCase()}
      </button>
    </h2>
    <div  class="accordion-collapse collapse" aria-labelledby="headingOne">
      <div class="accordion-body${i}">
            Stock price - ${arr.ticker.toUpperCase()} - ${todaysDate} <br><br>

            Previous close:  &ensp; ${arr.previous_Close}<br>
            Opening price: &ensp; ${arr.day_Open}<br>
            Days price range: &ensp; ${arr.days_Range}<br>
            Days volume: &ensp; ${arr.volume}<br>
            Avg. volume: &ensp; ${arr.ave_Vol_3Mons} (3 month rolling) <br>
            Market Cap: &ensp; ${arr.market_Cap}<br><br>

            <b>The Goods</b><br>
            <b>Forcasted Earnings Per Share: &ensp; ${arr.forcasted_EPS}</b><br>
            P/E Ratio: &ensp; ${arr.pe_Ratio}<br>
            Price to sales: &ensp; ${arr.price_to_Sales}<br>
            Price to book: &ensp; ${arr.price_to_Book}<br></b>
            Annual revenue &ensp; ${currentYear-1}: ${arr.annualRevenue_PastYear}<br>
            Annual profit &ensp; ${currentYear-1}: ${arr.annualProfit_PastYear}<br>
            Profit margin: &ensp; ${arr.profit_Margin}<br><br>

            Earnings growth: &ensp; ${arr.earnGrowth_CurrYear}<br>
            Earnings growth ${currentYear-1}: &ensp; ${arr.earnGrowth_PastYear}<br>
            Earnings growth next 5 years: &ensp; ${arr.earnGrowth_Next_5yrs}<br>
            Revenue growth ${currentYear}: &ensp; ${arr.revenueGrowth_PastYear}<br><br>
         </div>
         <div class="estimate">
         <form>
         <fieldset class="form-group">
             <label class="lblEstimate text-primary" for="search">Enter Projected Earnings</label>
             <input type="text" class="form-control inputPad" id="estimate${i}" placeholder="Projected Earnings">
         </fieldset>
             <button type="submit" id="3" class="btn btn-primary btn-estimate ${i}">Calculte Future Price</button>
     </form>
         </div>
    </div>
  </div>`;
  accordContainer.insertAdjacentHTML('beforeend', tickerHTML);

};

// const renderButts = function() {
//     for (let i=0; i < accordBtns.length; i++) {
//         accordBtns[i].addEventListener('click', function() {
//             // console.log(accordBtns);
//             accordText[i].classList.toggle('collapse')
//         })
//     };
// };


 async function getDaily(stock) {
    try {
        const databox = [];
        const tickRes = await fetch(`${baseURL}${stock}`);
        if (!tickRes.ok) throw new Error('Please enter stock')
        const tickerData = await tickRes.json();
        const {headers, lables, price} = tickerData
        // console.log(headers, lables, price);
        price.forEach((val, i) => {
            displayTickerResults(val, i);
        });
        console.log(databox);
    } catch (error) {
        console.warn('testbot getDaily:', error);
        // alert(error);
    } finally {
        clearSubmit();
    }
};

async function getEarnings(stock) {
    try {
        const tickRes = await fetch(`${base2URL}${stock}`);
        if (!tickRes.ok) throw new Error('Bad Data Returned')
        const tickerData = await tickRes.json();
        console.log(tickerData);
        // tickerData.forEach((val, i) => {
        //     if (!val.previous_Close) return;
        //     console.log(val); //displayTickerResults(val, i);
        // });
    } catch (error) {
        console.warn('testbot getEarnings', error);
        alert(error);
    } finally {
        clearSubmit();
    }
};