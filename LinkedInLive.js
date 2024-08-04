const puppeteer = require("puppeteer");

class LinkedInLive {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  async login() {
    const browser = await puppeteer.launch({
      headless: false,
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

    this.page = page;
    this.browser = browser;
  }

  async logout() {
    await this.page.goto("https://www.linkedin.com/m/logout");
    await this.browser.close();
  }
}

(async () => {
  let linkedInLiveInstance = new LinkedInLive("email", "password");
  try {
    await linkedInLiveInstance.login();
    console.log("Login successful");
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();

module.exports = LinkedInLive;
