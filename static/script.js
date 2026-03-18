let map = L.map('map').setView([18.5204,73.8567],7)

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
attribution:'© OpenStreetMap'
}).addTo(map)

let routeLine
let markers=[]

function showLoader(){
document.getElementById("loader").style.display="block"
}

function hideLoader(){
document.getElementById("loader").style.display="none"
}

function clearMap(){

if(routeLine){
map.removeLayer(routeLine)
}

markers.forEach(m => map.removeLayer(m))
markers=[]

}

function findRoute(){

showLoader()

let start=document.getElementById("start").value
let end=document.getElementById("end").value
let mode=document.getElementById("mode").value

fetch("/route",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
start:start,
end:end,
mode:mode
})
})
.then(res=>res.json())
.then(data=>{

hideLoader()

if(data.error){
alert(data.error)
return
}

clearMap()

/* ROUTE LINE */

routeLine=L.polyline(data.coords,{
color:'#3b82f6',
weight:6
}).addTo(map)

map.fitBounds(routeLine.getBounds())

/* MARKERS */

data.coords.forEach((coord,i)=>{

let marker=L.marker(coord,{
icon: L.icon({
iconUrl:"https://cdn-icons-png.flaticon.com/512/684/684908.png",
iconSize:[30,30]
})
}).addTo(map)

marker.bindPopup(data.path[i])

markers.push(marker)

})

/* RESULT */

document.getElementById("result").innerHTML=`

<h3>Route Details</h3>

<b>Path:</b> ${data.path.join(" → ")} <br>

<b>Distance:</b> ${data.distance} km <br>

<b>Time:</b> ${data.time} hr <br>

<b>Traffic:</b> ${data.traffic} <br>

<b>Fuel Cost:</b> ₹${data.fuel}

`

})

}