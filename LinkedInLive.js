const puppeteer = require("puppeteer");
const readline = require("readline");

class LinkedInLive {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  async promptUserForOTP() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question("Please enter the verification code: ", (otp) => {
        rl.close();
        resolve(otp);
      });
    });
  }

  async login() {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: {
        width: 1280,
        height: 800,
      },
    });
    const page = await browser.newPage();

    // Navigate to LinkedIn login page
    await page.goto(
      "https://www.linkedin.com/checkpoint/rm/sign-in-another-account"
    );

    // Fill out the login form and submit it
    await page.type("input#username", this.email, { delay: 100 });
    await page.type("#password", this.password, { delay: 100 });
    const loginButtonSelector = 'button[type="submit"]';
    await page.waitForSelector(loginButtonSelector);
    await page.click(loginButtonSelector);

    // Wait for navigation to complete (after login)
    await page.waitForNavigation();

    // Check for the "check your LinkedIn app" heading
    const appHeadingSelector = ".header__content__heading__inapp";
    const headingExists = (await page.$(appHeadingSelector)) !== null;

    if (headingExists) {
      console.log(
        "LinkedIn app verification detected. Proceeding with alternate method."
      );

      // Click the "I don't have my phone" link
      const tryAnotherWaySelector = "#try-another-way";
      await page.click(tryAnotherWaySelector);

      // Wait for navigation to the OTP input page
      await page.waitForNavigation();
    }

    // Check if the OTP input field is present
    const otpInputSelector = "input#input__phone_verification_pin";
    const otpInputExists = (await page.$(otpInputSelector)) !== null;

    if (otpInputExists) {
      // Ask the user for the OTP
      const otp = await this.promptUserForOTP();

      // Fill in the OTP and submit
      await page.type(otpInputSelector, otp, { delay: 100 });
      const submitOtpButtonSelector = 'button[type="submit"]';
      await page.click(submitOtpButtonSelector);

      // Wait for navigation to complete (after OTP submission)
      await page.waitForNavigation();
    } else {
      console.log("Logged in successfully without OTP prompt.");
    }

    this.page = page;
    this.browser = browser;
  }

  async logout() {
    await this.page.goto("https://www.linkedin.com/m/logout");
    await this.browser.close();
  }
}

// Create an instance of LinkedInLive and login
(async () => {
  let linkedInLiveInstance = new LinkedInLive(
    "malikhamaddd@gmail.com",
    "Understood1998"
  );
  try {
    await linkedInLiveInstance.login();
    console.log("Login successful");
    // await linkedInLiveInstance.logout();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();

module.exports = LinkedInLive;
