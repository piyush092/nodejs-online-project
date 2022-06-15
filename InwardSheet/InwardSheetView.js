module.exports = function (app,CONNECTINO)
{
    app.post("/InwardSheet/getData", (req, res) =>
    {
      console.log(req.body);
      
    CONNECTINO.query(`SELECT * FROM intable WHERE (entryDate between '${req.body['Start_Date']}' AND '${req.body['End_Date']}')
    and depot_code='${req.body['Depot_Code']}' and deleteflag='0'`, (e, r) => {
        if (e) {
          res.json({status:false,message:'Somethings wrong...',error:e});
      }
        if (r.length)
        {
          res.json({status:true,message:'Data found',data:r});
        } else
        {
          res.json({status:false,message:'Data not found',data:null});
        }
      });
});
}