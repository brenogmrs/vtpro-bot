require('dotenv').config();
const puppeteer = require('puppeteer');
const input = require('readline-sync');

async function fn () {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(process.env.VT_PRO_MAIN_URL);

    // faz login
    await page.type('#txtUsuario', process.env.VT_PRO_LOGIN);
    await page.type('#txtSenha', process.env.VT_PRO_PASSWORD);
    await page.click('#bntAcessar');
    await page.waitForTimeout(2000);

    // vai para o lançamento de horas
    await page.goto(process.env.VT_PRO_TIMESHEET_URL);
    await page.waitForTimeout(2000);

    let oiToRegister = input.question('OI: ');
    oiToRegister = oiToRegister.toUpperCase().trim();

    // seleciona OI
    await page.click('#ctl00_cphPrincipal_ddlAlocacaoRecurso');

    await page.evaluate((oiToRegister) => {

        const oiSelector = document.querySelector('#ctl00_cphPrincipal_ddlAlocacaoRecurso');
        const oiSelectorOptions = oiSelector.querySelectorAll('option');
        setTimeout('__doPostBack(\'ctl00$cphPrincipal$ddlAlocacaoRecurso\',\'\')', 0)

        const selectedOi = [...oiSelectorOptions].find(option => option.text.slice(0, 7) === oiToRegister);
        const dayDescription = selectedOi.text.split('-')
        document.querySelector('#ctl00_cphPrincipal_txtObs').value = dayDescription[1];

        document.querySelector('#ctl00_cphPrincipal_txtHoraInicio1').value = "08:00";
        document.querySelector('#ctl00_cphPrincipal_txtHoraFim1').value = "13:00";
        document.querySelector('#ctl00_cphPrincipal_txtHoraInicio2').value = "14:00";
        document.querySelector('#ctl00_cphPrincipal_txtHoraFim2').value = "17:00";

        selectedOi.selected = true;

    }, oiToRegister);

    await page.waitForTimeout(2000);

    await page.click('#ctl00_cphPrincipal_ddlDia');

    await page.evaluate(() => {
        const date = new Date();
        const day = date.getDate()

        const daySelector = document.querySelector('#ctl00_cphPrincipal_ddlDia');
        const daySelectorOptions = daySelector.querySelectorAll('option');
        const selectedDay = [...daySelectorOptions].find(option => option.text == day);

        selectedDay.selected = true;

    });

    await page.click('#ctl00_cphPrincipal_btnSalvar');

    await browser.close();
}

fn();