
//There are several ways to defin a function and assin it to an expoerts
// I Can write: module.export OR only export it is all the same

// First way
function getDate() {
    // getting the date
    let date = new Date();
    let options ={
        weekday:"long",
        day: "numeric",
        month: "long"
    }
    let day = date.toLocaleDateString("en-US",options);
    return day;
};
exports.getD = getDate;


// Second way
var getDay = function () {
    // getting the date
    let date = new Date();
    let options ={
        weekday:"long"
    }
    let day = date.toLocaleDateString("en-US",options);
    return day;
};
module.exports.getDay = getDay;

// Third way
module.exports.getMonth = function () {
    // getting the date
    let date = new Date();
    let options ={
        month: "long"
    }
    let day = date.toLocaleDateString("en-US",options);
    return day;
};



