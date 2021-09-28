// get all the deleteBtn elements
let deleteBtnElements = document.getElementsByClassName("deleteBtn");
//console.log("deleteBtnElements");
//console.log(deleteBtnElements);
//console.log(deleteBtnElements);
for (let i=0;i< deleteBtnElements.length;i++){
    let currentBtn = deleteBtnElements[i];
    let currentDeleteData = currentBtn.previousElementSibling.innerText;
    currentBtn.addEventListener('click', ()=>{
        let deleteDataId=("delet"+currentBtn.id);
        console.log(deleteDataId);
        let newRow = document.createElement('tr');
        let newConfirmText = document.createElement('td');
        let confirmBtn = document.createElement('td');
        let confirmSubmit = document.createElement('button');
        let confirm = document.createTextNode("Confirm delete");
        confirmSubmit.classList.add('btn','btn-primary','btn-sm');
        confirmSubmit.type = 'submit';
        confirmSubmit.appendChild(confirm);
        confirmBtn.appendChild(confirmSubmit);
        newConfirmText.style.backgroundColor = "red";
        newConfirmText.style.color = "black";
        let confirmText = document.createTextNode('Are you sure to delete this from database?');
        newConfirmText.appendChild(confirmText);
        newRow.appendChild(newConfirmText);
        newRow.appendChild(confirmBtn);
        let referenceNode = currentBtn.parentNode;
        referenceNode.parentNode.insertBefore(newRow,referenceNode.nextSibling);
        document.getElementById(deleteDataId).value = currentDeleteData;
    })
}
