require('chromedriver');
const fs = require('fs-extra');
const webdriver = require('selenium-webdriver');
const addContext = require('mochawesome/addContext');
const IMAGE_DIR = "./mochawesome-report/images";

before(async () => {
  global.driver = new webdriver.Builder().forBrowser("chrome").build();

  await driver
    .manage()
    .window()
    .maximize();

  await fs.remove(IMAGE_DIR);

  await driver.manage().setTimeouts({ implicit: 30000 });
});

after(done => {
  driver.quit().then(done);
});

afterEach(async function () {
  if (this.currentTest.state === "failed") {
    const imageName = `${this.currentTest.title}.png`;

    await driver.executeScript("window.scrollTo(0, 500)");
    await fs.outputFile(`${IMAGE_DIR}/${imageName}`, await driver.takeScreenshot(), "base64");
    addContext(this, `images/${imageName}`);
  }
});
