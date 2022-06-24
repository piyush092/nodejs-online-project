module.exports = function (app, MYSQL_CON)
{
    app.post('/Admin/EmplyoesInsert', (req,res) =>
    {
        Insert(MYSQL_CON, req.body, res).then((r) =>{
            res.json(r);
        });
    });
}

function  Insert (CONNECTION, DATA,res)
{
    return new Promise(async (resolve,reject) =>
    {
        if (DATA['DEPOT_NAME'] != '' && DATA['DEPOT_CODE'] != '')
    {
        var INSERT_QUERY_INWARD_SHEET = `INSERT INTO employee_details 
        VALUES ('${ DATA['Emp_Id'] }','${ DATA['Employees_Name'] }',
        '${ DATA['Email_Id'] }','${ DATA['Password'] }',
        '${ DATA['Contact_Number'] }',
        '${ DATA['Depot_Code'] }','00:00:00','${ DATA['Role'] }');`;
  
       await CONNECTION.query(INSERT_QUERY_INWARD_SHEET, [1], function(err, results) {
            if (err){
                resolve({ Status: true, Error:err,Result:[results]});
            }
          if (results['affectedRows']!=0) {
               resolve({ Status: true, Message: 'Insert Successfully',Result:[results]});
          } else{
               resolve({ Status: true, Error:err,Result:[results]});
          }
        });   
    } else
    {
        resolve({ Status: true, Error:'Please Check any Input Empty',Result:[]});   
    }
    });
}
