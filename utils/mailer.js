// utils/mailer.js
const nodemailer = require("nodemailer");

async function sendEnquiryMail({ name, email, mobile, comment, enquiryId }) {
  try {
    const mailSender = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASS
      },
    });

    const mailOptions = {
      from: `"Product Enquiry" <${process.env.SENDER_EMAIL}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `New Enquiry Received - ID #${enquiryId}`,
      html: `
        <h2>New Enquiry</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Mobile:</b> ${mobile}</p>
        <p><b>Comment:</b> ${comment}</p>
        <p><b>Enquiry ID:</b> ${enquiryId}</p>
      `,
    };

    const info = await mailSender.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
  }
}

module.exports = sendEnquiryMail; // ✅ default export
