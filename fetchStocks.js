const https = require('https');
const fs = require('fs');
const url = 'https://www.bolsadecaracas.com/resumen-mercado/';

const request = https.get(url, response => {
    let data = '';
    console.log(`Status Code: ${response.statusCode}`);

    response.on('data', chunk => {
        data += chunk;
    });

    response.on('end', () => {
        dacodeData(data);
    })
});

request.on('error', error => {
    console.error(error);
});

request.end();

const value = `<tr class="text-center color-equal"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/ABC.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="ABC.A" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/ABC.png">ABC.A</a></td><td class="text-uppercase no-border-top">2</td><td class="text-center no-border-top">0</td><td class="no-border-top">11</td><td class="text-green no-border-top">22</td><td class="no-border-top">12:42:24</td></tr><tr class="text-center color-down"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/BNC.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="BNC" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/BNC.png">BNC</a></td><td class="text-uppercase no-border-top">.0165</td><td class="text-center no-border-top">-.0005</td><td class="no-border-top">32100</td><td class="text-green no-border-top">539.45</td><td class="no-border-top">12:00:23</td></tr><tr class="text-center color-equal"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/BOU.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="BOU" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/BOU.png">BOU</a></td><td class="text-uppercase no-border-top">.00045</td><td class="text-center no-border-top">0</td><td class="no-border-top">100000</td><td class="text-green no-border-top">45</td><td class="no-border-top">12:34:38</td></tr><tr class="text-center color-equal"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/BPV.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="BPV" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/BPV.png">BPV</a></td><td class="text-uppercase no-border-top">1.87</td><td class="text-center no-border-top">0</td><td class="no-border-top">1610</td><td class="text-green no-border-top">2992.7</td><td class="no-border-top">13:00:26</td></tr><tr class="text-center color-up"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/BVCC.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="BVCC" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/BVCC.png">BVCC</a></td><td class="text-uppercase no-border-top">.21</td><td class="text-center no-border-top">.01</td><td class="no-border-top">39210</td><td class="text-green no-border-top">9388.39</td><td class="no-border-top">13:00:26</td></tr><tr class="text-center color-equal"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/DOM.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="DOM" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/DOM.png">DOM</a></td><td class="text-uppercase no-border-top">2.12</td><td class="text-center no-border-top">0</td><td class="no-border-top">2</td><td class="text-green no-border-top">4.2</td><td class="no-border-top">12:37:08</td></tr><tr class="text-center color-up"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/EFE.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="EFE" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/EFE.png">EFE</a></td><td class="text-uppercase no-border-top">.177</td><td class="text-center no-border-top">.002</td><td class="no-border-top">630</td><td class="text-green no-border-top">101.31</td><td class="no-border-top">11:27:10</td></tr><tr class="text-center color-up"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/ENV.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="ENV" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/ENV.png">ENV</a></td><td class="text-uppercase no-border-top">.86</td><td class="text-center no-border-top">.01</td><td class="no-border-top">250</td><td class="text-green no-border-top">215.4</td><td class="no-border-top">12:52:34</td></tr><tr class="text-center color-equal"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/FVI.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="FVI.B" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/FVI.png">FVI.B</a></td><td class="text-uppercase no-border-top">3</td><td class="text-center no-border-top">0</td><td class="no-border-top">916</td><td class="text-green no-border-top">2631.06</td><td class="no-border-top">12:53:51</td></tr><tr class="text-center color-down"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/GZL.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="GZL" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/GZL.png">GZL</a></td><td class="text-uppercase no-border-top">2.81</td><td class="text-center no-border-top">-.69</td><td class="no-border-top">57</td><td class="text-green no-border-top">165.3</td><td class="no-border-top">12:51:47</td></tr><tr class="text-center color-down"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/IVC.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="IVC" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/IVC.png">IVC</a></td><td class="text-uppercase no-border-top">3.6</td><td class="text-center no-border-top">-.04</td><td class="no-border-top">5</td><td class="text-green no-border-top">18</td><td class="no-border-top">12:05:05</td></tr><tr class="text-center color-down"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/MVZ.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="MVZ.A" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/MVZ.png">MVZ.A</a></td><td class="text-uppercase no-border-top">5.59</td><td class="text-center no-border-top">-.41</td><td class="no-border-top">140</td><td class="text-green no-border-top">792.03</td><td class="no-border-top">13:00:26</td></tr><tr class="text-center color-down"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/MVZ.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="MVZ.B" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/MVZ.png">MVZ.B</a></td><td class="text-uppercase no-border-top">5.25</td><td class="text-center no-border-top">-.25</td><td class="no-border-top">266</td><td class="text-green no-border-top">1438.5</td><td class="no-border-top">12:47:10</td></tr><tr class="text-center color-down"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/PGR.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="PGR" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/PGR.png">PGR</a></td><td class="text-uppercase no-border-top">.13</td><td class="text-center no-border-top">-.01</td><td class="no-border-top">750</td><td class="text-green no-border-top">97.5</td><td class="no-border-top">12:32:59</td></tr><tr class="text-center color-down"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/PTN.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="PTN" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/PTN.png">PTN</a></td><td class="text-uppercase no-border-top">.45</td><td class="text-center no-border-top">-.02</td><td class="no-border-top">230</td><td class="text-green no-border-top">103.7</td><td class="no-border-top">12:43:55</td></tr><tr class="text-center color-equal"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/RST.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="RST" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/RST.png">RST</a></td><td class="text-uppercase no-border-top">1.9</td><td class="text-center no-border-top">0</td><td class="no-border-top">6183</td><td class="text-green no-border-top">13829.01</td><td class="no-border-top">13:00:26</td></tr><tr class="text-center color-up"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/RST.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="RST.B" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/RST.png">RST.B</a></td><td class="text-uppercase no-border-top">1.74</td><td class="text-center no-border-top">.09</td><td class="no-border-top">90</td><td class="text-green no-border-top">156.8</td><td class="no-border-top">13:00:26</td></tr><tr class="text-center color-down"><td class="icon-tabs no-border-top text-center"><div class="pt-2 text-center"><img src="https://www.bolsadecaracas.com/ticker_assets//img/logos/TDV.png" width="33px" height="33px" class="img-fluid"></div></td><td class="text-uppercase no-border-top" style="text-align: left;"><a  href="javascript:void(0)" id="TDV.D" class="https://www.bolsadecaracas.com/ticker_assets//img/logos/TDV.png">TDV.D</a></td><td class="text-uppercase no-border-top">.575</td><td class="text-center no-border-top">-.008</td><td class="no-border-top">300</td><td class="text-green no-border-top">173.75</td><td class="no-border-top">12:51:50</td></tr>`


function dacodeData(string) {
    let newString = string.replace(/\t/g, '');
    let lines = newString.split('\n');
    let filteredLines = lines.filter(line => {
        return line.includes(`$('#tbody-resumenmercado-todossimbolos').append('`)
    });
    if (filteredLines.length == 0) {
        return;
    }
    let htmlString = filteredLines[0];
    htmlString = htmlString.replace(`$('#tbody-resumenmercado-todossimbolos').append('`, '');
    htmlString = htmlString.slice(0, htmlString.length - 3);
    let stocks = getStocks(htmlString);
    console.log(stocks);
    whiteCSV(stocks);
}

function getStocks(string) {
    let stocks = [];
    let rows = string.split('<tr');
    for (let row of rows) {
        let nameMatch = row.match(/id="[a-zA-Z]+(?:\.[a-zA-Z]+)*"/);
        if (nameMatch) {
            let symbol = nameMatch[0].slice(4, nameMatch[0].length - 1);
            let columns = row.split('<td');
            let valueMatch = columns[3].match(/\.?\d+(?:\.\d+)*/);
            if (valueMatch) {
                let value = parseFloat(valueMatch[0]);
                stocks.push({
                    symbol,
                    value
                })
            }
        }
    }
    return stocks;
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function whiteCSV(stocks) {
    let newLine = '\r\n';
    let date = new Date()
    let dateString = `${date.getFullYear()}-${padTo2Digits(date.getMonth() + 1)}-${padTo2Digits(date.getDate())}`
    for (let stock of stocks) {
        const fileName = `Historico/${stock.symbol}.csv`

        fs.stat(fileName, (err, stat) => {
            if (err == null) {
                console.log(`File ${fileName} exists`);
                fs.readFile(fileName, 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    let splitData = data.split('\r\n');
                    let lastRegister = splitData[splitData.length - 1].split(',');
                    let lastDate = lastRegister[0];
                    if (dateString == lastDate) {
                        console.log(`Value already exists for date ${dateString}`);
                        return;
                    }
                    //write the actual data and end with newline
                    var csv = newLine + `${dateString},${stock.value}`;
                    fs.appendFile(fileName, csv, function (err) {
                        if (err) throw err;
                        console.log(`The data was appended to ${fileName}`);
                    });

                });
            } else {
                //write the headers and newline
                console.log(`Creating new fiel ${fileName}`);
                let csv = 'date,close' + newLine + `${dateString},${stock.value}`
                fs.writeFile(fileName, csv, function (err) {
                    if (err) throw err;
                    console.log('file saved');
                });
            }
        })
    }
}

