module.exports = function (app, MYSQL_CON)
{
    app.post('/OutwardSheetData/Delete', (req,res) =>
    {
        DeleteOutwardSheet(MYSQL_CON, req.body,res);
    });
}

function DeleteOutwardSheet (CONNECTION, DATA,res)
{   
    var UPDATE_QUERY_INWARD_SHEET=`UPDATE outtable SET deleteflag='1' where Unique_Id='${DATA['id']}';`;
    var UPDATE_QUERY_NEWSTOCK_SHEET = `UPDATE newstock SET deleteflag='1' where Unique_Id='${DATA['id']}';`;

    CONNECTION.query(UPDATE_QUERY_INWARD_SHEET+''+UPDATE_QUERY_NEWSTOCK_SHEET, [1, 2], function(err, results) {
        if (err) throw err;
      if (results[0]['affectedRows']!=0 && results[1]['affectedRows']!=0) {
           res.json({ Status: true, Message: 'Delete Successfully',Result:[results[0],results[1]]});
      } else{
           res.json({ Status: true, Error:err,Result:[results[0],results[1]]});
      }
    });
}
