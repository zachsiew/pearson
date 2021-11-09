const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { pool } = require('./config');
const { response } = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

const year_ms = 31556952000;

// function for input valdiation
function inputValidation(data){
    var invalid_email = false;
    var invalid_description = false;
    var desc_str = "";
    var invalid_date = false;
    var date_str = "";

    // parse the input due date data to be in the form of ms
    var input_due_date_ms = Date.parse(data.due_date);

    // get the current date and parse it to be in the form of ms
    dt = new Date();
    var current_date_ms = Date.parse(dt.toJSON().slice(0, 10));

    // Validation on input
    // check for the existance of @ in email
    if(!/@/.test(data.email) || data.email.length < 6 || data.email.length > 30){
        invalid_email = true;
    }


    // check for the length of the description
    if(data.description.length > 1000){
        invalid_description = true
        desc_str = "Content is too long.";
    }
    else if(data.description.length < 100){
        invalid_description = true
        desc_str = "Content is too short.";
    }

    // check for valid date
    if(input_due_date_ms < current_date_ms){
        invalid_date = true;
        date_str = "Date is not a valid date.";
    }
    else if(input_due_date_ms > (current_date_ms + year_ms)){
        invalid_date = true;
        date_str = "Date is too far in the future.";
    }

    return ({
        invalid_email: invalid_email,
        invalid_description: invalid_description,
        desc_str: desc_str,
        invalid_date, invalid_date,
        date_str: date_str
    });
}


app.post('/api/add-data', (req, res) => {
    data = req.body;

    checked = inputValidation(data);

    if(checked.invalid_email || checked.invalid_description || checked.invalid_date){
        res.status(400).json({
            invalid_email: checked.invalid_email,
            invalid_description: checked.invalid_description,
            desc_str: checked.desc_str,
            invalid_date: checked.invalid_date,
            date_str: checked.date_str
        });
        return;
    }
    
    pool.query('INSERT INTO data (email, description, due_date) VALUES ($1, $2, $3)',[
        data.email,
        data.description,
        data.due_date
    ], (err, result) => {
        if(err){
            console.log("Error while inserting");
        }
        else{
            res.status(201).json({status: "success"});
        }
    });

});

app.get('/api/show-data', (req, res) => {
    pool.query(`SELECT * FROM data ORDER BY due_date`, (err, result) => {
        if(err){
            console.log("Error while retrieving data");
        }
        else{
            res.status(200).json(result.rows);
        }
    });
    
});



app.listen(port, () => console.log(`Server is listening on port ${port}`));