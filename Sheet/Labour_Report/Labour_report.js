module.exports =  (app,CONNECTION,req)=>
{
    return  new Promise( (resolve, reject) =>
    {
        if (req.body['Depot_Code'] != '' && req.body['Depot_Code'] != null
            && req.body['Start_Date'] != '' && req.body['End_Date'] != '')
        {
           
         //NON DSP DATA
         var q_1 = `SELECT SUM(unloading) as unloadingsum,
         SUM(transphipment) as transphipmentsum,entryDate as entryDate2,depot_code as de
         from intable where entryDate between '${req.body['Start_Date']}' AND '${req.body['End_Date']}'
         and depot_code='${req.body['Depot_Code']}' and deleteflag='0' and grade!='DSP' GROUP BY entryDate;`;
            CONNECTION.query(q_1, [1], (e, r) =>
            {
                resolve(r);
            });       
        }
    });    
}