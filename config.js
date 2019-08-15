const serverPort = process.env.PORT || 4000;

module.exports = {
    server: {
        port: serverPort,
    },
    jwt: {
        secret: "ZuhQmXFdwERIZMnOu4qiCJyYXKkVfqVk",
        options: {
            expiresIn: '90d',
        },
    },
    db: {
        name: "shiftup2",
        connectionString: process.env.DEV_CONNECTION_STRING,
        collections: {
            users: "Users",
            businesses: "Businesses",
            shifts: "Shifts",
            constraints: "Constraints",
            constraintsReasons: "ConstraintsReasons",
            statusType: "StatusType",
            scraper: "Scraper"
        }
    },
    mailer: {
        mail: "shiftup@group.com",
        apiKeyCode: process.env.SHIFTUP_MAIL_KEY_CODE
    }
};