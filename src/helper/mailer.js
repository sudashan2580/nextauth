import User from '@/models/userModel.js';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcrypt'
export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    if (emailType == "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set:
          { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }
      })
    }
    else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId,
        {
          $set:
            { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 }
        }
      )
    }
     console.log(User)



     const transport = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 587,
      auth: {
        user: "api",
        pass: "b02fe93a1da67d2b8a9a8ce866b383e5"
      }
    });
      
        const mailOptions =
        {
          from: 'sudarshan@gmail.com', // sender address
          to: email, // list of receivers
          subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
          html: `<p>Click <a href="${process.env.DOMAIN_NAME}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN_NAME}/verifyemail?token=${hashedToken}
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
