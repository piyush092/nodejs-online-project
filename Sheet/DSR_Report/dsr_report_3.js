module.exports =  (app, CONNECTION, req) =>
{

    return new Promise( (resolve, reject) =>
    {
        if (req.body['Select_Month'] != '' && req.body['Select_Year'] != '')
        {
            var STATE = ['Karnataka','Hyderabad'];
            var CITY = ['Bangalore', ''];
            var STORE_DATA = {};
            var LAST_DAY = req.body['Last_day'];
            for (let index = 0; index < STATE.length; index++) {
                var Q_1 = `SELECT SUM(invoiceQty) as ${CITY[index]!=''?CITY[index]:'Hyderabad'}_sum FROM newstock INNER 
                JOIN depot as d WHERE month='${req.body['Select_Month']}' AND
                year='${req.body['Select_Year']}' AND newstock.depot_code=d.depot_code
                AND d.CITY='${CITY[index]}' and d.STATE='${STATE[index]}' AND record='sales'
                AND d.TYPE='depot' AND deleteflag=0;`;
            
                var Q_2 = `SELECT SUM(invoiceQty) as ${CITY[index]!=''?CITY[index]:'Hyderabad'}_sum FROM newstock INNER 
                JOIN depot as d WHERE month='${req.body['Select_Month']}' AND
                year='${req.body['Select_Year']}' AND newstock.depot_code=d.depot_code
                AND d.CITY!='${CITY[index]}' and d.STATE='${STATE[index]}' AND record='sales'
                AND d.TYPE='depot' AND deleteflag=0;`;
            
                var Q_3 = `SELECT SUM(invoiceQty) as ${CITY[index]!=''?CITY[index]:'Hyderabad'}_sum FROM newstock INNER 
                JOIN depot as d WHERE month='${req.body['Select_Month']}' AND
                year='${req.body['Select_Year']}' AND newstock.depot_code=d.depot_code
                AND d.CITY!='${CITY[index]}' and d.STATE='${STATE[index]}' AND record='sales'
                AND d.TYPE='BP' AND deleteflag=0;`;

                 CONNECTION.query(Q_1+Q_2+Q_3, [1,2,3],  (e, r) =>
                {
                    var DATA_1 = r[0][0][CITY[index] != '' ? CITY[index]+'_sum' : 'Hyderabad_sum'];
                    var DATA_2 = r[1][0][CITY[index] != '' ? CITY[index]+'_sum' : 'Hyderabad_sum'];
                    var DATA_3 = r[2][0][CITY[index] != '' ? CITY[index] + '_sum' : 'Hyderabad_sum'];
                    var S = (parseFloat((DATA_1 != null ? DATA_1 : 0)) / parseFloat(LAST_DAY)) +
                            (parseFloat((DATA_2 != null ? DATA_2 : 0)) / parseFloat(LAST_DAY)) +
                            (parseFloat((DATA_3 != null ? DATA_3 : 0)) / parseFloat(LAST_DAY));
                    STORE_DATA[STATE[index]] = {
                        Result_1: parseFloat(DATA_1!=null?DATA_1:0).toFixed(2),
                        Result_2: parseFloat(DATA_2!=null?DATA_2:0).toFixed(2),
                        Result_3: parseFloat(DATA_3 != null ? DATA_3 : 0).toFixed(2),
                        SUM: parseFloat((DATA_1 != null ? DATA_1 : 0) + (DATA_2 != null ? DATA_2 : 0) + (DATA_3 != null ? DATA_3 : 0)).toFixed(2),
                        AVERAGE_Result_1: (parseFloat((DATA_1!=null?DATA_1:0))/parseFloat(LAST_DAY)).toFixed(2),
                        AVERAGE_Result_2: (parseFloat((DATA_2!=null?DATA_2:0))/parseFloat(LAST_DAY)).toFixed(2),
                        AVERAGE_Result_3: (parseFloat((DATA_3!=null?DATA_3:0))/parseFloat(LAST_DAY)).toFixed(2),
                        AVERAGE_SUM: S.toFixed(2)
                    }
                    if ((index+1)==STATE.length) {
                        setTimeout(() =>
                        {
                            resolve(STORE_DATA);
                        }, 1000);
                    }
                });
            }
        }
    });   
}