import { Builder, By, Key, until } from 'selenium-webdriver'
import * as fs from 'fs'
import * as util from 'util'

const TARGET_URL: string           = 'https://moneyforward.com/'
const TARGET_BROWSER: string       = 'chrome'
const SELENIUM_SERVER_HOST: string = 'selenium-server'

const saveScreenshot = async (path: string, imageBase64: string) => {
    const imageBinary = Buffer.from(imageBase64, 'base64')
    fs.writeFile(path, imageBinary, err => {
        if(err) {
            console.error(err)
        }
    })
}

const loadConfigJson = async (configJsonPath: string) => {
    const jsonStr = await util.promisify(fs.readFile)(configJsonPath, {encoding: 'utf8'})
    return JSON.parse(jsonStr)
}


(async () => {
    let driver =  await new Builder().forBrowser(TARGET_BROWSER)
        .usingServer('http://' + SELENIUM_SERVER_HOST + ':4444/wd/hub')
        .build()

    // config読み込み
    const config = await loadConfigJson('./config.json')

    // TOP画面
    await driver.get(TARGET_URL)
    const topSs = await driver.takeScreenshot()
    await saveScreenshot('./images/01_top.png', topSs)
    await driver.findElement(By.linkText('ログイン')).click()

    // ログイン画面
    const loginText = 'メールアドレスでログイン'
    await driver.wait(
        until.elementLocated(By.linkText(loginText))
    )
    const loginSs = await driver.takeScreenshot()
    await saveScreenshot('./images/02_login.png', loginSs)
    await driver.findElement(By.linkText(loginText)).click()

    // ログイン画面(メールアドレス)
    const submitButtonClassName = 'submitBtn'
    await driver.wait(
        until.elementsLocated(By.className(submitButtonClassName))
    )
    await driver.findElement(By.name('mfid_user[email]')).sendKeys(config.mfMailaddress)
    const loginMailaddressSs = await driver.takeScreenshot()
    await saveScreenshot('./images/03_loginMailaddress.png', loginMailaddressSs)
    await driver.findElement(By.className(submitButtonClassName)).click()

    // ログイン画面(パスワード)
    await driver.wait(
        until.elementsLocated(By.className(submitButtonClassName))
    )
    await driver.findElement(By.name('mfid_user[password]')).sendKeys(config.mfPassword)
    const loginPasswordSs = await driver.takeScreenshot()
    await saveScreenshot('./images/04_loginPassword.png', loginPasswordSs)
    await driver.findElement(By.className(submitButtonClassName)).click()

    // ログイン後TOP画面
    const mfIconAccountClassName = 'mf-icon-account'
    await driver.wait(
        until.elementsLocated(By.className(mfIconAccountClassName))
    )
    const membersTopSs = await driver.takeScreenshot()
    await saveScreenshot('./images/05_membersTop.png', membersTopSs)
    await driver.findElement(By.className(mfIconAccountClassName)).click()

    // 口座画面
    const accountsText = '一括更新'
    const updateButtonXpath = '//table[@id="account-table"]//input[@type="submit" and @name="commit"  and @value="更新"]'
    await driver.wait(
        until.elementsLocated(By.linkText(accountsText))
    )
    const updateButtonElements = await driver.findElements(By.xpath(updateButtonXpath))
    for(let i = 0; i < updateButtonElements.length; i++) {
        await updateButtonElements[i].click()
        await driver.sleep(1000)
    }
    const accountsSs = await driver.takeScreenshot()
    await saveScreenshot('./images/06_accounts.png', accountsSs)

    await driver.quit()
})();
