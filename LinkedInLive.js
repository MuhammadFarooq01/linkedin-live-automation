const puppeteer = require("puppeteer");

class LinkedInLive {
  constructor(email, password) {
    this.email = email;
    this.password = password;
    this.browser = null;
    this.page = null;
  }

  async login() {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: {
        width: 1280,
        height: 800,
      },
    });
    this.page = await this.browser.newPage();

    await this.page.goto(
      "https://www.linkedin.com/checkpoint/rm/sign-in-another-account"
    );

    await this.page.type("input#username", this.email, { delay: 100 });
    await this.page.type("#password", this.password, { delay: 100 });
    const loginButtonSelector = 'button[type="submit"]';
    await this.page.waitForSelector(loginButtonSelector);
    await this.page.click(loginButtonSelector);

    await this.page.waitForNavigation({ timeout: 60000 });

    console.log("Logged in successfully");
  }

  async logout() {
    await this.page.goto("https://www.linkedin.com/m/logout");
    await this.browser.close();
  }

  async createChannel(channelDetails) {
    if (!this.page || !this.browser) {
      throw new Error("Not logged in.");
    }

    // Navigate to the URL for creating a new channel
    await this.page.goto("https://www.linkedin.com/company/setup/new/");

    // Click the button to start the channel creation process
    const startButtonSelector = ".org-page-create-portal__organization-btn";
    await this.page.waitForSelector(startButtonSelector);
    await this.page.click(startButtonSelector);

    // Fill out the form fields with the provided details
    await this.page.type(
      "input#single-line-text-form-component-urn-li-fsu-pageCreationFormItem-NAME",
      channelDetails.name,
      { delay: 100 }
    );
    await this.page.type(
      "input#single-line-text-form-component-urn-li-fsu-pageCreationFormItem-UNIVERSAL-NAME",
      channelDetails.uniqueAddress,
      { delay: 100 }
    );
    await this.page.type(
      "input#single-line-text-form-component-urn-li-fsu-pageCreationFormItem-WEBSITE",
      channelDetails.website,
      { delay: 100 }
    );
    await this.page.type(
      "input#single-typeahead-entity-form-component-urn-li-fsu-pageCreationFormItem-INDUSTRY",
      channelDetails.industry,
      { delay: 100 }
    );
    await this.page.select(
      "select#text-entity-list-form-component-urn-li-fsu-pageCreationFormItem-ORGANIZATION-SIZE",
      channelDetails.organizationSize
    );
    await this.page.select(
      "select#text-entity-list-form-component-urn-li-fsu-pageCreationFormItem-ORGANIZATION-TYPE",
      channelDetails.organizationType
    );
    await this.page.type(
      "textarea#multiline-text-form-component-urn-li-fsu-pageCreationFormItem-TAGLINE",
      channelDetails.tagline,
      { delay: 100 }
    );

    // Check the 'verify I am owner' checkbox
    await this.page.click(
      "input#checkbox-form-component-urn-li-fsu-pageCreationFormItem-TERMS-AND-CONDITIONS"
    );

    // Submit the form
    const submitButtonSelector = "button#ember431";
    await this.page.waitForSelector(submitButtonSelector);
    await this.page.click(submitButtonSelector);

    // Wait for navigation or confirmation
    await this.page.waitForNavigation({ timeout: 60000 });

    console.log(`Channel "${channelDetails.name}" created successfully`);
  }
}

module.exports = LinkedInLive;
