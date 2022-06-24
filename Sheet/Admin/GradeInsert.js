module.exports = function (app, MYSQL_CON)
{
    app.post('/Admin/GradeInsert', (req,res) =>
    {
        Insert(MYSQL_CON, req.body,res);
    });
}

function  Insert (CONNECTION, DATA,res)
{
    if (DATA['GradeName'] != '' && DATA['GradeName'] != '')
    {
        var INSERT_QUERY_INWARD_SHEET = `INSERT INTO Grade_Con VALUES ('','${DATA['GradeName']}');`;
  
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
