const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

mongoose.connect("mongodb+srv://asma:123@atlascluster.ma0ipqn.mongodb.net/tasksDB")

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //to get the stylesheet to work + need to be in folder named public
app.set("view engine", "ejs");

const taskSchema = new mongoose.Schema({
    task: String
});

const Task = mongoose.model("Task", taskSchema);

const market = new Task({
    task: "Market Research"
});

const programming = new Task({
    task: "Finish my project"
});

const record = new Task({
    task: "Record new lecture"
});

let items = [market,programming,record];


const listSchema = new mongoose.Schema({
    name: String,
    list: [taskSchema]
});

const List = mongoose.model("List", listSchema);

app.get("/", function(req,res){
    let day = date.getD();

     Task.find().then((tasks,error)=>{
            if(error){
                console.log(error);
            }else{
               
               // like res.sendFile but for EJS files
               res.render("list",{LIST_TITLE: day, TASK: tasks, LIST_TYPE: "default"});
                
            }
            
        });
    
});

app.post("/",(req,res) =>{
    let listType = req.body.listType;
    let task = req.body.taskName;

    if(listType === "default"){
        const newTask = new Task({
            task: task
        }) 

        newTask.save()
        res.redirect("/")
    }else{
        List.findOne({name: listType}).then((foundList,error)=>{
            foundList.list.push({task:task});
            foundList.save()
            res.redirect("/"+listType)
        })
    }
       
    
})

app.post("/delete",(req,res)=>{
    let checked = req.body.checkbox;
    let listName = req.body.listName;
    if(listName==="default"){
        Task.deleteOne({_id: checked}).then( (error)=>{
            console.log(error); }); 
            res.redirect("/")
    }
    else{
        List.findOneAndUpdate({name: listName},{$pull:{list: {_id: checked}}}).then((foundList,error)=>{
           console.log(error);
           res.redirect("/"+listName)
        })
    }
    
})

app.get("/:p",(req,res)=>{
    
    listName = _.capitalize(req.params.p);

    //To find only one element
    List.findOne({name: listName}).then((foundList,error)=> {
        if(!error){
            if(!foundList){
                
                const list = new List({
                    name: listName,
                    list: items
                })
                list.save()
                res.redirect("/" + list.name)
            }
           else{
            res.render("list",{LIST_TITLE: foundList.name, TASK: foundList.list, LIST_TYPE: foundList.name});
           }
        }
    })
   
    
});

app.get("/about",(req,res)=>{
    res.render("about");
})

app.listen(3000, function(){
    console.log("Server is runig on port 3000");
});



