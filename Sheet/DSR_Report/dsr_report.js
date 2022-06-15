module.exports =  (app,CONNECTION,req)=>
{

    return  new Promise( (resolve, reject) =>
    {
        if (req.body['Select_Month'] != '' &&  req.body['Select_Year']!='')
        {
            var DEPOT_LIST = req.body['Depot_Code_List'];
            var DATA_STORE = {};
            var MAX_LENGTH = DEPOT_LIST.length;
            var DEPOT_NAME = req.body['Depot_Name_List'];
            var DATE_LIST_ALL = dateListCreate(req.body['date_List']);
            for (let index = 0; index < MAX_LENGTH; index++) {
                var Q = `SELECT DISTINCT newstock.depot_code as DEPOT_CODE,SUM(invoiceQty) as SUM,
                invoiceDate as DATE,d.depot_name as DEPOT_NAME FROM newstock INNER JOIN depot as d
                WHERE month='${ req.body['Select_Month'] }' AND year='${ req.body['Select_Year'] }' AND
                 record='sales' AND
                newstock.depot_code=d.depot_code and deleteflag='0' and particulars!='100001'
                and particulars!='Damaged' and newstock.depot_code='${ DEPOT_LIST[index] }' 
                and d.depot_code='${ DEPOT_LIST[index] }' GROUP by invoiceDate,newstock.depot_code,
                d.depot_name`;
                var DATE_CREATE_LIST_STORE ={};
                 CONNECTION.query(Q, [1],  (e, r) =>
                { 
                    var dump = [];
                    DATE_CREATE_LIST_STORE = {};
                    var TOTAL_SUM = 0;
                    for (let j = 0; j < r.length; j++)
                    {
                        var DATE_SPLIT = r[j]['DATE'].split('-');
                        dump.push(r[j]['DATE']);
                        DATE_CREATE_LIST_STORE['KEY_'+DATE_SPLIT[2]] = {
                            DATE: r[j]['DATE'],
                            DEPOT_CODE: r[j]['DEPOT_CODE'],
                            DEPOT_NAME: r[j]['DEPOT_NAME'],
                            SUM:r[j]['SUM']
                        };
                        TOTAL_SUM += r[j]['SUM'];
                    }
                    var result_2 = DATE_LIST_ALL.filter(x => !dump.includes(x));
                    for (let result_index = 0; result_index < result_2.length; result_index++)
                    {
                        var DATE_SPLIT_2 = result_2[result_index].split('-');
                        DATE_CREATE_LIST_STORE['KEY_'+DATE_SPLIT_2[2]] ={
                            DATE: result_2[result_index],
                            DEPOT_CODE:DEPOT_LIST[index],
                            DEPOT_NAME: DEPOT_NAME[DEPOT_LIST[index]],
                            SUM:0
                        };
                    }
                    DATA_STORE[DEPOT_NAME[DEPOT_LIST[index]]] = {
                        Data: DATE_CREATE_LIST_STORE,
                        SUM: TOTAL_SUM
                    };  
                    setTimeout(() =>{
                        if ((index + 1) == MAX_LENGTH)
                        {
                            resolve(DATA_STORE);
                        }
                    }, 1000);
                });   
            }           
        }
    });  
    
    function dateListCreate (dateList)
    {
        var DateBundel = [];
        for (let index = 0; index < dateList['LastDay']; index++)
        {
            DateBundel.push(`${ dateList['Year'] }-${ dateList['Month']>9?dateList['Month']:'0'+dateList['Month'] }-${ (index + 1)>9?(index + 1):'0'+(index + 1) }`);  
        }
        return DateBundel;
    }
}