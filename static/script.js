
let map = L.map('map').setView([18.5204,73.8567],7)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
attribution:'© OpenStreetMap'
}).addTo(map)

let routeLine

function findRoute(){

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

if(data.error){
alert(data.error)
return
}

document.getElementById("result").innerHTML=`
Route: ${data.path.join(" → ")} <br>
Distance: ${data.distance} km <br>
Time: ${data.time} hr <br>
Traffic: ${data.traffic} <br>
Fuel Cost: ₹${data.fuel}
`

if(routeLine){
map.removeLayer(routeLine)
}

routeLine=L.polyline(data.coords,{color:'blue'}).addTo(map)

map.fitBounds(routeLine.getBounds())

})

}