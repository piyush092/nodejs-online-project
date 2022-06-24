module.exports = function (app, MYSQL_CON)
{
    app.post('/Admin/EmplyoesInsert', (req,res) =>
    {
        Insert(MYSQL_CON, req.body,res);
    });
}

function  Insert (CONNECTION, DATA,res)
{
    if (DATA['DEPOT_NAME'] != '' && DATA['DEPOT_CODE'] != '')
    {
        var INSERT_QUERY_INWARD_SHEET = `INSERT INTO employee_details 
        VALUES ('${ DATA['Emp_Id'] }','${ DATA['Employees_Name'] }',
        '${ DATA['Email_Id'] }','${ DATA['Password'] }',
        '${ DATA['Confirm_Password'] }','${ DATA['Contact_Number'] }',
        '${ DATA['Depot_Code'] }','00:00:00','${ DATA['Role'] }');`;
  
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
