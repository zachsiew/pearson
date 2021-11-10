const get_data_button = document.getElementById("get-data");
const hide_data_button = document.getElementById("hide-data");
const display_data = document.getElementById("data-form");
const clear_button = document.getElementById("clear");

// Make post request to our backend when the submit button is clicked
// to validate the inputs given by the user
// Output error message accordingly
document.forms["issue_ticket_form"].addEventListener("submit", (e) => {
    e.preventDefault();

    fetch(e.target.action, {
        method: 'POST',
        body: new URLSearchParams(new FormData(e.target))
    })
    .then((res) => {
        return res.json();
    })
    .then((body) => {
        if(body.invalid_email){
            document.getElementById("email_error").innerHTML = "Invalid Email Address";
        }
        else{
            document.getElementById("email_error").innerHTML = "";
        }

        if(body.invalid_description){
            document.getElementById("description_error").innerHTML = `${body.desc_str}`;
        }
        else{
            document.getElementById("description_error").innerHTML = "";
        }

        if(body.invalid_date){
            document.getElementById("due_date_error").innerHTML = `${body.date_str}`;
        }
        else{
            document.getElementById("due_date_error").innerHTML = "";
        }
    })
    .catch((err) => {
        console.log(err);
    });
});

// Remove the displayed data on screen when hide button is clicked
hide_data_button.addEventListener("click", () => {
    display_data.innerHTML = "";
});


async function getData(){
    try{
        let res = await fetch("/api/show-data");
        return await res.json();
    }
    catch(error){
        console.log(error);
    }
}

async function renderData(){
    let datas = await getData();
    var count = 0;

    let output = '<table style="border-collapse:collapse" border="2px"><tr><th>Email</th><th>Description</th><th>Due Date</th></tr>';

    datas.forEach(data => {
        let outputPart = `<tr height="50px" style="font-size:110%;background-color:${count % 2 === 0 ? "#ffe8a3" : "#c9c9c9"}"><td style="text-align:center">${data.email}</td><td width="30%">${data.description}</td><td style="text-align:center">${data.due_date}</td></tr>`;
        output += outputPart;
        count += 1;
    });

    display_data.innerHTML = output + '</table>';
}

// Make a get request to our database to retreive all valid ticket information
// Make use of renderData() and getData()
get_data_button.addEventListener("click", () => {
    renderData();
});

// Clear out the error message when clear button is clicked
clear_button.addEventListener("click", () => {
    document.getElementById("email_error").innerHTML = "";
    document.getElementById("description_error").innerHTML = "";
    document.getElementById("due_date_error").innerHTML = "";
})