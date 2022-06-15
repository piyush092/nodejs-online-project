module.exports = function (app,CONNECTINO,req)
{
    if (req.body['Depot_Name'] != '' && req.body['Depot_Name'] != null && req.body['Start_Date'] != '' && req.body['End_Date'] != '')
    {
        console.log(req.body)
        return new Promise((resolve, reject) =>
        {
            //Inward correction Query
            var QUERY_1 = `SELECT COUNT(comments) as com,de.depot_name as name FROM intable  
            INNER JOIN depot as de  WHERE entryDate>'2020-06-07' AND entryDate between '${req.body['Start_Date']}' 
            AND '${req.body['End_Date']}' and de.depot_name='${req.body['Depot_Name']}'  AND de.depot_code=intable.depot_code AND comments!='NA' GROUP by de.depot_name;`;
        
            //Inward Not correction Query
            var QUERY_2 = `SELECT COUNT(comments) as com,de.depot_name as name FROM intable  
            INNER JOIN depot as de  WHERE entryDate>'2020-06-07' AND entryDate between '${req.body['Start_Date']}' 
            AND '${req.body['End_Date']}' and de.depot_name='${req.body['Depot_Name']}'  AND de.depot_code=intable.depot_code AND comments='NA' GROUP by de.depot_name;`;
           
            var QUERY_3 = `SELECT COUNT(comments) as com,de.depot_name as name FROM outtable  
            INNER JOIN depot as de  WHERE entryDate>'2020-06-07' AND entryDate between '${req.body['Start_Date']}' 
            AND '${req.body['End_Date'] }' and de.depot_name='${ req.body['Depot_Name'] }'  AND de.depot_code=outtable.depot_code AND comments!='NA' GROUP by de.depot_name;`;
            
            var QUERY_4 = `SELECT COUNT(comments) as com,de.depot_name as name FROM outtable  
            INNER JOIN depot as de  WHERE entryDate>'2020-06-07' AND entryDate between '${req.body['Start_Date']}' 
            AND '${req.body['End_Date'] }' and de.depot_name='${ req.body['Depot_Name'] }'  AND de.depot_code=outtable.depot_code AND comments='NA' GROUP by de.depot_name;`;
            
            CONNECTINO.query(QUERY_1+QUERY_2+QUERY_3+QUERY_4, [1,2,3,4], (e, r) =>
            {
                if (e)
                {
                    resolve({ status: false, message: 'Somethings wrong...', error: e });
                }
                if (r.length)
                {
                    resolve({ status: true, message: 'Data found', data:[r[0][0],r[1][0],r[2][0],r[3][0]]});
                } else
                {
                    resolve({ status: false, message: 'Data not found', data: null });
                }
            });
        });
    }
}