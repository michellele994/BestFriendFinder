# BestFriendFinder (BFF)
(link)

In this application, a user can find some new best friend(s)!

The questionnaire is written by a professional with a BS in psychology with a minor in biology (me). She's also pretty good in statistics and has worked as a data analyst, which makes this survey super accurate.

HTML, CSS, Javascript, ExpressJS, AJAX, and Heroku are all used to make this application.

The application consists of two HTML pages: a home page and a survey page. The home page links the user to the survey page.
In the survey, a user is prompted to enter their name, choose a picture from an existing list of pictures, and then rate their level of agreement on 10 given statements that will be used to match to other friends in the server.


How Friends are Matched
Based on the user's answers, the application looks through the entire array of friends that currently exist in the server and determine matches based on number of differences between the user and each existing friend. The least number of differences, in theory, determines the best match. After the match is complete, the user is then shown a list of their matches and their names.

