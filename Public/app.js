$('#addComment').on('click', function(){
  $.ajax({
    type: "POST",
    url: '/submit',
    dataType: 'json',
    data: {
      title: $('#comment').val(),
      created: Date.now()
    }
  })
  .done(function(data){
    console.log(data);
    console.log("ajax is working");
    getComments();
    $('#comment').val("");
  }
  );
  return false;
});

function getComments(){
  //$('#unread').empty();
  $.getJSON('/article', function(data) {
    for (var i = 0; i<data.length; i++){
      $('#unread').prepend(data[i].title);
    }
    // $('#unread').prepend('<tr><th>Title</th><th>Author</th><th>Read/Unread</th></tr>');
  });
}
