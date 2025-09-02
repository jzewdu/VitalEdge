let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let meals = JSON.parse(localStorage.getItem("meals")) || [];
let calorieGoal = localStorage.getItem("calorieGoal") || 2500;
let proteinGoal = localStorage.getItem("proteinGoal") || 150;

// Midnight reset
function resetAtMidnight() {
  let lastReset = localStorage.getItem("lastReset");
  let today = new Date().toDateString();
  if (lastReset !== today) {
    tasks = [];
    meals = [];
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("meals", JSON.stringify(meals));
    localStorage.setItem("lastReset", today);
  }
}
resetAtMidnight();

function renderTasks() {
  let list = document.getElementById("taskList");
  let fullList = document.getElementById("taskListFull");
  list.innerHTML = "";
  fullList.innerHTML = "";
  tasks.forEach((t, i) => {
    let li = document.createElement("li");
    li.textContent = t;
    li.onclick = () => { tasks.splice(i,1); saveTasks(); };
    list.appendChild(li);

    let li2 = document.createElement("li");
    li2.textContent = t;
    li2.onclick = () => { tasks.splice(i,1); saveTasks(); };
    fullList.appendChild(li2);
  });
}
function addTask() {
  let input = document.getElementById("taskInput");
  if(input.value.trim() !== ""){
    tasks.push(input.value.trim());
    input.value="";
    saveTasks();
  }
}
function saveTasks(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function renderMeals(){
  let list = document.getElementById("mealList");
  list.innerHTML="";
  meals.forEach((m,i)=>{
    let li=document.createElement("li");
    li.textContent=`${m.cal} cal, ${m.pro}g protein`;
    list.appendChild(li);
  });
  updateCharts();
}
function addMeal(){
  let cal=document.getElementById("mealCalories").value;
  let pro=document.getElementById("mealProtein").value;
  if(cal && pro){
    meals.push({cal:parseInt(cal),pro:parseInt(pro)});
    localStorage.setItem("meals", JSON.stringify(meals));
    renderMeals();
  }
}

function updateCharts(){
  let totalCal=meals.reduce((a,b)=>a+b.cal,0);
  let totalPro=meals.reduce((a,b)=>a+b.pro,0);

  drawRing("calorieChart", totalCal, calorieGoal, "#00b09b");
  drawRing("proteinChart", totalPro, proteinGoal, "#96c93d");

  document.getElementById("calorieText").textContent = `${totalCal} / ${calorieGoal} cal`;
  document.getElementById("proteinText").textContent = `${totalPro} / ${proteinGoal} g protein`;
}
function drawRing(id, value, goal, color){
  let canvas=document.getElementById(id);
  let ctx=canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  let percent=Math.min(value/goal,1);
  ctx.lineWidth=15;
  ctx.strokeStyle="#eee";
  ctx.beginPath();
  ctx.arc(100,100,80,0,2*Math.PI);
  ctx.stroke();

  ctx.strokeStyle=color;
  ctx.beginPath();
  ctx.arc(100,100,80,-Math.PI/2,(2*Math.PI*percent)-Math.PI/2);
  ctx.stroke();
}
function saveSettings(){
  calorieGoal=document.getElementById("calorieGoal").value;
  proteinGoal=document.getElementById("proteinGoal").value;
  localStorage.setItem("calorieGoal", calorieGoal);
  localStorage.setItem("proteinGoal", proteinGoal);
  updateCharts();
  switchTab("home");
}

function switchTab(tab){
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  document.getElementById(tab).classList.add("active");

  document.querySelectorAll(".navbar button").forEach(b=>b.classList.remove("active"));
  let btn=document.querySelector(`.navbar button[onclick="switchTab('${tab}')"]`);
  if(btn) btn.classList.add("active");
}

renderTasks();
renderMeals();
updateCharts();
