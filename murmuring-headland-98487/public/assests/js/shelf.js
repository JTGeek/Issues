$(document).ready(function () {



    $(".insert").submit(function (event) {
        event.preventDefault();
        let obj = {
            title: $("#title").val(),
            issue: $('#issue').val(),
            publisher: $('#publisher').val(),
            userid: localStorage.getItem("issues-user")
        };
        $.ajax({
            type: "POST",
            url: '/api/catalog/additem',
            contentType: 'application/json',
            data: JSON.stringify(obj),
            dataType: "json",
            success: function (json) {
                getUserCatalog();

            },
            error: function (err) {
                console.log(err)
                alert("Sorry, we couldn't find that title in the database, please try a different one")
            }

        })
    });
    let getUserCatalog = function () {
        const url = "/api/catalog/" + localStorage.getItem('issues-user');
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function (json) {

                if (json && json.length > 0) {
                    addCatalogItem(json);
                }


            },
            error: function (err) {
                console.log(err);
            }
        });
    }
    getUserCatalog();


    // XXXXXXXXX
    function addCatalogItem(shelfItem) {

        $("#bookShelf").html('');
        let shelf = '    <div class="shelf"></div>';


        for (i = 0; i < shelfItem.length; i++) {
            let template = '<li class="bookshelf-book"> <img src = "' + shelfItem[i].imgUrl +
                '" /><div class = "bookshelf-caption bottom-to-top" ><h4>' + shelfItem[i].title + '</h4><p> ' +
                shelfItem[i].description + ' </p> <button><a href="' + shelfItem[i].pageUrl +
                '" target="_blank">Details</a></button></div> </li>';

            $("#bookShelf").append(template);
            if (i > 0 && i % 5 === 0) {
                $("#bookShelf").append(shelf);
            }
        };
    };

    // XXXXXXXXXX




    $('#logout').click(function (event) {
        event.preventDefault();
        $.ajax({
            type: "GET",
            url: '/api/users/logout',
            success: function (json) {
                localStorage.removeItem("userId");
                window.location.href = "/";
            },
            error: function (err) {
                console.log(err)
            }

        })
    })

});