function indexScript(){

    //get request selectors
    var getInput = $('#input-id');
    var getResult = $('#get-result');
    var getType = $('#select-search-type');
    var getbtn = $('#getbtn');

    //pôst request selectors
    var postBody = $('#post-body');
    var postResult = $('#post-result');
    var postbtn = $('#postbtn');
}



indexScript.prototype.sendPostRequest = function(anchorjson){
    $.ajax({
        type: "GET",
        url: "anchor",
        data: {
            
        },
        Headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        success: function(data) {
            location.reload()
        },

        error: function(res, statut, error){
            loadingAnimation.disable(me.$inputs);
            me.FailureFeedback(error);
        }
      });
}

indexScript.prototype.sendGetRequest = function(searchParam, searchtype){
    $.ajax({
        type: "POST",
        url: "anchor",
        data: JSON.stringify({

        }),
        contentType: "application/json",
        success: function(data) {

        },

        error: function(res, statut, error){

        }
      });
}



var index = new indexScript();