module.exports = function (app,CONNECTION)
{
    app.get("/EmpList", (req, res) =>
    {
      CONNECTION.getConnection(function (err, connection)
      {
        connection.query(`SELECT * FROM employee_details`, (e, r) =>
        {
          if (e)
          {
            this.STATUS_CHECK = { "MESSAGE": 'Data Found...', "ERROR_MESSAGE": e, "STATUS": false };
            res.json(e);
            connection.release();
          }
          if (r.length)
          {
            this.STATUS_CHECK = { "MESSAGE": 'Data Found...', "ERROR_MESSAGE": '', "STATUS": true };
            res.json(r);
            connection.release();
          } else
          {
            this.STATUS_CHECK = { "MESSAGE": 'Data not Found...', "ERROR_MESSAGE": '', "STATUS": false };
            connection.release();
          }
        });
      });
  });
}