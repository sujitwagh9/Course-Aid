import nodemailer from "nodemailer"

const sendEmail= async (to,subject,text)=>{

    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from:`<${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    });

};

const sendWelcomeEmail = async (email, name) => {
    const subject = "Welcome to our platform";
    const text = `Welcome ${name} to our platform`;
    await sendEmail(email, subject, text);
};

const sendPasswordResetEmail = async (email, token) => {
    const subject = "Password Reset Request";
    const text = `Click the link below to reset your password: ${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await sendEmail(email, subject, text);
};

const sendEmailVerificationEmail = async (email, token) => {
    const subject = "Email Verification Request";
    const text = `Click the link below to verify your email: ${process.env.CLIENT_URL}/verify-email?token=${token}`;
    await sendEmail(email, subject, text);
};

const sendPaymentSuccessEmail = async (email, name, courseName) => {
    const subject = "Payment Successful";
    const text = `Congratulations ${name}! You have successfully paid for ${courseName}.`;
    await sendEmail(email, subject, text);
};

const sendPaymentFailureEmail = async (email, name, courseName) => {
    const subject = "Payment Failed";
    const text = `Sorry ${name}, your payment for ${courseName} has failed. Please try again.`;
    await sendEmail(email, subject, text);
};

const sendInstructorPaymentSuccessEmail = async (email, name, courseName) => {
    const subject = "Payment Successful";
    const text = `Congratulations ${name}! You have successfully received payment for ${courseName}.`;
    await sendEmail(email, subject, text);
};

const sendInstructorPaymentFailureEmail = async (email, name, courseName) => {
    const subject = "Payment Failed";
    const text = `Sorry ${name}, your payment for ${courseName} has failed. Please try again.`;
    await sendEmail(email, subject, text);
};

const sendInstructorPaymentPendingEmail = async (email, name, courseName) => {
    const subject = "Payment Pending";
    const text = `Dear ${name}, your payment for ${courseName} is pending. Please check your payment status.`;
    await sendEmail(email, subject, text);
};

const sendInstructorPaymentRefundEmail = async (email, name, courseName) => {
    const subject = "Payment Refunded";
    const text = `Dear ${name}, your payment for ${courseName} has been refunded. Please check your payment status.`;
    await sendEmail(email, subject, text);
};















    export { sendWelcomeEmail, sendPasswordResetEmail, sendEmailVerificationEmail, sendPaymentSuccessEmail, sendPaymentFailureEmail, sendInstructorPaymentSuccessEmail, sendInstructorPaymentFailureEmail, sendInstructorPaymentPendingEmail, sendInstructorPaymentRefundEmail };
