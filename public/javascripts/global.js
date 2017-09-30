//userlist data array for filling in info box
var userListData = [];

//dom ready ==================================
$(document).ready(function(){
	//populate the user table on initial page load
	populateTable();

});

//functions ========================

//fill table with data
function populateTable() {

	//empty content string
	var tableContent = '';

	//jquery ajax call for json
	$.getJSON('/users/userlist', function(data) {

		userListData = data;
		//for each item in our json , add a table row and cells to the cntent string
		$.each(data, function(){
			tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
		});

		//inject the whole content string into our existing HTML table
		$('#userList table tbody').html(tableContent);

	});
};

//show user info
function showUserInfo(event) {

	//prevent link from firing
	event.preventDefault();

	//retrive username from link rel attrubute
	var thisUserName = $(this).attr('rel');

	//get index of object based on id value
	var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

	//get our User object
	var thisUserObject = userListData[arrayPosition];

	//populate info box
	$('#userInfoUserName').text(thisUserObject.username);
	$('#userInfoEmail').text(thisUserObject.email);
	$('#userInfoPhoneNo').text(thisUserObject.phoneno);
	$('#userInfoDOB').text(thisUserObject.dob);
};

//username link click
$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

//add user button click
$('#btnAddUser').on('click', addUser);


// Delete User link click
$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);



//add user
function addUser(event) {
	event.preventDefault();

	//super basic validation increase error count variable if any fields are blank
	var errorCount = 0;
	$('#addUser input').each(function(index, val){
		if($(this).val() === '') {	errorCount++; }
	});

	//check and make sure errorcount's still at zero\
	if(errorCount === 0){

		//if it is, compile all user info into one object
		var newUser = {
			'username': $('#addUser fieldset input#inputUserName').val(),
			'email': $('#addUser fieldset input#inputUserEmail').val(),
			'phoneno': $('#addUser fieldset input#inputUserPhoneNo').val(),
			'address': $('#addUser fieldset input#inputUserAddress').val(),
			'dob': $('#addUser fieldset input#inputUserDOB').val()
		}

		//user ajax to post the object to our adduser service
		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function(response) {

			//check for successful (blank) response
			if(response.msg === '') {

				//clear the form inputs
				$('#adduser fieldset input').val('');

				//update the table
				populateTable();

			}
			else {

				//if somethig goes wrong, alert the error message that our service returned
				alert('Error:' + response.msg);
			}
		});
	}
	else {
		//if error count is more than 0 , error out
		alert('please fill in all fields');
		return false;
	}
};


// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

