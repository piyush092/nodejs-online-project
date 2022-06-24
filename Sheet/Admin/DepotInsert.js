module.exports = function (app, MYSQL_CON)
{
    app.post('/Admin/DepotInsert', (req,res) =>
    {
        Insert(MYSQL_CON, req.body,res);
    });
}

function  Insert (CONNECTION, DATA,res)
{
    if (DATA['DEPOT_NAME'] != '' && DATA['DEPOT_CODE'] != '')
    {
        var INSERT_QUERY_INWARD_SHEET = `INSERT INTO depot (depot_Name,depot_code) VALUES ('${DATA['Depot_Name']}','${DATA['Depot_Code']}');`;
  
        CONNECTION.query(INSERT_QUERY_INWARD_SHEET, [1], function(err, results) {
            if (err) throw err;
          if (results['affectedRows']!=0) {
               res.json({ Status: true, Message: 'Insert Successfully',Result:[results]});
          } else{
               res.json({ Status: true, Error:err,Result:[results]});
          }
        });   
    } else
    {
        res.json({ Status: true, Error:'Please Check any Input Empty',Result:[]});   
    }
}
