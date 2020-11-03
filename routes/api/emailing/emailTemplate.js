// This file is exporting an Object with a single key/value pair.
// However, because this is not a part of the logic of the application
// it makes sense to abstract it to another file. Plus, it is now easily
// extensible if the application needs to send different email templates
// (eg. unsubscribe) in the future.

module.exports = {
  confirm: (id, CLIENT_ORIGIN) => ({
    subject: "Trial By Error Account Confirm Email",
    html: `
        <p>
          Welcome to the Trial By Error Guild Website. You must confirm your email within 10 minutes. <br>
          <a href='${CLIENT_ORIGIN}/confirm/${id}'>
            Please click here to verify your email
          </a>
          <br>
          If you can't see the link copy and paste this link: ${CLIENT_ORIGIN}/confirm/${id}
        </p>
      `,
    text: `Copy and paste this link: ${CLIENT_ORIGIN}/confirm/${id}`,
  }),
};
