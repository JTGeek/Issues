$(document).ready(function () {
    // if (!localStorage.getItem("issue-user")) {

    $(".log-form").submit(function (event) {
        event.preventDefault();
        let obj = {
            username: $("#username").val(),
            password: $('#password').val(),
        };
        $.ajax({
            type: "POST",
            url: '/api/users/login',
            contentType: 'application/json',
            data: JSON.stringify(obj),
            dataType: "json",
            success: function (json) {
                console.log(json);
                let userId = json.data._id;
                console.log(userId);
                localStorage.setItem('issues-user', userId);
                window.location.href = "/shelf";
            },
            error: function (err) {
                console.log(err)
            }

        })
    });
    // }
});