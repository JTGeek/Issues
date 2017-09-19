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
                console.log(json)
                getUserCatalog();

            },
            error: function (err) {
                console.log(err)
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
                console.log(json)
                if (json && json.length > 0) {
                    addCatalogItem(json);

                    // var userFN = json._embedded.user;
                    // var allCatalogItems = json._embedded.title;
                    // var e = document.getElementById("bookShelf");
                    // e.innerHTML = "Hello, " + userFN + " you currently have " + catalogItems.length + " issues in your catalog.";

                    // console.log(json);
                    // for (var i = 0; i < json.length; i++) {
                    //     var item = json[i];
                    //     addCatalogItem(item);
                    // };
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
            console.log(template);
            $("#bookShelf").append(template);
            if (i > 0 && i % 5 === 0) {
                $("#bookShelf").append(shelf);
            }
        };
        // $("#bookShelf").append(shelf);
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
console.log('test');