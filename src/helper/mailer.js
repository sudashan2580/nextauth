import User from '@/models/userModel.js';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcrypt'
export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    console.log(hashedToken);
    if (emailType == "VERIFY") {
      const test=await User.findByIdAndUpdate(userId, {
        $set:
          { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }
      });
    }
    else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId,
        {
          $set:
            { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 }
        }
      )
    }



     const transport =nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'code63650@gmail.com',
    pass: process.env.NEXT_PUBLIC_MAIL_PASSWORD
  }
});
  //email send
      
        const mailOptions =
        {
          from: 'code63650@gmail.com', // sender address
          to: email, // list of receivers
          subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
          html: `<p>Click <a href="${process.env.NEXT_PUBLIC_DOMAIN_NAME}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.NEXT_PUBLIC_DOMAIN_NAME}/verifyemail?token=${hashedToken}
            </p>`
        }
        const mailresponse = await transport.sendMail(mailOptions);
        console.log(mailresponse);
        return mailresponse;
      }
catch (e) {
      throw new Error(e.message);

    }
  }
