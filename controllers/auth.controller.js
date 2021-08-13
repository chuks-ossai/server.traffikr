const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION
})

const ses = new AWS.SES({apiVersion: '2021-08-12'})

exports.registerController = (req, res) => {

    const params = {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [req.body.emailAddress]
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `<html><body><h1>Hello ${req.body.fullName}</h1><div><p>Welcome to traffikr.io</p><p>Please click the link below to activate your account and complete your registration.</p></div></body></html>`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Complete Your Registration'
            }
        }
    }

    const sendEmail = ses.sendEmail(params).promise()

    sendEmail.then((data) => {
        console.log('email sent with data:', data)
        res.json({
            data
        })
    }).catch(err => {
        console.log('Unable to send email: ', err)
        res.json({
            data: error
        })
    })
}