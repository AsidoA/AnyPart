const mongoose = require('mongoose');
const Users = require('./API/Models/Users');

const getUserById = async (uid) => {
    try {
        const user = await Users.find({ _id: uid }).exec();
        return user;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const emailHtml = (userName, Oid) => {
    return (`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Open Sans', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        header {
            padding: 10px;
            text-align: center;
        }

        header img {
            max-width: 100px;
            height: auto;
        }

        .content {
            padding: 20px;
            text-align: center;
        }

        .bold-text {
            font-weight: bold;
        }
    </style>
    <title>Email Notification</title>
</head>
<body>
    <header>
        <img src='https://ik.imagekit.io/zov6bak1a/logoAny.png?updatedAt=1685031605066' alt="Your Logo">
    </header>
    <div class="content">
        <h3 class="bold-text">Hi ${userName}</h3>
        <p class="bold-text">You got a new offer for <span class="bold-text">Order ${Oid}</span></p>
        <p>Please sign in and check the details in your profile.</p>
    </div>
</body>
</html>
`)
};

module.exports = { getUserById, emailHtml };