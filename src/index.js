const puppeteer = require('puppeteer');

const url = 'https://opcoes.net.br/opcoes/bovespa';

async function getAtivos(){
    const browser = await puppeteer.launch({
        headless:true,
        defaultViewport:null
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('select[name="IdAcao"]');
    let acoestodas = await page.$$eval('select[name="IdAcao"]',elem =>elem[0].innerText);
    //console.log(acoestodas);
    const arracoes = await acoestodas.split('\n');
    let ativos = []

    arracoes.map(e=>{
        ativos.push(url+'/'+e);
    });

    await browser.close();
    return ativos
    
}

//getAtivos();

async function acessapg(){
    const browser = puppeteer.launch({
        headless:false,
        defaultViewport:null,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        slowMo:350
    });
    const page = await (await browser).newPage();
    let siteativos = await getAtivos();
    for(let i =0;i< siteativos.length;i++){
        const url = siteativos[i];
        await page.goto(url);
        await page.waitForSelector('.buttons-excel');
        
        //em ambiente Windows é necassario passar o caminho do path completo
        await page._client.send('Page.setDownloadBehavior',{behavior:'allow',downloadPath:'C:\\Users\\cosme\\Desktop\\projetos\\Scraping_opcoes_Bovespa\\src\\download'});
        await page.click('.buttons-excel',{clickCount:1,delay:100});

        await console.log(`Feito = ${url}`);
    };
    await  browser.close();
};

acessapg();