module.exports = function (app, MYSQL_CON)
{
    app.post('/InwardSheetData/Insert', (req, res) =>
    {
        var DATA = req.body;
        getPrimaryLastKey(MYSQL_CON).then((id) =>
        {
            var UNIQUE_ID = 'UNIQUE_' + (parseInt(id.replace('UNIQUE_')) + 1);
            var INSERT_QUERY_DEALER_DETAILS = `INSERT INTO dealer_details values('${ UNIQUE_ID }',
            '${ DATA['Depot_Name'] }','${ DATA['Dealer_Name'] }','${ DATA['Dealer_Code'] }',
            '${ DATA['Email_Id'] }','${ DATA['Contact_Number'] }','${ DATA['CityName'] }',
            '${ DATA['STATE'] }','${ DATA['PNCODE'] }','${ DATA['Address'] }','0',
            '${ new Date().toLocaleDateString()}';`; 
            MYSQL_CON.query(INSERT_QUERY_DEALER_DETAILS, [1], function(err, results) {
                if (err) throw err;
              if (results[0]['affectedRows']!=0) {
                   res.json({ Status: true, Message: 'Insert Successfully',Result:[results[0]]});
              } else{
                   res.json({ Status: true, Error:err,Result:[results[0]]});
              }
            });
        });
    });
}
function getPrimaryLastKey (con)
{
    return new Promise((resolve, reject) =>
    {
       var sql = "Select PRIMARY_KEY from dealer_details";
       con.query(sql, (e, r) =>
       {
         if (r!='' && r!=undefined) {
           resolve(r[r.length])
         } else
         {
          resolve([{id:'0'}])
         }
       });
    });
}