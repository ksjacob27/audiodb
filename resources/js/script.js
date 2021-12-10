document.addEventListener("DOMContentLoaded", ()=>{
    var reviewButton = document.getElementById("reviewButton");
    reviewButton.addEventListener("click", callBack); 

})

function callBack()
    {
        $('#myModal').modal();

    }

