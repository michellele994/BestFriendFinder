module.exports = function(){
  var questions = [
    "Question1",
    "Question2",
    "Question3",
    "Question4",
    "Question5",
    "Question6",
    "Question7",
    "Question8",
    "Question9",
    "Question10"
    ];

  var answers = ["Strongly Disagree", "Disagree", "Neither", "Agree", "Strongly Agree"];
  
  for (var i = 0; i < questions.length; i++)
  {
    var a = $("<h3>");
    a.text(questions[i]);
    $("#question").append(a);
    var b = $("<div>");
    b.addClass("form-check form-check-inline");
    b.attr("id", "q"+i);
    $("#question").append(b);
    var c = $("<div>");
    c.addClass("row");
    c.attr("id", "choices"+i);
    $("#q"+i).append(c);

    for (var j = 0; j < 5; j++)
    {
      var d = $("<div>");
      d.addClass("col-sm-2");
      d.attr("id","choicesCol"+j+"q"+i)
      $("#choices"+i).append(d);

      var e = $("<input>");
      e.addClass("form-check-input");
      e.attr("type", "radio");
      e.attr("name", "inlineRadioOptions"+i);
      e.attr("id", "inlineRadio"+j+"q"+i);
      e.attr("value", j+1);
      $("#choicesCol"+j+"q"+i).append(e);

      var f = $("<label>");
      f.addClass("form-check-label");
      f.attr("for", "inlineRadio"+j+"q"+i);
      f.html(answers[j]);
      $("#choicesCol"+j+"q"+i).append(f);
    }
  }
  var button = $("<button>");
  button.addClass("btn btn-primary");
  button.attr("type","submit");
  button.text("Submit")
  $("#question").append(button);
}