module.exports = function (app,CONNECTION,STATUS_CHECK)
{
    app.get("/Dealer_Details", (req, res) =>
{
    CONNECTION.query(`SELECT  DEALER_NAME as de_name,DALER_CODE as de_code from dealer_details ORDER BY DEALER_NAME ASC`, (e, r) => {
        if (e) {
            STATUS_CHECK = { "MESSAGE": 'Data Found...', "ERROR_MESSAGE": e, "STATUS": false };
            res.json({ Data: r, STATUS: STATUS_CHECK });
            return;
        }
        if (r.length)
        {
            STATUS_CHECK = { "MESSAGE": 'Data Found...', "ERROR_MESSAGE": '', "STATUS": true };
            res.json({Data:r,STATUS:STATUS_CHECK});
          return;
        } else
        {
            STATUS_CHECK = { "MESSAGE": 'Data not Found...', "ERROR_MESSAGE": '', "STATUS": false };
            res.json({Data:r,STATUS:STATUS_CHECK});
        }
      });
});
}