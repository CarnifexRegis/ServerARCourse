function indexScript(){

    //get request selectors
    this.$getInput = $('#input-id');
    this.$getResult = $('#get-result');
    this.$getType = $('#select-search-type');
    this.$getbtn = $('#getbtn');

    //pôst request selectors
    this.$postBody = $('#post-body');
    this.$postResult = $('#post-result');
    this.$postbtn = $('#postbtn');

    this.$getbtn.click((e) => this.sendGetRequest.call(this, this.$getType.val(), this.$getInput.val()));
    this.$postbtn.click((e) => this.sendPstRequest.call(this, this.$postBody.val()));
}



indexScript.prototype.sendGetRequest = function(searchParam, searchValue){
    
    let endpointurl = "anchor" + ((searchParam === "all")? "/all":"");

    let Querydata = {};
    Querydata[searchParam] = searchValue;
    var me = this;
    $.ajax({
        type: "GET",
        url: endpointurl,
        data: Querydata,
        Headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        success: function(data) {
            me.$getResult.val(data);
        },

        error: function(res, statut, error){
            me.$getResult.val(error);
        }
      });
}

indexScript.prototype.sendPstRequest = function(anchorjson){
    var me = this;
    $.ajax({
        type: "POST",
        url: "anchor",
        data: JSON.stringify(anchorjson),
        contentType: "application/json",
        success: function(data) {
            console.log(data);
            me.$postResult.val(data);
        },

        error: function(res, statut, error){
            me.$postResult.val(error);
        }
      });
}



var index = new indexScript();