module.exports =  (connection,req)=>
{
    return  new Promise( (resolve, reject) =>
    {
        if (req.body['Depot_Code'] != '' && req.body['Depot_Code'] != null
            && req.body['Start_Date'] != '' && req.body['End_Date'] != '')
        {
           
         //NON DSP DATA
         var q_1 = `select SUM(nr_loading) as nr_loading_bag,
         SUM(nr_transhipment) as nr_transhipment_bag,
         SUM(nr_unloading) as nr_unloading_bag,
         SUM(dsp_loading) as dsp_loading_bag,
         SUM(dsp_transhipment) as dsp_transhipment_bag,
         SUM(dsp_unloading) as dsp_unloading_bag,
         SUM(nr_loading_cost+nr_transhipment_cost+nr_unloading_cost+dsp_loading_cost+dsp_transhipment_cost+dsp_unloading_cost)
         as HANDLING_COST_SUM,
         SUM(nr_loading+nr_transhipment+nr_unloading) as TOTAL_NR_BAG,
         SUM(dsp_loading+dsp_transhipment+dsp_unloading) as TOTAL_DSP_BAG,
         entryDate,depot_code
         from newstock where entryDate between '${req.body['Start_Date'] }' AND 
         '${ req.body['End_Date'] }' and depot_code='${ req.body['Depot_Code'] }' 
         and deleteflag='0' group by entryDate,depot_code;`;
            
        var q_2 = `SELECT * from depot where depot_code='${ req.body['Depot_Code'] }';`;  
        connection.query(q_1+q_2, [1,2], (e, r) =>
         {
                if (e){
                    resolve({ status: false, message: 'Somethings wrong...', error: e });
                }
                if (r[0].length != 0 && r[0]!=undefined) {
                    resolve({
                        Status: true, Data: {
                            RESPONSE:r[0],
                            DEPOT_DATA:r[1]
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