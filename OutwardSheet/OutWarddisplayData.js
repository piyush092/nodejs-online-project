module.exports = function (app,CONNECTION)
{
  app.post("/OutwardSheet/getData", (req, res) =>
  {
    CONNECTION.getConnection(function (err, connection)
    {
      connection.query(`SELECT * FROM outtable WHERE (entryDate between '${ req.body['Start_Date'] }' AND '${ req.body['End_Date'] }')
    and depot_code='${ req.body['Depot_Code'] }' and deleteflag='0'`, (e, r) =>
      {
        if (e)
        {
          res.json({ status: false, message: 'Somethings wrong...', error: e });
          connection.release();
        }
        if (r.length)
        {
          res.json({ status: true, message: 'Data found', data: r });
          connection.release();
        } else
        {
          res.json({ status: false, message: 'Data not found', data: null });
          connection.release();
        }
      });
    });
  });
}