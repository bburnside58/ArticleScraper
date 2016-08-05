//Handle User Comments
//We can use ajax to invoke routes as well through url:
//These routes can be a POST route to the database
$(document).on('click', '#addComment', function(){
  $.ajax({
    type: "POST",
    url: '/submit',
    dataType: 'json',
    data: {
      comment: $('#comment').val(),
      created: Date.now()
    }
  })
  .done(function(data){
    console.log(data);
    console.log("ajax is working=======================================");
    getComments();
    $('#comment').val("");
  }
  );
  return false;
});

function getComments(){
  //$('#unread').empty();
  $.getJSON('/comments', function(data) {
    for (var i = 0; i<data.length; i++){
      $('#postedComments').prepend(data[i]);
    }
    console.log(data);
  });
}

getComments();
