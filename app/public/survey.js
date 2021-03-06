$(document).ready(function () {
    var questions = [
        "You are a morning person.",
        "You enjoy hanging out in large groups.",
        "You prefer to stay indoors.",
        "You enjoy bullying your friend(s).<p style='font-size:8px; display:inline;'>Brandon Haines, Andrew Kippur, Jason Leo</p>",
        "You like to take group pictures and selfies.",
        "You are willing to get drunk tattoos/piercings with your friend(s).",
        "You enjoy playing video games.",
        "You prefer having few, but close relationships.",
        "You are a picky eater.",
        "You smell good.<p style='font-size:8px; display:inline;'>NOT Brandon Haines, Andrew Kippur, Jason Leo</p>"
    ];
    var answers = ["Strongly Disagree", "Disagree", "Neither", "Agree", "Strongly Agree"];
    var picturesAvail = [];
    //Sets up the HTML for the questions and answers
    prepQuestions();
    $("#submit-button").on("click", function (event) {
        event.preventDefault();
        if (makeNewFriend()) {
            var newFriend = makeNewFriend();
            $.post("/api/friends", newFriend, function (data) {
                // Clear the form when submitting
                $("#userName").val("");
                $("#email").val("");
                $("input[name='pic-choice'").prop('checked', false);
                for (var i = 0; i < questions.length; i++) {
                    $("input[name='inlineRadioOptions" + i + "']").prop('checked', false);
                }
                //You've submitted!
                determineDifferences(newFriend);
                //Show modal
                $('#compatible-friends').modal('show');
            });
        }
        else {
            console.log("Something went wrong.");
        }
    });
    function determineDifferences(newFriend) {
        var currentURL = window.location.origin;
        $.ajax({ url: currentURL + "/api/friends", method: "GET" }).then(function (friends) {
            //variable used to make an array containing sum of differences between all friends against user's answers.
            var differencesBetweenAll = [];
            //Loop checking for differences in each question for each friend other than user.
            for (var i = 0; i < friends.length - 1; i++) {
                //variable to check the scores current player against friends[i]
                var differencesInEachScore = [];
                for (var j = 0; j < questions.length; j++) {
                    var difference = Math.abs(friends[i].scores[j] - newFriend.scores[j]);
                    differencesInEachScore.push(difference);
                }
                //Determining the number of differences each friend has against user.
                var sumOfDifferences = 0;
                for (var j = 0; j < differencesInEachScore.length; j++) {
                    sumOfDifferences += differencesInEachScore[j];
                }
                differencesBetweenAll.push(sumOfDifferences);
                //Clearing it out for the next comparison.
                differencesInEachScore = [];
            }
            determineMatch(friends, differencesBetweenAll);
        });
    }
    function determineMatch(friends, differencesBetweenAll) {
        //take the minimum of an array. I found how to here: https://stackoverflow.com/questions/1669190/find-the-min-max-element-of-an-array-in-javascript
        var matchDifference = Math.min.apply(null, differencesBetweenAll);
        //array to store all the locations of the users with best match (minimum differences)
        var compatiblesLoc = [];
        for (var i = 0; i < differencesBetweenAll.length; i++) {
            if (differencesBetweenAll[i] === matchDifference) {
                compatiblesLoc.push(i);
            }
        }
        //array to store the pictures of those found compatible
        var compatiblesPicture = [];
        for (var i = 0; i < compatiblesLoc.length; i++) {
            var compPic = picturesAvail[friends[compatiblesLoc[i]].photo];
            compatiblesPicture.push(compPic);
            //append each compatible friend to the modal.
            $(".modal-body").append(compatiblesPicture[i] + " " + friends[compatiblesLoc[i]].name + " matches you! <a href=\"mailto:\'" + friends[compatiblesLoc[i]].email + "\'\">Send email</a>!<br>");
        }
    }
    function makeNewFriend() {
        //Make a friend. If not all items are filled out correctly, then notify user with modals
        var newFriend = {
            name: $("#userName").val().trim(),
            photo: $("input[name='pic-choice']:checked").val(),
            email: $("#email").val().trim(),
            scores: []
        }
        for (var i = 0; i < questions.length; i++) {
            var choiceMade = $("input[name='inlineRadioOptions" + i + "']:checked").val() || null;
            newFriend.scores.push(choiceMade);
        }
        if (newFriend.name) {
            if (newFriend.email) {
                if (newFriend.photo) {
                    if (newFriend.scores.indexOf(null) === -1) {
                        return newFriend;
                    }
                    else {
                        $(".modal-error").html("<p style='margin-left: 15px'>You need to answer all before continuing!</p>");
                        $('#error-box').modal('show');
                    }
                }
                else {
                    $(".modal-error").html("<p style='margin-left: 15px'>Please choose a photo!</p>");
                    $('#error-box').modal('show');
                }
            }
            else {
                $(".modal-error").html("<p style='margin-left: 15px'>Please enter your email!</p>");
                $('#error-box').modal('show');
            }
        }
        else {
            $(".modal-error").html("<p style='margin-left: 15px'>Please submit your name</p>");
            $('#error-box').modal('show');
        }
    }

    function prepQuestions() {
        prepPictures();
        for (var i = 0; i < questions.length; i++) {
            var qText = $("<h3>");
            qText.html((i + 1) + ". " + questions[i]);
            $("#question").append(qText);
            var form = $("<div>");
            form.addClass("form-check form-check-inline");
            form.attr("id", "q" + i);
            $("#question").append(form);
            var row = $("<div>");
            row.addClass("row text-center");
            row.attr("id", "choices" + i);
            $("#q" + i).append(row);
            for (var j = 0; j < 5; j++) {
                if (answers[j] === "Strongly Disagree" || answers[j] === "Strongly Agree") {
                    var column = $("<div>");
                    column.addClass("col-sm-3");
                    column.attr("id", "choicesCol" + j + "q" + i);
                    $("#choices" + i).append(column);
                }
                else {
                    var column = $("<div>");
                    column.addClass("col-sm-2");
                    column.attr("id", "choicesCol" + j + "q" + i)
                    $("#choices" + i).append(column);
                }
                var input = $("<input>");
                input.addClass("form-check-input");
                input.attr("type", "radio");
                input.attr("name", "inlineRadioOptions" + i);
                input.attr("id", "inlineRadio" + j + "q" + i);
                input.attr("value", j + 1);
                $("#choicesCol" + j + "q" + i).append(input);
                var label = $("<label>");
                label.addClass("form-check-label");
                label.attr("for", "inlineRadio" + j + "q" + i);
                label.html(answers[j]);
                $("#choicesCol" + j + "q" + i).append(label);
            }
            var br = $("<br>");
            $("#q" + i).append(br);
        }
    }
    function prepPictures() {
        for (var i = 0; i < 6; i++) {
            picturesAvail.push("<img src='/assets/images/male" + (i + 1) + ".png'>");
            picturesAvail.push("<img src='/assets/images/female" + (i + 1) + ".png'>");
        }
        var form = $("<div>");
        form.addClass("form-check form-check-inline");
        form.attr("id", "choose-picture");
        $("#pictures").append(form);
        var row = $("<div>");
        row.addClass("row text-center");
        row.attr("id", "pic-choices");
        $("#choose-picture").append(row);
        for (var i = 0; i < picturesAvail.length; i++) {
            var column = $("<div>");
            column.addClass("col-sm-2");
            column.attr("id", "pic-col" + i)
            $("#pic-choices").append(column);
            var input = $("<input>");
            input.addClass("form-check-input hidden-radio");
            input.attr("type", "radio");
            input.attr("name", "pic-choice");
            input.attr("id", "pic-radio" + i);
            input.attr("value", i);
            $("#pic-col" + i).append(input);
            var label = $("<label>");
            label.addClass("form-check-label");
            label.attr("id", "pic-label" + i);
            label.attr("for", "pic-radio" + i);
            $("#pic-col" + i).append(label);
            $("#pic-label" + i).append(picturesAvail[i]);
        }
    }
    $("#compatible-friends").on('shown.bs.modal', function () {
        $('#modal-dialog').trigger('focus')
    });
    $('#compatible-friends').on('hidden.bs.modal', function (e) {
        $('.modal-body').empty();
    });
    $("#error-box").on('shown.bs.modal', function () {
        $('#modal-dialog').trigger('focus')
    });
    $('#error-box').on('hidden.bs.modal', function (e) {
        $('.modal-error').empty();
    })
});