// import the libraries
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fs = require('fs');
const { jsPDF } = require('jspdf');

const app = express();

// set the view engine for the application
// the default folder for views is views so no need to set the view dictionary
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended:true}));
// public stores all the resources will be accessed by the users.
app.use(express.static('public'));

// create the connection between the server and the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'PIA',
    port: 3306
});

// check the database connection
connection.connect((err, res) => {
    if(err){
        throw err;
    }else{
        console.log('connected');
    }
});

/*  initialize the login err to be false
    if err is true then show the error message.
    initialize the signup err to be 0, 
    0 stand for no errors, 
    1 stand for confirmPassword and password not match
    2 stand for user already exist
    initialize the other values that may be used in the future.
*/
let loginErr = false;
let signupErr = 0;
let regulations = [];
let userChoiceReg = ['GDPR','OAIC','Reg3'];
let regIdList= []; 
let regTextareaValue ='';
let mappingRegAndPP = [];
let privacyPrinciples = [];
let userChoicePP =[
    'GDPR1: Lawfulness, fairness and transparency',
    'GDPR2: Purpose limitation',
    'GDPR3: Data minimisation',
    'GDPR4: Accuracy',
    'GDPR5: Storage limitation',
    'GDPR6: Integrity and confidentiality (security)',
    'GDPR7: Accountability',
    'APP1: Open and transparent management of personal information',
    'APP2: Anonymity and pseudonymity',
    'APP3: Collection of solicited personal information',
    'APP4: Dealing with unsolicited personal information',
    'APP5: Notification of the collection of personal information',
    'APP6: Use or disclosure of personal information',
    'APP7: Direct marketing',
    'APP8: Cross-border disclosure of personal information',
    'APP9: Adoption, use or disclosure of government related identifiers',
    'APP10: Quality of personal information',
    'APP11: Security of personal information',
    'APP12: Access to personal information',
    'APP13: Correction of personal information',
    'Reg3 1: HHHHH',
    'Reg3 2:SSSSS'
  ];
let threats = [];
let userChoiceThreats=['Accidental Sharing','Employee Data Theft','Ransomware','Overworked Cybersecurity Teams'];
let threatTextareaValue ='';
let controls = [];
let userChoiceControls =['C1','C2','C3','C4','C5','C6'];
let controlTextareaValue ='';
let mappings= [];
let classNameList = []; // used in mapping page to set different class names for different card.
let textareaIdList = []; // used in the mapping page to get different id for the textareas.
// The data structure of mappingsTextareaValue is a List of Textarea values in different Card.
// used in the mapping page to get the data saved in the server for each card.
let mappingsTextareaValue = []; 
// The userChoiceMappings is a list of list data which each list is for each card
// used in the mapping page to get the data saved in the server for each card.
let userChoiceMappings = [];
// cardIdList is for the use of identifying every card in the mapping
let cardIdList = [];
// leftTables is for the use of identifying which card is which card.



//get the regulations from the database for latter render of the process page.


let queryRegulations = "SELECT Regulationname FROM Regulation";
connection.query(queryRegulations, (err, results) => {
    if(err){
        console.log("Error getting regulations from database: " + err);
    }else{
        for(let i = 0; i < results.length; i++){
            // test use: console.log(results[i].Regulationname);
            regulations.push(results[i].Regulationname);
            //console.log(regulations);
        }
    }
});

//get the privacyPrinciples from the database for latter render of the process page.
let queryPP = "SELECT Principle_purpose FROM Privacy_Principle"
connection.query(queryPP, (err, results) => {
    if(err){
        console.log("Error getting Privacy Principles from database: " + err);
    }else{
        for(let i = 0; i < results.length; i++){
            //console.log(results[i].Principle_purpose); 
            privacyPrinciples.push(results[i].Principle_purpose);
        }
        //console.log(privacyPrinciples);
    }
});

//get the threats from the database for the latter render of the process page.
let queryThreats = "SELECT Threatname FROM Threat";
connection.query(queryThreats,(err,results) => {
    if(err){
        console.log("Error getting Threats from database: " + err);
    }else{
        for (let i = 0; i <results.length; i++) {
            threats.push(results[i].Threatname);
        }
        //console.log(threats);
    }
});

//get the controls from the database for latter render of the process page.
let queryControls = "SELECT Controlname FROM Control";
connection.query(queryControls,(err,results) => {
    if(err){
        console.log("Error getting Controls from database: " + err)
    }else{
        for (let i=0;i< results.length; i++) {
            controls.push(results[i].Controlname);
        }
        //console.log(controls);
    }
});



// the index page is the login page and here is changed to use ejs to render the page.
app.get('/', (req, res) => {
    res.render('login',{loginErr: loginErr});
});


app.post("/", (req, res) => {
    // Reinitialized the loginErr to be false
    loginErr = false;
    // get the data from post request first
    let account = req.body.account;
    let password = req.body.password;

    // form the query to consult the database to get the Authentication.
    let queryUsername = "SELECT password FROM User WHERE Username = " + "'" + account + "'";
    let queryEmail = "SELECT email FROM User WHERE Email = " + "'" + account + "'";

    //the first query assumes the entered account is an email address
    connection.query(queryEmail,(err,results) => {
        if(err){
            console.log("Error login: " + err);
        }else{
            if(results.length > 0){
                if(results[0].password == password){
                    res.render('main');
                }else{
                    loginErr = true;
                    res.redirect('/');
                }
           }        
        }
    });

    //the second one assumes the entered account is the username.
    connection.query(queryUsername,(err,results) => {
        if(err){
            console.log("Errore login: " + err);
        }else{
            if(results.length > 0){
                if(results[0].password == password){
                    res.render('main');
                }else{
                    loginErr = true;
                    res.redirect('/');
                }
           }        
        }
    });
});

app.get('/signup', (req, res) => {
    res.render('signup',{signupErr:signupErr});
});

/*  
    signup err code:
    0 stand for no errors, 
    1 stand for confirmPassword and password not match
    2 stand for user already exist
*/
app.post('/signup',(req, res) => {
    //initialize the signupErr to be 0
    signupErr = 0;
    //get the data from the post request
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    let organization = req.body.organization;
    /*first check the twice entered password, if not match set error number to 1 for the server to render the corresponding error message*/
    if (password!=confirmPassword){
        signupErr = 1;
        res.redirect('/signup');
    }
    //form the query to consult the database to check if user exists
    let queryUsername = "SELECT password FROM User WHERE Username = " + "'" + username + "'";
    let queryEmail = "SELECT email FROM User WHERE Email = " + "'" + email + "'";

    // check if username exists
    connection.query(queryEmail,(err,results) => {
        if(err){
            console.log("Errore login: " + err);
        } else if(results.length!=0) {
            signupErr = 2;
            res.redirect('/signup');
        }
    });
    
    //check if email exists
    connection.query(queryUsername,(err,results) => {
        if(err){
            console.log("Errore login: " + err);
        } else if(results.length!=0) {
            signupErr = 2;
            res.redirect('/signup');
        }
    });

    // form the insertion query if no err found
    let queryInsert = "INSERT INTO `PIA`.`User` (`Username`, `Email`, `Password`,`Organization`) VALUES ('"+username +"', '"+ email +"', '"+password +"', '"+organization + "')";
    // insert the data into the database
    connection.query(queryInsert,(err,results) => {
        if(err){
            console.log("Errore login: " + err);
        } else{
            console.log("Inserted");
            res.render('main');
        }
    });
});



app.get('/toolReg',(req, res)=>{
    regTextareaValue = '';
    for (let i=0; i<userChoiceReg.length; i++){
        regTextareaValue +=userChoiceReg[i];
        regTextareaValue +='*';
    }
    regulations = [];
    let queryRegulations = "SELECT Regulationname FROM Regulation";
    connection.query(queryRegulations,(err,results) => {
        if (err){
            console.log("Error getting regulations from database: " + err);
        } else {
            for (let i = 0; i < results.length; i++) {
                regulations.push(results[i].Regulationname);
            }
            res.render('toolReg',{regulations: regulations ,userChoiceReg:userChoiceReg,regTextareaValue:regTextareaValue});
        }
    });
});

app.post('/toolReg',(req, res)=>{
    console.log("data get");
    console.log(req.body);
    userChoiceReg = [];
    //console.log("req.body");
    //console.log(req.body);
    let regulationsChoosed = req.body.regulations.split('*');
    //console.log(regulationsChoosed);
    for (let i = 0; i <regulationsChoosed.length-1; i++){
        userChoiceReg.push(regulationsChoosed[i]);
    }
    let customizedReg = req.body.newRegulation;
    let dataToBeDeleted = req.body.deleteRegulation;
    if (customizedReg !== ''){
        userChoiceReg.push(customizedReg);
        let insertQueryReg ="INSERT INTO `PIA`.`Regulation` (`Regulationname`) VALUES ('" + customizedReg+ "')";
        connection.query(insertQueryReg,(err,results)=>{
            if (err) {
                throw err;
            } else {
                console.log("Inserted");
                res.redirect('toolReg');
            }
        })
    } else if (dataToBeDeleted !=='') {
        let deleteQueryReg ="DELETE FROM `PIA`.`Regulation` WHERE (`Regulationname` = '"+ dataToBeDeleted + "')";
        connection.query(deleteQueryReg,(err,results)=>{
            if(err){
                throw err;
            } else {
                console.log("Deleted");
                res.redirect('toolReg');
            }
        })
    } else {
        res.redirect('toolReg');
    }
    //console.log(userChoiceReg);
    /*get the data the user choose or entered*/


})



app.get('/threat',(req, res)=>{
    threatTextareaValue = '';
    for (let i = 0; i <userChoiceThreats.length; i++){
        threatTextareaValue +=userChoiceThreats[i];
        threatTextareaValue +='*';
    }
    console.log(threatTextareaValue);
    threats = [];
    let queryThreats = "SELECT Threatname FROM Threat";
    connection.query(queryThreats,(err,results)=>{
        if(err){
            console.log("Error getting threat data:" + err);
        }else{
            for (let i = 0; i <results.length; i++) {
                threats.push(results[i].Threatname);
            }
            res.render('threat',{threats: threats,userChoiceThreats: userChoiceThreats,threatTextareaValue:threatTextareaValue});
        }
    });
    
});

app.post('/threat',(req, res)=>{
    userChoiceThreats = [];
    let threatChoosed = req.body.threats.split('*');
    for (let i = 0; i < threatChoosed.length-1; i++){
        userChoiceThreats.push(threatChoosed[i]);
    }
    userChoiceMappings = [];
    for (let i = 0; i < userChoiceThreats.length;i++){
        userChoiceMappings.push([]);
    }
    let customizedThreat = req.body.newThreat;
    let dataToBeDeleted = req.body.deleteThreat;
    if (customizedThreat !==''){
        userChoiceThreats.push(customizedThreat);
        let insertQueryThreat ="INSERT INTO `PIA`.`Threat` (`Threatname`) VALUES ('" + customizedThreat+ "')";
        connection.query(insertQueryThreat,(err,results)=>{
            if(err){
                console.log("Error inserting the data: "+ err);
            }else{
                console.log("Inserted");
                res.redirect('threat');
            }
        })
    } else if(dataToBeDeleted!==''){
        let deleteQueryThreat = "DELETE FROM `PIA`.`Threat` WHERE (`Threatname` = '"+ dataToBeDeleted + "')";
        connection.query(deleteQueryThreat,(err,results)=>{
            if(err){
                console.log("Error deleting the data: "+ err);
            }else{
                console.log("Deleted");
                res.redirect('threat');
            }
        })
    }else{
        res.redirect('threat');
    }
});

app.get('/controls',(req, res)=>{
    controlTextareaValue = '';
    for (let i = 0; i <userChoiceControls.length; i++){
        controlTextareaValue +=userChoiceControls[i];
        controlTextareaValue +='*';
    }
    console.log(controlTextareaValue);
    controls = [];
    let queryControls = "SELECT Controlname FROM Control";
    connection.query(queryControls,(err,results)=>{
        if(err){
            console.log("Error getting control data:" + err);
        }else{
            for (let i = 0; i <results.length; i++) {
                controls.push(results[i].Controlname);
            }
            res.render('controls',{controls: controls,userChoiceControls:userChoiceControls,controlTextareaValue:controlTextareaValue});
        }
    });
    
});

app.post('/controls',(req, res)=>{
    userChoiceControls = [];
    let controlChoosed = req.body.controls.split('*');
    for (let i = 0; i < controlChoosed.length-1; i++){
        userChoiceControls.push(controlChoosed[i]);
    }
    let customizedControl = req.body.newControl;
    let dataToBeDeleted = req.body.deleteControl;
    if (customizedControl !==''){
        userChoiceControls.push(customizedControl);
        let insertQueryControl = "INSERT INTO `PIA`.`Control` (`Controlname`) VALUES ('" + customizedControl+ "')";
        connection.query(insertQueryControl,(err,results)=>{
            if(err){
                console.log("Error inserting the data: "+ err);
            }else{
                console.log("Inserted");
                res.redirect('controls');
            }
        })
    }else if (dataToBeDeleted !=='') {
        let deleteQueryControl = "DELETE FROM `PIA`.`Control` WHERE (`Controlname` = '"+ dataToBeDeleted + "')";
        connection.query(deleteQueryControl,(err,results)=>{
            if(err){
                console.log("Error deleting the data: "+ err);
            }else{
                console.log("Deleted");
                res.redirect('controls');
            }
        })
    } else{
        res.redirect('controls');
    }
});

app.get('/mapping',(req, res)=>{
    classNameList =[];
    for (let i = 0; i <userChoiceThreats.length; i++){
        classNameList.push("Threat"+i);
    }
    // console.log("classNameList")
    // console.log(classNameList);
    textareaIdList = [];
    for (let i = 0; i < userChoiceThreats.length; i++) {
        textareaIdList.push("textarea"+i);
    }
    // console.log("textareaIdList")
    // console.log(textareaIdList);
    cardIdList = [];
    for (let i = 0; i < userChoiceThreats.length; i++) {
        cardIdList.push("cardIndex"+i);
    }
    // console.log('cardIdList');
    // console.log(cardIdList);
    leftTables = [];
    for (let i = 0; i < userChoiceThreats.length; i++) {
        leftTables.push("leftTable"+i);
    }
    //console.log('leftTables');
    //console.log(leftTables);
    res.render('mapping',{controls: controls,userChoiceControls:userChoiceControls,controlTextareaValue:controlTextareaValue,userChoiceThreats: userChoiceThreats,classNameList:classNameList,textareaIdList:textareaIdList,mappingsTextareaValue:mappingsTextareaValue,userChoiceMappings:userChoiceMappings,cardIdList:cardIdList,leftTables:leftTables});
});

app.post('/mapping',(req, res)=>{
    console.log(req.body);
    let dataReceived = req.body.textarea.split('*');
    console.log("dataReceived")
    console.log(dataReceived);
    userChoiceMappings[dataReceived[0]]=[];
    for (let i = 0; i < dataReceived.length-2; i++) {
        userChoiceMappings[dataReceived[0]].push(dataReceived[i+1]);
    }
    console.log(userChoiceMappings);
    mappingsTextareaValue=[];
    for (let i = 0; i <userChoiceMappings.length; i++){
        mappingsTextareaValue.push([]);
        let textareaData = "";
        for (let j=0;j<userChoiceMappings[i].length;j++){
            textareaData+=userChoiceMappings[i][j];
            textareaData+="*";
        }
        mappingsTextareaValue[i].push(textareaData);
    }
    console.log(mappingsTextareaValue);
    // create pdf using jsPDF module
    const report = new jsPDF();
    let x=20;
    let y=20;
    report.setFontSize(18);
    report.text(x,y,"Regulation chosen:");
    x+=8;
    for (let i = 0; i < userChoiceReg.length; i++) {
        y+=6;
        report.setFontSize(14);
        report.text(x,y,(i+1)+". "+userChoiceReg[i]);
    }
    x-=8;
    y+=10
    report.setFontSize(18);
    report.text(x,y,"Privacy Principles chosen:");
    x+=8;
    for(let i = 0; i < userChoicePP.length; i++) {
        y+=6;
        report.setFontSize(14);
        report.text(x,y,(i+1)+'. '+userChoicePP[i]);
    }
    x-=8;
    y+=10;
    report.setFontSize(18);
    report.text(x,y,"Threats chosen:");
    x+=8;
    for(let i=0;i<userChoiceThreats.length; i++) {
        y+=6;
        report.setFontSize(14);
        report.text(x,y,(i+1)+'. '+userChoiceThreats[i]);
    }
    x-=8;
    y+=10;
    report.setFontSize(18);
    report.text(x,y,"Controls chosen:");
    x+=8;
    for(let i=0;i<userChoiceControls.length; i++) {
        y+=6;
        report.setFontSize(14);
        report.text(x,y,(i+1)+'. '+userChoiceControls[i]);
    }
    x-=8;
    y+=10;
    report.setFontSize(18);
    report.text(x,y,"Mappings chosen:");
    x+=8;
    let count = 1;

    for(let i=0;i<userChoiceMappingsPP.length;i++){
        for (let j=0;j<userChoiceMappingsPP[i].length;j++){
            y+=6;
            report.setFontSize(14);
            report.text(x,y,count+". "+userChoiceMappingsPP[i][j]);
            count+=1;
        }
    }

    for(let i=0;i<userChoiceMappings.length; i++) {
        for(let j=0;j<userChoiceMappings[i].length; j++) {
            y+=6;
            report.setFontSize(14);
            report.text(x,y,count+'. '+userChoiceMappings[i][j]);
            count+=1;
        }
    }
    report.save("report.pdf");
});

app.get('/report',(req, res) => {
    res.sendFile(__dirname+'/report.pdf');
})


app.get('/test',(req, res)=>{
    res.render('test');
})

app.post('/test',(req, res)=>{
    console.log(req.body);
    console.log(req.body.privacyPrinciples.split('*'));

})

app.get('/newtest',(req, res)=>{
    res.render('newtest');
});

app.post('/newtest',(req, res)=>{
    console.log(req.body);
})

app.post('/newPP',(req, res)=>{
    let data = req.body;
    console.log(req.body);
    let currentKeys = Object.keys(data);
    let Regulations_idRegulations = (currentKeys[0].split('*'))[1];
    let newPrinciple = data[currentKeys[0]];
    let deletePrinciple =data[currentKeys[1]];
    console.log(Regulations_idRegulations);
    console.log(newPrinciple);
    console.log(deletePrinciple);

    if(newPrinciple!==""){
        let queryInsertPP = "INSERT INTO `PIA`.`Privacy_Principle` (`Principle_purpose`, `Regulations_idRegulations`) VALUES ("+"'"+ newPrinciple + "'" +", '"+Regulations_idRegulations+"')";
        connection.query(queryInsertPP,(err,results)=>{
            if(err){
                concole.log("Error inserting");
            }else{
                console.log("Inserted");
                res.redirect('newPP');
            }
        })
    } else if(deletePrinciple!==""){
        let queryDeletePP = "DELETE FROM `PIA`.`Privacy_Principle` WHERE (`Principle_purpose` = "+"'"+deletePrinciple+"')";
        connection.query(queryDeletePP,(err,results)=>{
            if(err){
                console.log("Error Deleting");
            }else{
                console.log("Deleted");
                res.redirect('/newPP');
            }
        })
    }else{
        res.redirect('newPP');
    }
    
    
    
    
    
})

app.get('/newPP',(req, res)=>{
    regIdList=[];
    for (let i = 0; i <userChoiceReg.length ; i++){
        let getIdQuery = "SELECT idRegulation FROM PIA.Regulation WHERE Regulationname = " + "'" + userChoiceReg[i] + "'";
        connection.query(getIdQuery,(err,results)=>{
            if (err){
                throw err;
            }else{
                regIdList.push(results[0].idRegulation);
            }
        })
    }
    mappingRegAndPP=[];
    userChoiceMappingsPP = [];
    setTimeout(()=>{
        for (let i = 0; i <regIdList.length;i++){
            mappingRegAndPP.push([]);
            let getPPquery = "SELECT Principle_purpose FROM PIA.Privacy_Principle WHERE Regulations_idRegulations =" + "'" + regIdList[i] + "'";
            connection.query(getPPquery,(err,results)=>{
                if(err){
                    throw err;
                } else{
                    for (let j=0; j<results.length ; j++){
                        mappingRegAndPP[i].push(results[j].Principle_purpose);
                        userChoiceMappingsPP.push([]);
                    }
                }
            })
        }
    },100);
    setTimeout(()=>{res.render('newPP',{mappingRegAndPP: mappingRegAndPP,userChoiceReg:userChoiceReg,regIdList:regIdList})},200);
});

let mappingsPPTextareaValue =[];
let userChoiceMappingsPP =[];
app.get('/mappingPPandThreat',(req, res)=>{
    userChoicePP = [];
    for (let i = 0; i <mappingRegAndPP.length;i++){
        for (let j=0; j<mappingRegAndPP[i].length ; j++){
            userChoicePP.push(mappingRegAndPP[i][j]);
        }
    }
    console.log(userChoicePP);
    classNameList =[];
    for (let i = 0; i <userChoicePP.length; i++){
        classNameList.push("Principle"+i);
    }
    // console.log("classNameList")
    // console.log(classNameList);
    textareaIdList = [];
    for (let i = 0; i < userChoicePP.length; i++) {
        textareaIdList.push("textarea"+i);
    }
    // console.log("textareaIdList")
    // console.log(textareaIdList);
    cardIdList = [];
    for (let i = 0; i < userChoicePP.length; i++) {
        cardIdList.push("cardIndex"+i);
    }
    // console.log('cardIdList');
    // console.log(cardIdList);
    leftTables = [];
    for (let i = 0; i < userChoicePP.length; i++) {
        leftTables.push("leftTable"+i);
    }


    res.render('mappingPPandThreat',{userChoiceThreats: userChoiceThreats,userChoicePP:userChoicePP,mappingsPPTextareaValue:mappingsPPTextareaValue,textareaIdList:textareaIdList,userChoiceMappingsPP:userChoiceMappingsPP,cardIdList:cardIdList,classNameList:classNameList,leftTables:leftTables});
});

app.post("/mappingPPandThreat",(req, res)=>{
    console.log(req.body);
    let dataReceived = req.body.textarea.split('*');
    console.log("dataReceived")
    console.log(dataReceived);
    userChoiceMappingsPP[dataReceived[0]]=[];
    for (let i = 0; i < dataReceived.length-2; i++) {
        userChoiceMappingsPP[dataReceived[0]].push(dataReceived[i+1]);
    }
    console.log("userChoiceMappingsPP")
    console.log(userChoiceMappingsPP);
    mappingsPPTextareaValue=[];
    for (let i = 0; i <userChoiceMappingsPP.length; i++){
        mappingsPPTextareaValue.push([]);
        let textareaData = "";
        for (let j=0;j<userChoiceMappingsPP[i].length;j++){
            textareaData+=userChoiceMappingsPP[i][j];
            textareaData+="*";
        }
        mappingsPPTextareaValue[i].push(textareaData);
    }
    //console.log(mappingsPPTextareaValue);
})

function rootPIA(name){
    this.name = name;
    this.children = [];
}

function regulationNode(name){
    this.name = name;
    this.children =[];
}

function ppNode(name){
    this.name = name;
    this.children = [];
}

function threatNode(name,likelihood,severity){
    this.name = name;
    this.children=[];
    this.likelihood=likelihood;
    this.severity=severity;
}

function controlNode(name){
    this.name = name;
    this.children = [];
}


userChoiceReg=["GDPR"];
  
mappingRegAndPP = [
['GDPR1: Lawfulness, fairness and transparency',
'GDPR2: Purpose limitation',
'GDPR3: Data minimisation',
'GDPR4: Accuracy',
'GDPR5: Storage limitation',
'GDPR6: Integrity and confidentiality (security)',
'GDPR7: Accountability']];

userChoiceMappingsPP=[
    [
      'Accidental Sharing ==> GDPR1: Lawfulness, fairness and transparency'
    ],
    [ 'Employee Data Theft ==> GDPR2: Purpose limitation' ],
    [ 'Employee Data Theft ==> GDPR3: Data minimisation' ],
    [ 'Ransomware ==> GDPR4: Accuracy' ],
    [ 'Overworked Cybersecurity Teams ==> GDPR5: Storage limitation' ],
    [
      'Overworked Cybersecurity Teams ==> GDPR6: Integrity and confidentiality (security)'
    ],
    [ 'Accidental Sharing ==> GDPR7: Accountability' ]
  ];

userChoiceMappings=[
    [ 'Data Loss Prevention (DLP) ==> Accidental Sharing' ],
    [
      'Identity and Access Management (IDAM) ==> Overworked Cybersecurity Teams'
    ],
    [ 'Encryption and Pseudonymization ==> Employee Data Theft' ],
    [ 'Third-Party Risk Management ==> Ransomware' ]
  ];
  
app.get('/visualization',(req, res)=>{
    let rootNode = new rootPIA("Root");
    for (let i=0; i<userChoiceReg.length ; i++){
        let regNode = new regulationNode(userChoiceReg[i]);
        rootNode.children.push(regNode);
        for (let j=0; j<mappingRegAndPP[i].length; j++){
            let PPnode = new ppNode(mappingRegAndPP[i][j]);
            let currentPP = mappingRegAndPP[i][j];
            regNode.children.push(PPnode);
            for(let k=0;k<userChoiceMappingsPP.length;k++){
                for (let n=0;n<userChoiceMappingsPP[k].length;n++){
                    let currentPPMapping = userChoiceMappingsPP[k][n];
                    //console.log(currentPPMapping);
                    let PP = currentPPMapping.split(' ==> ')[1];
                    let currentT = currentPPMapping.split(' ==> ')[0];
                    if (PP==currentPP){
                        for(let n=0;n<userChoiceThreats.length;n++){
                            if (userChoiceThreats[n]==currentT){
                                let ThreatNode = new threatNode(currentT,threatLevel[n][1],threatLevel[n][0]);
                                console.log(ThreatNode);
                                PPnode.children.push(ThreatNode);
                                for (let m=0;m<userChoiceMappings.length;m++){
                                    for (let q=0;q<userChoiceMappings[m].length; q++){
                                        let currentTandCMapping = userChoiceMappings[m][q];
                                        let T = currentTandCMapping.split(' ==> ')[1];
                                        let currentC = currentTandCMapping.split(' ==> ')[0];
                                        if(T==currentT){
                                            let ControlNode = new controlNode(currentC);
                                            ThreatNode.children.push(ControlNode);
                                        }
                                    }
                                }
                            }
                        }
                        
                    }
                }
            }
        }
    }

    let testObj = JSON.stringify(rootNode);


    res.render('visualization',{testObj: testObj});
})


app.get('/threatSeverity',(req, res) => {
    res.render('threatSeverity',{userChoiceThreats: userChoiceThreats});
})

let threatLevel =[
    [ 'Critical Impact', '10' ],
    [ 'Critical Impact', '5' ],
    [ 'Critical Impact', '5' ],
    [ 'Critical Impact', '5' ]
  ];
app.post('/threatSeverity',(req, res) => {
    for(let i = 0; i < req.body.severity.length; i++){
        threatLevel.push([]);
        threatLevel[i].push(req.body.severity[i]);
        threatLevel[i].push(req.body.likelihood[i]);
    }
    console.log("threatLevel");
    console.log(threatLevel);
})





// for (let i = 0; i <userChoiceReg.length ; i++){
//     let getIdQuery = "SELECT idRegulation FROM PIA.Regulation WHERE Regulationname = " + "'" + userChoiceReg[i] + "'";
//     connection.query(getIdQuery,(err,results)=>{
//         if (err){
//             throw err;
//         }else{
//             regIdList.push(results[0].idRegulation);
//         }
//     })
// }

// setTimeout(()=>{
//     for (let i = 0; i <regIdList.length;i++){
//         mappingRegAndPP.push([]);
//         let getPPquery = "SELECT Principle_purpose FROM PIA.Privacy_Principle WHERE Regulations_idRegulations =" + "'" + regIdList[i] + "'";
//         connection.query(getPPquery,(err,results)=>{
//             if(err){
//                 throw err;
//             } else{
//                 for (let j=0; j<results.length ; j++){
//                     mappingRegAndPP[i].push(results[j].Principle_purpose);
//                 }
//             }
//         })
//     }
// },100);


// let the app listen on port 3000
app.listen(3000,() => {
    console.log('listening on Port 3000');
});


// async function f1(){
//     return new Promise((resolve, reject) => {
//         setTimeout(()=>{ resolve('abc'),2000})
//     })
// }

// async function f2(){
//     var c = await f1();
//     console.log(c);
//     console.log("hello");
// }

// f2();

// app.get('/toolPrivacyPrinciple',(req, res)=>{
//     pPTextareaValue = '';
//     for (let i = 0; i <userChoicePP.length; i++){
//         pPTextareaValue +=userChoicePP[i];
//         pPTextareaValue +='*';
//     }
//     console.log(pPTextareaValue);
//     res.render('toolPrivacyPrinciple',{privacyPrinciples: privacyPrinciples,userChoicePP:userChoicePP,pPTextareaValue:pPTextareaValue});
// });

// app.post('/toolPrivacyPrinciple',(req, res)=>{
//     userChoicePP = [];
//     let pPChoosed = req.body.pP.split('*');
//     for (let i = 0; i < pPChoosed.length-1; i++){
//         userChoicePP.push(pPChoosed[i]);
//     }
//     let customizedPP = req.body.newPP;
//     if (customizedPP !==''){
//         userChoicePP.push(customizedPP);
//     }
//     res.redirect('toolPrivacyPrinciple');
// });