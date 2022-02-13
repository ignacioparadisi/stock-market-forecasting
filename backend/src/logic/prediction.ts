import danfo, { tensorflow } from 'danfojs-node';
import  axios from 'axios';

export async function requestData(title: string) {
    let url = `https://sandbox.iexapis.com/stable/stock/${title}/chart/max?token=Tpk_7ef63a0d0ca94395a15d73c3fd314f0e`
    let response = await axios.get(url);
    if (response.status != 200) {
        return
    }
    let data = response.data
    console.info(response.status);
    console.log(response.data);

    for(let index = 0; index < data.length; index++) {
        let obj = data[index];
        let date = new Date(obj['date']);
        let price = parseFloat(obj['close']);
        if (date < new Date('2021-10-01')) {
          price /= 1000000;
        }
        if (date < new Date('2018-08-20')) {
          price /= 100000;
        }
        data[index].price = price;
    }
    let dataFrame = new danfo.DataFrame(data);
    dataFrame.print()
}