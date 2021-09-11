/***
  FEATURES TO MAKE
  1. Remove duplicates after loading twice or, restrict loading twice
  2. Train load to Select button with options inside
  3. Path feature (loadImmediatePath)
  4. Design upgrade
  5. gmaps integration
  **/

mStation = [];
load_icon = document.getElementById("load_icon");
lang = document.location.search;
locationPermission = false;
function mloadSchedules(line, k1){
  if(k1 >= 1 && k1>=lineJson.length) return;
 let url = `https://collector-otp-prod.camsys-apps.com/schedule/MTASBWY/stopsForRoute?apikey=qeqy84JE7hUKfaI0Lxm2Ttcm6ZA0bYrP&&routeId=MTASBWY:${line}`;
 fetch(url).then((a) => { return a.json(); }).then((l) => { lineJson = l; }).then((e) => {
   for(k1;k1<lineJson.length;k1++){
    name = lineJson[k1].stopName;
  if(locDb[lineJson[k1]["stopName"]] == undefined) continue;
    console.log(k1 + " : "+lineJson[k1]["stopName"] + " found");
    lat = locDb[lineJson[k1]["stopName"]][0];
    lon = locDb[lineJson[k1]["stopName"]][1];
    mStation[name] = lineJson[k1]["stopId"];
    //set Stations
    var options = document.querySelector('.options');
    optionsP = document.createElement('p');
    optionsP.setAttribute('lat', lat);
    optionsP.setAttribute('lon', lon);
    optionsP.id = name;  
    optionsP.innerHTML = tibetanName(optionsP.id);
    options.appendChild(optionsP);
    } 
   })
   .then(() => {
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
    //getClosestStation(40.73659234516563, -73.87575414076787);
    getClosestStation(globalLat, globalLon);

    lenny = options[0].childElementCount;
    for(incre=0; incre<lenny; incre++){
    options[0].appendChild(document.getElementById(d_arr[d_arr_cop[incre]]));
    }
    }
  }else alert("Permission denied - location, can't get nearby stations");
  //end of global
 })
  ;
}//end of mloadSchedules()


function loadSchedules(line, name){ 
//getting and parsing subway train times
let url = `https://otp-mta-prod.camsys-apps.com/otp/routers/default/nearby?stops=${line}&apikey=Z276E3rCeTzOQEoBPPN4JCEc6GfvdnYE`;
console.log(url);
load_icon.style.display = "block";
console.log(i);
//12 -> Grand Ave, 05 -> Jamaica Center - Parsons/Archer
// if(i > 37) return; //rm
fetch(url).then((response) => {
return response.json();
})
.then((jsonResponse) => { //print schedules with display:none;
console.log(jsonResponse);
a = jsonResponse;
let jr = a[0];
if(document.getElementById(name+'-time') != null) document.getElementById(name+'-time').remove(); //remove old -time if exist
stations = document.createElement('p'); //select divId(<p></p>) box
stations.style.display = 'none';
stationName = document.createElement('div');
stationName.innerHTML += '<b>'+name+'</b><br/><br/>';
stations.append(stationName);
stations.id = name+'-time';

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
  stations.innerHTML += `<button id="go" style="/*! right: 0; */ /*! position: absolute; */position: relative;padding: 2em;font-size: 50%;top: 1em;left: 30%;background: teal;color: #fff;border: 5px solid white;border-radius: 19%;box-shadow: 4px 3px 0.5em black;">GO</button>`;
})
.then((e) => {
  load_icon.style.display = "none";
  schedulevisible(name+"-time");
  go.onclick = () => {
    go.style.display = "none";
    immediatePath(globalLat, globalLon, selectedStation);
    }
})
;
}

//load Using your geolocation
function immediatePath(lati, long, el){
var totalString = '<hr/><br/>paths<br/>';
var fromLat = lati;
var fromLon = long;
let lat = el.getAttribute('lat');
let lon = el.getAttribute('lon');
console.log(lat);

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
console.log(document.getElementById(el.id+"-time"));
console.log("--"+totalString);
document.getElementById(el.id+"-time").innerHTML += totalString;
});
}
