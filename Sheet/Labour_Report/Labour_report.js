module.exports =  (connection,req)=>
{
    return  new Promise( (resolve, reject) =>
    {
        if (req.body['Depot_Code'] != '' && req.body['Depot_Code'] != null
            && req.body['Start_Date'] != '' && req.body['End_Date'] != '')
        {
           
         //NON DSP DATA
         var q_1 = `SELECT SUM(unloading) as unloadingsum,
         SUM(transphipment) as transphipmentsum,entryDate as entryDate,depot_code as de
         from intable where entryDate between '${req.body['Start_Date']}' AND '${req.body['End_Date']}'
         and depot_code='${req.body['Depot_Code'] }' and deleteflag='0' and grade!='DSP' GROUP BY entryDate;`;
         
         //DSP DATA
         var q_2 = `SELECT SUM(unloading) as unloadingsum,
         SUM(transphipment) as transphipmentsum,entryDate as entryDate,depot_code as de
         from intable where entryDate between '${req.body['Start_Date']}' AND '${req.body['End_Date']}'
         and depot_code='${req.body['Depot_Code'] }' and deleteflag='0' and grade='DSP' GROUP BY entryDate;`;
            
         //LOading NON DSP DATA
         var q_3 = `SELECT SUM(unloading) as unloadingsum,SUM(diversion) as dversion,entryDate as entryDate,depot_code as de
         from outtable where entryDate between '${req.body['Start_Date']}' AND '${req.body['End_Date']}'
         and depot_code='${req.body['Depot_Code'] }' and deleteflag='0' and grade!='DSP' GROUP BY entryDate;`;
         
         //Loading DSP DATA
         var q_4 = `SELECT SUM(unloading) as unloadingsum,SUM(diversion) as dversion,entryDate as entryDate,depot_code as de
         from outtable where entryDate between '${req.body['Start_Date']}' AND '${req.body['End_Date']}'
         and depot_code='${req.body['Depot_Code'] }' and deleteflag='0' and grade='DSP' GROUP BY entryDate;`;  
            connection.query(q_1+''+q_2+''+q_3+''+q_4, [1,2,3,4], (e, r) =>
            {
                if (e){
                    resolve({ status: false, message: 'Somethings wrong...', error: e });
                }
                if (r[0].length != 0 && r[0]!=undefined) {
                    resolve({
                        Status: true, Data: {
                            NON_DSP: r[0],
                            DSP: r[1],
                            LOADING_NON_DSP: r[2],
                            LOADING_DSP:r[3]
                        }, Message: 'Data found...'
                    });   
                } else {
                    resolve({
                        Status: false, Data:[], Message: 'Data not found...'
                    });
                }
         });       
        }
    });    
}