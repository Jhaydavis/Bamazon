// BAMAZON CAR DEALERSHIP INVENTORY APP
//*************************************

var prompt = require('prompt');
var inquirer = require('inquirer');
var mysql = require('mysql');
var colors = require('colors');

var connection = mysql.createConnection({
     host: 'localhost',
     port: 3306,
     user: 'root',
     password: '',
     database: "bamazon"
});

connection.connect(function(err) {
     if (err) throw err;

});

function carInventory() {
     connection.query('SELECT * FROM products', function(err, inventory) {
          if (err) throw err;
          console.log("Bamazon's Porsche Inventory");
          for(var i = 0; i < inventory.length; i++) {
          console.log("Item ID: " + inventory[i].item_id + " | Product: " + inventory[i].product_name + " | Department: " + inventory[i].department_name + " | Price: " +  inventory[i].price + " | Quantity: " + inventory[i].stock_quantity);
          } 
     });
}

inquirer.prompt([

	{
		type: "list",
		message: "Select an action for the car dealership",
		choices: ["View Cars for Sale", "View Low Car Inventory", "Add to Car Inventory", "Add New Car"],
		name: "selection"
	}

     ]).then(function (user) {
          switch(user.selection) {
               case "View Cars for Sale":
               carInventory();
               break;


               case "View Low Car Inventory":
               connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, inventory) {
                    if (err) throw err;
                    console.log("Bamazon's Porsche Inventory");
                    for(var i = 0; i < inventory.length; i++) {
                    console.log("Item ID: " + inventory[i].item_id + " | Product: " + inventory[i].product_name + " | Department: " + inventory[i].department_name + " | Price: " +  inventory[i].price + " | Quantity: " + inventory[i].stock_quantity);
                    } 
               });
               break;



               case "Add to Car Inventory":
               inquirer.prompt([
               	// Here we create a basic text prompt.
               	{
               		type: "input",
               		message: "What is the id of the car you would like to add to?",
               		name: "item_id"
               	},
                    {
               		type: "input",
               		message: "How many cars should we add to the dealer inventory?",
               		name: "amount"
               	}
            
          ]).then(function (request) {
           
                    connection.query('SELECT * FROM products WHERE item_id=' + request.itemId, function(err, selectedItem) {
                    	if (err) throw err;
                       
                              console.log("You have added ".green + request.amount + " " + selectedItem[0].product_name.green + " to the inventory.".green);
                          
                              connection.query('UPDATE products SET stock_quantity=? WHERE item_id=?', [selectedItem[0].stock_quantity + Number(request.amount), request.item_id],
                              function(err, inventory) {
                              	if (err) throw err;
                                 
                                   carInventory();
                              });  
                    });
               }); 
               break;

               case "Add New Car":
               inquirer.prompt([
               
                    {
                         type: "input",
                         message: "What name of the car you would like to add?",
                         name: "product_name"
                    },
                    {
                         type: "input",
                         message: "What car brand  does this item belong in?",
                         name: "department_name"
                    },
                    {
                         type: "input",
                         message: "What is the price of the car you would like to add to the inventory?",
                         name: "price"
                    },
                    {
                         type: "input",
                         message: "How many cars should we add to the inventory of that item?",
                         name: "stock_quantity"
                    }
            
          ]).then(function (newItem) {

               connection.query("INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)",[newItem.product_name, newItem.department_name, newItem.price, newItem.stock_quantity],
               function(err, inventory) {
                    if (err) throw err;
                   
                    console.log("Great, ".green + newItem.product_name.green + " have been added to the inventory.".green);
                    carInventory();
               }); 


               }); 
          }  

});