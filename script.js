// particle background
let c=document.getElementById("bg");
let ctx=c.getContext("2d");
c.width=window.innerWidth;
c.height=window.innerHeight;

let p=[];
for(let i=0;i<100;i++){
 p.push({x:Math.random()*c.width,y:Math.random()*c.height,r:2});
}

function draw(){
 ctx.clearRect(0,0,c.width,c.height);
 ctx.fillStyle="red";
 p.forEach(a=>{
  ctx.beginPath();
  ctx.arc(a.x,a.y,a.r,0,Math.PI*2);
  ctx.fill();
  a.y+=1;
  if(a.y>c.height)a.y=0;
 });
 requestAnimationFrame(draw);
}
draw();

// questions
let allQuestions={
present:[
{q:"She ___ to school.",c:["go","goes"],a:"goes"},
{q:"He ___ a dog.",c:["have","has"],a:"has"},
],
continuous:[
{q:"I ___ eating.",c:["am","is"],a:"am"},
{q:"She ___ reading.",c:["is","are"],a:"is"},
],
past:[
{q:"I ___ to school yesterday.",c:["go","went"],a:"went"},
{q:"She ___ rice.",c:["eat","ate"],a:"ate"},
],
future:[
{q:"I ___ go tomorrow.",c:["will","did"],a:"will"},
{q:"She ___ study.",c:["will","is"],a:"will"},
]
};

// เพิ่มจำนวนคำถาม
Object.keys(allQuestions).forEach(k=>{
 while(allQuestions[k].length<15){
  let r=allQuestions[k][Math.floor(Math.random()*allQuestions[k].length)];
  allQuestions[k].push(r);
 }
});

let qset=[],index=0,score=0,time=30,timer;

// UI control
function show(id){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById(id).classList.add("active");
}

// start
function selectMode(){
 let name=document.getElementById("playerName").value;
 if(!name){alert("กรอกชื่อก่อน!");return;}
 show("mode");
 document.getElementById("bgm").play();
}

function startGame(mode){
 qset=allQuestions[mode].sort(()=>Math.random()-0.5);
 index=0;score=0;time=30;

 show("game");
 loadQ();

 timer=setInterval(()=>{
  time--;
  document.getElementById("timer").innerText="เวลา: "+time;
  if(time<=0) endGame();
 },1000);
}

function loadQ(){
 let q=qset[index];
 document.getElementById("question").innerText=q.q;

 let html="";
 q.c.forEach(x=>{
  html+=`<button onclick="check('${x}')">${x}</button>`;
 });

 document.getElementById("choices").innerHTML=html;
}

function check(ans){
 if(ans===qset[index].a) score++;
 index++;

 if(index<qset.length){
  loadQ();
 }else{
  endGame();
 }
}

function endGame(){
 clearInterval(timer);
 show("end");

 let name=document.getElementById("playerName").value;
 let data=JSON.parse(localStorage.getItem("score")||"[]");

 data.push({name,score});
 localStorage.setItem("score",JSON.stringify(data));

 document.getElementById("finalScore").innerText=name+" : "+score;
}

function showLeaderboard(){
 show("leaderboard");

 let data=JSON.parse(localStorage.getItem("score")||"[]");
 data.sort((a,b)=>b.score-a.score);

 let html="";
 data.slice(0,10).forEach(d=>{
  html+=`<p>${d.name} - ${d.score}</p>`;
 });

 document.getElementById("board").innerHTML=html;
}

function backMenu(){
 show("menu");
}