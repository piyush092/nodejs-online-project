module.exports =  function (app,CONNECTION)
{
     app.post("/NewStockSheet/getData",  (req, res) =>
    {
        if (req.body['Depot_Code'] != '' && req.body['Depot_Code'] != null && req.body['Start_Date'] != '')
        {
             CONNECTION.query(`SELECT * from newstock where entryDate='${req.body['Start_Date']}'
            and depot_code='${req.body['Depot_Code']}' and deleteflag='0'`,[1],(e, r) =>
            {
                setTimeout(() =>
                {
                    res.json({
                        Status: true, Data: {
                            'NewStockSheet': r
                        }, Message: 'Data found...'});
                }, 2000);
            });
        }
    });
}