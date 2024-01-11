import nodemailer from "nodemailer";

const sendEmail = async ({dest, subject, message}={}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.nodeMailerEmail,
      pass: process.env.nodeMailerPassword,
    },
  });
  const info = await transporter.sendMail({
    from: `"Ahmed 👻" ${process.env.nodeMailerEmail}`,
    to: dest,
    subject,
    html: message,
  });
  return info
};
export default sendEmail;
