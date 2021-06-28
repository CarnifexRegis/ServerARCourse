function indexScript(){

    //get request selectors
    this.$getInput = $('#input-id');
    this.$getResult = $('#get-result');
    this.$getType = $('#select-search-type');
    this.$getbtn = $('#getbtn');

    //pôst request selectors
    this.$postPlace = $('#post-place');
    this.$postID = $('#post-id');
    this.$postName = $('#post-name');

    this.$postResult = $('#post-result');
    this.$postbtn = $('#postbtn');

    this.$getbtn.click((e) => this.sendGetRequest.call(this, this.$getType.val(), this.$getInput.val()));
    this.$postbtn.click((e) => this.sendPstRequest.call(this, {
        "name" : this.$postPlace.val(),
        "anchor": {
            "id" : this.$postID.val(),
            "name" : this.$postName.val(),
            "children" : [
                {
                    "name": "Door",
                    "id": "",
                    "text": "",
                    "children": []
                }
            ]

        } 
    }));
}



indexScript.prototype.sendGetRequest = function(searchParam, searchValue){
    
    let endpointurl = "anchor" + ((searchParam === "all")? "/all":"");

    let Querydata = {};
    if (searchParam === "all"){
        Querydata = {mapping : true};
    } else {
        Querydata[searchParam] = searchValue;
    }
    
    var me = this;
    $.ajax({
        type: "GET",
        url: endpointurl,
        data: Querydata,
        Headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        success: function(data) {
            console.log(data);
            me.$getResult.text(JSON.stringify(data));
        },

        error: function(res, statut, error){
            me.$getResult.val(error);
        }
      });
}

indexScript.prototype.sendPstRequest = function(anchorData){
    var me = this;
    console.log(anchorData)
    $.ajax({
        type: "POST",
        url: "anchor",
        data: JSON.stringify(anchorData),
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