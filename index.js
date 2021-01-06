require('dotenv').config();
const puppeteer = require('puppeteer');
const input = require('readline-sync');

async function fn () {
    const browser = await puppeteer.launch({ headless:false });
    const page = await browser.newPage();
    
    await page.goto(process.env.VT_PRO_MAIN_URL);

    // faz login
    await page.type('#txtUsuario', process.env.VT_PRO_LOGIN);
    await page.type('#txtSenha', process.env.VT_PRO_PASSWORD);
    await page.click('#bntAcessar');

    // vai para o lançamento de horas
    await page.goto(process.env.VT_PRO_TIMESHEET_URL);

    const oiToRegister = input.question('OI: ');

    // seleciona OI
    await page.click('#ctl00_cphPrincipal_ddlAlocacaoRecurso');

    await page.evaluate((oiToRegister) => {

        const example = document.querySelector('#ctl00_cphPrincipal_ddlAlocacaoRecurso');
        const example_options = example.querySelectorAll('option');
        const selected_option = [...example_options].find(option => option.text.slice(0, 7) === oiToRegister);
      
        selected_option.selected = true;
    }, oiToRegister);

    
    //await browser.close();
}




fn();