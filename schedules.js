/***
  FEATURES TO MAKE
  1. Remove duplicates after loading twice or, restrict loading twice
  2. Train load to Select button with options inside
  3. Path feature (loadImmediatePath)
  4. Design upgrade
  5. gmaps integration
  **/
lang = document.location.search;
locationPermission = false;
function mloadSchedules(line){
 let url = `https://collector-otp-prod.camsys-apps.com/schedule/MTASBWY/stopsForRoute?apikey=qeqy84JE7hUKfaI0Lxm2Ttcm6ZA0bYrP&&routeId=MTASBWY:${line}`;
 fetch(url).then((a) => { return a.json(); }).then((l) => { lineJson = l; }).then((e) => { loadSchedules(line, 0); });
}
function loadSchedules(line, k){
  
//getting and parsing subway train times
let url = `https://otp-mta-prod.camsys-apps.com/otp/routers/default/nearby?stops=${lineJson[k]["stopId"]}&apikey=Z276E3rCeTzOQEoBPPN4JCEc6GfvdnYE`;
console.log(url);
console.log(i);
  
if(k >= (lineJson.length - 1)){ //stop If... and get closest stations to user
  
  //set global const lat and lon
  if(navigator.geolocation){
  
    if(locationPermission == false){
    navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
    globalLat = position.coords.latitude;
    globalLon = position.coords.longitude;
    locationPermission = true;
    getClosestStation(globalLat, globalLon);

    lenny = options[0].childElementCount;
    for(incre=0; incre<lenny; incre++){
    options[0].appendChild(document.getElementById(d_arr[d_arr_cop[incre]]));
    }
    });
    }else{
    getClosestStation(globalLat, globalLon);

    lenny = options[0].childElementCount;
    for(incre=0; incre<lenny; incre++){
    options[0].appendChild(document.getElementById(d_arr[d_arr_cop[incre]]));
    }

  }
  }else{
  alert("Permission denied - location, can't get nearby stations");
  //getClosestStation(40.73659234516563, -73.87575414076787);
  
  lenny = options[0].childElementCount;
  for(incre=0; incre<lenny; incre++){
  options[0].appendChild(document.getElementById(d_arr[d_arr_cop[incre]]));
  }
  }
  //end of global
  
  return; //exit recursion
}
k++;
//12 -> Grand Ave, 05 -> Jamaica Center - Parsons/Archer
// if(i > 37) return; //rm
fetch(url).then((response) => {
return response.json();
})
.then((jsonResponse) => {
console.log(jsonResponse);
a = jsonResponse;
let jr = a[0];
if(jsonResponse.length == 0)
    loadSchedules(line, k);
else{
var name = jr['stop']['name'];
var lat = jr['stop']['lat'];
var lon = jr['stop']['lon'];
stations = document.createElement('p'); //select divId(<p></p>) box
stations.style.display = 'none';
stationName = document.createElement('div');
stationName.innerHTML += '<b>'+name+'</b><br/><br/>';
stations.append(stationName);
stations.id = name+'-time';

// homeexception = false;
// homeexception = (jr['groups'][i]['headsign"] == 'Grand Av-Newtown') ? true : false;

var options = document.querySelector('.options');
optionsP = document.createElement('p');
optionsP.setAttribute('lat', lat);
optionsP.setAttribute('lon', lon);
optionsP.id = name;
optionsP.onclick = () => { 
    schedulevisible(name+'-time');
 };
let tName = tibetanName(name);
optionsP.innerHTML = tName;
// if(name == 'Grand Av-Newtown'){
//     optionsP.style.backgroundColor = '#564178';
//     optionsP.style.color = '#fff';
// }
options.appendChild(optionsP);
table = document.createElement('table');
var shortNames = [], headsigns = [], arrivalTimes = [];
for(i=0; i<jr['groups'].length; i++){ //loop over each route (train Lines)
    shortNames[i] = jr['groups'][i]['route']['shortName'];
    headsigns[i] = jr['groups'][i]['headsign'];
    numberOfTrains = jr['groups'][i]['times'].length;
  
    for(j=0; j<numberOfTrains; j++){ //get arrival times rows
  	  tr = document.createElement('tr');
  	  table.appendChild(tr);
  	  tr.innerHTML += (`<td><img src='https://new.mta.info/themes/custom/bootstrap_mta/images/icons/${shortNames[i]}.svg'></td>`);
      tr.innerHTML += '<td>'+tibetanName(headsigns[i])+'</td>'; //Print HeadSigns (which side is it going)
      d = new Date(jr['groups'][i]['times'][j]['arrivalFmt']);
      h = (d.getHours() > 12) ?  d.getHours() - 12 : d.getHours();
      if(h == 0) h = 12;
      amPm = (d.getHours() > 12) ? 'PM' : 'AM';
      arrivalTimes[j] =  h+':'+d.getMinutes()+amPm;
      tr.innerHTML += (`<td style='font-size:60%;'>${arrivalTimes[j]} </td>`);
    }
    document.body.appendChild(stations);
}
  stations.appendChild(table);
loadSchedules(line, k);
}
});
}

//load Using your geolocation
function loadImmediatePath(){ 
//for(i=0;i<options[0].childElementCount;i++){
//  options[0].children[i].onclick = () => { loadImmediatePath(latLon[0], latLon[1], i); };
//}
immediatePath(globalLat, globalLon, 0);
function immediatePath(lati, long, k){
var totalString = '<hr/><br/>paths<br/>';
if(k >= options[0].childElementCount) return;
var fromLat = lati;
var fromLon = long;
let lat = options[0].children[k].getAttribute('lat');
let lon = options[0].children[k].getAttribute('lon');

fetch(`https://otp-mta-prod.camsys-apps.com/otp/routers/default/plan?apikey=Z276E3rCeTzOQEoBPPN4JCEc6GfvdnYE&toPlace=${lat},${lon}&fromPlace=${fromLat},${fromLon}`).
then((resp) => { return (resp.json()) }).then((jResp) => {
a = jResp;
console.log(a);
itineraries = a['plan']['itineraries'];
for(i=0;i < itineraries.length;i++){
    for(j=0;j < itineraries[i]['legs'].length;j++){
        if(itineraries[i]['legs'][j]['mode'] == 'WALK') continue;
        if(itineraries[i]['legs'][j]['mode'] == 'BUS'){
          logo = itineraries[i]['legs'][j]['route'];
        }else{
          logo = `<img width=100 height=100 src='https://new.mta.info/themes/custom/bootstrap_mta/images/icons/${itineraries[i]['legs'][j]['route']}.svg'></img>`;
        }
        totalString += logo;
        arrivalTime = new Date(itineraries[i]['legs'][j]['startTimeFmt']);
        amPm = (arrivalTime.getHours() > 12) ? 'PM' : 'AM';
        hours = (amPm == 'PM') ? arrivalTime.getHours() - 12 : arrivalTime.getHours();
        timeFormatted = (hours +':'+ arrivalTime.getMinutes() + amPm );
        innerData = timeFormatted + ' (' + itineraries[i]['legs'][j]['headsign'] + ') ' + itineraries[i]['legs'][j]['from']['name'] + '<br>' ;
        totalString += innerData;
    }
    totalString += '<br/><br/><hr/>';
}
console.log(document.getElementById(options[0].children[k].id+"-time"));
console.log("--"+totalString);
document.getElementById(options[0].children[k].id+"-time").innerHTML += totalString;
immediatePath(lati, long, ++k);
});
}
} //end of loadImmediatePath()
