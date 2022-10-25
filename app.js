let loanEl = document.querySelector("#loan");
const kpvEl = document.querySelector("#kpv");
const interestEl = document.querySelector("#interest");
const euriborEl = document.querySelector("#euribor");
const submitEl = document.querySelector(".submit");
const uusEl = document.querySelector(".uus-makse");
const kuumakseEl = document.querySelector(".kuumakse");
let newPayment = loanEl.value;
const today = new Date();

submitEl.addEventListener("click", function(){
 if (loanEl.valueAsNumber && interestEl.valueAsNumber && kpvEl.value){ 
  // console.log(`${monthDiff(today,new Date(kpvEl.value))}`);
  // console.log("not empty");
  kuumakseEl.textContent = `${calculate(loanEl.valueAsNumber, interestEl.valueAsNumber, euriborEl.valueAsNumber).toFixed(2)}€`;
 } else {
  uusEl.style.color = "black";
  uusEl.style.background = "#db6767";
  uusEl.textContent = `Palun täida kõik väljad ära`;
  window.setTimeout(closeAlert,5000);
 }
});
/* Mathematically, EMI is calculated as under:
 P x R x (1+R)^N / [(1+R)^N-1]
 P = Principal amount of the loan
 R = Rate of interest
 N = Number of monthly instalments. */
function calculate(laen, intress, euri){
 let kuud = monthDiff(today, new Date(kpvEl.value));
 let totalIntress = intress + euri;
 console.log(totalIntress);
 let nIntress = totalIntress / 12 / 100;
 let makse = laen * nIntress *(1 + nIntress) ** kuud / [(1 + nIntress) ** kuud -1];
 console.log(`func ${makse}`);
 return makse;
}
// function to calculate todays date and loan payback date difference in months to use in loan calculate function
function monthDiff(date1, date2) {
 return date2.getMonth() - date1.getMonth() + (12* (date2.getFullYear() - date1.getFullYear()))
};
// make "uus-makse" disappear after 5 seconds
function closeAlert(){
 uusEl.textContent = ``;
};
