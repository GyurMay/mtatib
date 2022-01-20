/****
 * 
 *              FUNCTIONS BELOW - convert to a different js file later and import
 */

function tibetanName(origName)
{
    if(has(lang, 'lang=eng')) return origName;
    if(engToTib[origName] == null || engToTib[origName] == '')
        return origName;
    return engToTib[origName];
}

function has(str, frac)
{
    if(str.split(frac).length > 1)
        return true;
    return false;
}
// loadSchedules(5); //rm

function filter(){
    console.log('filter clicked');
    let visibleStation = document.getElementsByClassName('options')[0].childElementCount;
    let search = searchField.value;
    for(i=0;i<visibleStation;i++){ //goes through options class to hide all the options/visible stations
    if(document.getElementsByClassName('options')[0].children[i].id.toLowerCase().split(search.toLowerCase()).length >= 2){
        match = document.getElementsByClassName('options')[0].children[i].id;
        console.log('Results found: ' + match);
        document.getElementById(match).style.display = 'block';
    }else{
        document.getElementsByClassName('options')[0].children[i].style.display = 'none';
    }
    }
    if(match == ''){
        console.log('Nothing found bih');
        document.getElementById('noresultsfound').style.display = 'block';
    }
}

function getClosestStation(lat, lon){
        myloc = [];
        myloc[0] = lat; console.log(lat);
        myloc[1] = lon;
        num = [];
        for(i=0;i<document.getElementsByClassName("options")[0].childElementCount;i++){
        num[i] = [parseFloat(document.getElementsByClassName("options")[0].children[i].getAttribute('lat')), parseFloat(document.getElementsByClassName("options")[0].children[i].getAttribute('lon'))];
        }
        d_arr = [];
        d_arr_cop = [];
        for(j=0;j<i;j++){ //logging the distances of the stations with increment j for objects
        distance = Math.sqrt((((num[j][0] - myloc[0])*(num[j][0] - myloc[0])) + (num[j][1] - myloc[1])*(num[j][1] - myloc[1])));
        console.log("from home to "+document.getElementsByClassName("options")[0].children[j].textContent + ". distance: "+distance);
        d_arr[distance] = document.getElementsByClassName("options")[0].children[j].id; //input distance get the station Id
        d_arr_cop[j] = distance;
        }
        d_arr_cop.sort();
        minAddresses = []; //store the id of minimum distanced Stations
        for(i=0, k=0; i<j; i++){
        if(d_arr[0] == d_arr_cop[i]){
        	minAddresses[k++] = (document.getElementsByClassName("options")[0].children[i].id);
        }
        }
}

var loaded = [];
trainSelect.onchange = function(){
    selected = trainSelect.selectedOptions[0].value;
    if(loaded[selected] === undefined){
        loadSchedules(trainSelect.selectedOptions[0].value, 0);
        loaded[selected] = true;
    }
}

window.onload = () => {
document.getElementById("setHome").onclick = () => {
    alert("search and select a home station");
    document.querySelectorAll('p').forEach((a) => { a.style.backgroundColor = 'black'; a.style.color = 'white'; });
    document.onclick = (e) => {
        if(e.target.tagName == 'P'){
        document.cookie = `homestation=${e.target.id}; samesite=none; secure; expires=Wed, 18 Dec 2030 00:00:00 UTC`;
        alert(e.target.id + ' is set as your home station.');
        document.location.reload();
        }
    }
  }   
};

menuButton.style.border = 'none';
menuButton.style.scale = '1.2';
menuButton.style.marginTop = '1em';

function showMenu(){
    hidden = (menu.style.display == 'none') ? true : false;
    svg = document.querySelectorAll('svg')[0].children;
    if(hidden){
        menu.style.display = 'inline-block';
        svg[0].setAttribute('transform',"rotate(45, 15, 20)");
        svg[1].style.display = 'none';
        svg[2].setAttribute('transform','rotate(-45, 10, 50)');
    }else{
        menu.style.display = 'none';
        svg[0].setAttribute('transform',"rotate{0)");
        svg[1].style.display = 'block';
        svg[2].setAttribute('transform','rotate(0)');
    }
}
function getHome(){
 return document.cookie.split("homestation=")[1];
}
let homeStation = getHome();
let homeStationEl = document.getElementById(homestation).cloneNode();
homeStationEl.textContent = "Home Station - "+homeStation;
document.querySelector('.options').prepend(homeStationEl);


