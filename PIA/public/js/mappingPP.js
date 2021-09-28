// get the number of card in the mapping page first
let cardCount = parseInt(document.getElementById('numberOfPPs').innerHTML);
// get the threatsNames
let PPNames = [];
let PPNodes = document.getElementsByClassName("getPPsName");
for (let i=0; i<cardCount; i++) {
    PPNames.push(PPNodes[i].innerHTML);
}
console.log('PP Names');
console.log(PPNames);
// make the lists that same as the server side.
let cardIdList = [];
let textareaIdList = [];
let classNameList = [];
let leftTables = [];
for (let i=0;i<cardCount;i++){
    cardIdList.push('cardIndex'+i);
    textareaIdList.push('textarea'+i);
    classNameList.push('Principle'+i);
    leftTables.push('leftTable'+i);
}
// console.log(cardIdList);
// console.log(textareaIdList);
// console.log(classNameList);
// console.log(leftTables);
//initialize the variables
for (let i=0;i<cardCount;i++){
    let tableElements = document.getElementsByClassName(classNameList[i]);
    console.log("tableElements");
    console.log(tableElements);
    let leftTableParent = document.getElementById(cardIdList[i]);
    let dataToBeSent = document.getElementById(textareaIdList[i]);
    console.log(tableElements);
    console.log(leftTableParent);
    console.log(dataToBeSent);
    let currentPP = PPNames[i];
    for (let i = 0; i < tableElements.length; i++) {
        tableElements[i].addEventListener('click',() => {
            let clickedOne = tableElements[i].innerText;
            console.log(tableElements[i].innerText);
            clickedOne = clickedOne+' ==> '+ currentPP;
            console.log(clickedOne);
        let textnode = document.createTextNode(clickedOne);
        dataToBeSent.value = dataToBeSent.value + clickedOne +'*';
        let newChoice = document.createElement('tr');
        //set class name so that can add event listeners to them later on
        newChoice.setAttribute("class","leftTable");
        let newCol = document.createElement('td');
        newCol.appendChild(textnode);
        newChoice.appendChild(newCol);
        //console.log(newChoice);
        // let the left side elements have the ability that when clicked the ones will disappear.
        newChoice.addEventListener('click', () => {
            leftTableParent.removeChild(newChoice);
            /*
            console.log(newChoice.innerText);
            console.log(newChoice.innerText+'*');
            */
            dataToBeSent.value = (dataToBeSent.value).replace(newChoice.innerText+'*','');
        })
        leftTableParent.appendChild(newChoice);
        })
    }
};

for (let i=0;i<cardIdList.length;i++) {
    let leftTableElements = document.getElementsByClassName(leftTables[i]);
    for (let i = 0; i < leftTableElements.length; i++) {
        leftTableElements[i].addEventListener('click', ()=>{
            let textOfClicked = leftTableElements[i].innerText;
            leftTableParent.removeChild(leftTableElements[i]);
            dataToBeSent.value = (dataToBeSent.value).replace(textOfClicked+'*','');
        })
    }
};