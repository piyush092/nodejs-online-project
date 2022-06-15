module.exports = function (app,CONNECTION,STATUS_CHECK)
{
    app.get("/DepotList", (req, res) =>
{
    CONNECTION.query(`SELECT * FROM depot`, (e, r) => {
        if (e) {
            this.STATUS_CHECK = { "MESSAGE": 'Data Found...', "ERROR_MESSAGE": e, "STATUS": false };
            res.json(e);
          return;
        }
        if (r.length)
        {
            this.STATUS_CHECK = { "MESSAGE": 'Data Found...', "ERROR_MESSAGE": '', "STATUS": true };
          res.json(r);
          return;
        } else
        {
            this.STATUS_CHECK = { "MESSAGE": 'Data not Found...', "ERROR_MESSAGE": '', "STATUS": false };
        }
      });
});
}