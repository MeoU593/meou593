const nodemailer = require('nodemailer');

const sendOTPEmail = async (userEmail, otp) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: 'restaurant.management.2004@gmail.com',  
            pass: 'vffgepxwlhrytyjp',  
        },
    });

    let mailOptions = {
        from: 'restaurant.management.2004@gmail.com',
        to: userEmail,                
        subject: 'Authentication OTP code',
        text: `Your OTP code is: ${otp}. This code will expire after 5 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP has been sent successfully');
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
}

module.exports = {
    sendOTPEmail
}
