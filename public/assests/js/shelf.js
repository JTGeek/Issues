$(document).ready(function () {
    if (!localStorage.getItem("issue-user")) {
        localStorage.setItem('issues-user', '5997f8208f700651f445a3e5');
    }

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
            },
            error: function (err) {
                console.log(err)
            }

        })
    });

    //  $.ajax({
    //      type: "GET",
    //      url: '/catalog'
    //      async: true,
    //      dataType: "json",
    //      success: function (json) {
    //          //filter out json array, for images and embedded subdoc
    //          // console.log(json);
    //          var userFN = json._embedded.user;
    //          var allCatalogItems = json._embedded.title;
    //          var e = document.getElementById("catalogTableDiv");
    //          e.innerHTML = "Hello, " + userFN + " you currently have " + catalogItems.length + " issues in your catalog.";

    //          console.log(json);
    //          for (var i = 0; i < allCatalogItems.length; i++) {
    //              var item = allCatalogItems[i];
    //              addCatalogItem(item);
    //          };

    //      },
    //      error: function (xhr, status, err) {
    //          console.log(err);
    //      }
    //  });
    let img1 = 'https://graphics8.nytimes.com/images/2012/12/19/books/20favorite-book-covers-slide-ORTM/20favorite-book-covers-slide-ORTM-slide.jpg';
    let img2 = 'https://graphics8.nytimes.com/images/2012/12/19/books/20favorite-book-covers-slide-DQPY/20favorite-book-covers-slide-DQPY-slide.jpg';
    let img3 = 'https://graphics8.nytimes.com/images/2012/12/19/books/20favorite-book-covers-slide-QNUF/20favorite-book-covers-slide-QNUF-slide.jpg';
    let img4 = 'https://graphics8.nytimes.com/images/2012/12/19/books/20favorite-book-covers-slide-U60O/20favorite-book-covers-slide-U60O-slide.jpg';
    let shelf = '    <div class="shelf"></div>';


    var shelfItem = [img1, img2, img3, img4, img1, img2, img3, img4, img1, img2, img3, img4, img1, img2, img3, img4, img1, img2, img3, img4, img1, img2, img3, img4, img1, img2, img3, img4, img1, img2, img3, img4, img1, img2, img3, img4, img1, img2, img3, img4, img1, img2, img3, img4, img1, img2, img3, img4];




    //use data from api endpoint after successful test
    let x = (shelfItem, shelf) => {


        for (i = 1; i <= 20; i++) {
            let template = '<li class="bookshelf-book"> <img src = "' + shelfItem[i - 1] + '" /><div class = "bookshelf-caption bottom-to-top" ><h4> Charlotte au Chocolat </h4><p> Pro solum vivendo id, vim ne consul liberavisse reprehendunt.Nec at quis veri prima.Nam ex quot possim repudiare, an erant graece aperiri sea.Albucius percipitur per ne. </p> <button> Download </button> </div> </li>';
            $("#bookShelf").append(template);
            if (i > 0 && i % 5 === 0) {
                $("#bookShelf").append(shelf);
            }
        };
        // $("#bookShelf").append(shelf);
    };

    x(shelfItem, shelf);


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