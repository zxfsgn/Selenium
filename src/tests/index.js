const { expect } = require('chai');
const { By, Key } = require('selenium-webdriver');
const fs = require('fs-extra');
const addContext = require('mochawesome/addContext');
const IMAGE_DIR = "./mochawesome-report/images";

let resultScreenshot = async function (number, id) {
  const imageName = `result${number}.png`;

  await driver.executeScript("window.scrollTo(0, 500)");
  await fs.outputFile(`${IMAGE_DIR}/${imageName}`, await driver.findElement(By.id(id)).takeScreenshot(), "base64");
  addContext(this, `images/${imageName}`);
}

describe('Autodispatcher site', async () => {
  describe('Site title', () => {
    it('should be equal to www.avtodispetcher.ru/distance', async () => {

      driver.get("https://www.yandex.ru");
      await driver.findElement(By.id('text')).sendKeys('расчет расстояний между городами', Key.ENTER);
      await driver.findElement(By.css('[href="https://www.avtodispetcher.ru/distance/"]')).click();
      const windows = await driver.getAllWindowHandles()
      await driver.switchTo().window(windows[1])

      const title = await driver.getCurrentUrl();

      expect(title).to.equal('https://www.avtodispetcher.ru/distance/');
    });
  });
  describe('First request', () => {
    it('Distance should be equal to 897', async function () {
      await driver.findElement(By.css('#from_field_parent > input')).sendKeys('Тула');
      await driver.findElement(By.css('#to_field_parent > input')).sendKeys('Санкт-Петербург');
      await driver.findElement(By.css('#CalculatorForm > div.fuel > div:nth-child(1) > label > input[type=number]')).sendKeys(Key.DELETE, '9');
      await driver.findElement(By.css('#CalculatorForm > div.fuel > div:nth-child(2) > label > input[type=number]')).sendKeys(Key.DELETE, Key.DELETE, '46', Key.ENTER);
      await resultScreenshot.call(this, '1', "summaryContainer");

      let distance = await driver.findElement(By.id('totalDistance')).getText();

      expect(distance).to.equal('897');
    });
    it('Price should be equal to 3726', async function () {
      let text = await driver.findElement(By.css('#summaryContainer > form > p')).getText();
      await resultScreenshot.call(this, '1map', "mapWrapper");

      let regexp = /\d+(?=.руб)/;
      let price = regexp.exec(text);

      expect(price[0]).to.equal('3726');
    });
  });
  describe('Second request', () => {
    it('Distance should be equal to 966', async function () {
      await driver.sleep(30000)
      await driver.findElement(By.css('#triggerFormD')).click();
      await driver.findElement(By.css('#inter_points_field_parent > input')).sendKeys('Великий Новгород');
      await driver.findElement(By.css('#CalculatorForm > div.submit_button > input[type=submit]')).sendKeys(Key.ENTER);
      await resultScreenshot.call(this, '2', "summaryContainer");

      let distance = await driver.findElement(By.id('totalDistance')).getText();

      expect(distance).to.equal('966');
    });
    it('Price should be equal to 4002', async function () {
      let text = await driver.findElement(By.css('#summaryContainer > form > p')).getText();
      await resultScreenshot.call(this, '2map', "mapWrapper");

      let regexp = /\d+(?=.руб)/;
      let price = regexp.exec(text);

      expect(price[0]).to.equal('4002');
    });
  });
});
