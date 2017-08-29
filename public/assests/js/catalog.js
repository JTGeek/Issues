 $.ajax({
     type: "GET",
     url: '/catalog'
     async: true,
     dataType: "json",
     success: function (json) {
         //filter out json array, for images and embedded subdoc
         // console.log(json);
         var userFN = json._embedded.user;
         var allCatalogItems = json._embedded.title;
         var e = document.getElementById("catalogTableDiv");
         e.innerHTML = "Hello, " + userFN + " you currently have " + catalogItems.length + " issues in your catalog.";

         console.log(json);
         for (var i = 0; i < allCatalogItems.length; i++) {
             var item = allCatalogItems[i];
             addCatalogItem(item);
         };

     },
     error: function (xhr, status, err) {
         console.log(err);
     }
 });


 function addCatalogItem(item) {
     //console.log("list item" + issue); Uncomment when debugging
     $("#catalogTable").append("<tr><td>" + item.title + "</td><td>" + item.issue + "</td><td>" + item.publisher + "</td><td>" + item.published + "</td></tr>");

 }