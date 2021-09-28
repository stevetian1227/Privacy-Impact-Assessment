// the function which help to remove the dataToBeRemoved from the textarea
function removeData(wholeData, dataToBeRemoved) {
    wholeData = wholeData.replace(dataToBeRemoved, '');
    return wholeData;
}
// click on the right side and add the clicked one to the left side.
let tableElements = document.getElementsByClassName('chooseList');
//console.log(tableElements);
// chosenOnes are the parent element of the left table.
let leftTableParent = document.getElementById('chosenOnes');
//console.log(leftTableParent);
let dataToBeSent = document.getElementById('textarea');
//console.log("hiddenArea");
//console.log(dataToBeSent);
for (let i = 0; i < tableElements.length; i++) {
    tableElements[i].addEventListener('click',() => {
        let clickedOne = tableElements[i].innerHTML;
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

// get the left side elements to add event listeners to them
let leftTableElements = document.getElementsByClassName("leftTable");
for (let i=0;i< leftTableElements.length; i++){
    leftTableElements[i].addEventListener('click', ()=>{
        let textOfClicked = leftTableElements[i].innerText;
        leftTableParent.removeChild(leftTableElements[i]);
        dataToBeSent.value = (dataToBeSent.value).replace(textOfClicked+'*','');
    })
}





