module.exports =  function (CONNECTION,req)
{
    return new Promise((resolve,reject) =>
    {
        if (req.body['Depot_Code'] != '' && req.body['Depot_Code'] != null && req.body['Start_Date'] != '')
            {
                 CONNECTION.query(`SELECT * from newstock where entryDate='${req.body['Start_Date']}'
                and depot_code='${req.body['Depot_Code']}' and deleteflag='0'`,[1],(e, r) =>
                {
                     resolve({
                         Status: true, Data: {
                             'NewStockSheet': r
                         }, Message: 'Data found...'
                     });
                });
            }
        });    
    
}