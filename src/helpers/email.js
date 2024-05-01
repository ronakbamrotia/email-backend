const sendEmail = async function ({ email = [], bcc = [], subject = '', body = '' }) {
    // Email sending library like nodemailer can be used here
    console.log("====================");
    console.log(`Email sent to ${email} with blank carbon copy to ${bcc} with subject ${subject}`);
    console.log("====================");
}

module.exports = sendEmail;