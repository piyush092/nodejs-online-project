module.exports = function (CONNECTION, req)
{
    return new Promise((resolve, reject) =>
    {
        CONNECTION.getConnection(function (err, connection)
        {
            if (req.body['Depot_Name'] != '' && req.body['Depot_Name'] != null && req.body['Start_Date'] != '' && req.body['End_Date'] != '')
            {
                var DEPOT_NAME_LIST = req.body['Depot_Name'];
                var INWARD_DATA_PUSH = {};
                var OUTWARD_DATA_PUSH = {};
                for (let index = 0; index < DEPOT_NAME_LIST.length; index++)
                {
                    //Inward correction Query
                    var QUERY_1 = `SELECT COUNT(comments) as com,de.depot_name as name FROM intable  
                    INNER JOIN depot as de  WHERE entryDate>'2020-06-07'
                    AND entryDate between '${ req.body['Start_Date'] }' 
                    AND '${ req.body['End_Date'] }' and de.depot_name='${ DEPOT_NAME_LIST[index] }' 
                    AND de.depot_code=intable.depot_code AND comments!='NA' GROUP by de.depot_name;`;
        
                    //Inward Not correction Query
                    var QUERY_2 = `SELECT COUNT(comments) as com,de.depot_name as name FROM intable  
                    INNER JOIN depot as de  WHERE entryDate>'2020-06-07'
                    AND entryDate between '${ req.body['Start_Date'] }' 
                    AND '${ req.body['End_Date'] }' and de.depot_name='${ DEPOT_NAME_LIST[index] }'
                    AND de.depot_code=intable.depot_code AND comments='NA' GROUP by de.depot_name;`;
           
                    //Outward correction Query        
                    var QUERY_3 = `SELECT COUNT(comments) as com,de.depot_name as name FROM outtable  
                    INNER JOIN depot as de  WHERE entryDate>'2020-06-07'
                    AND entryDate between '${ req.body['Start_Date'] }' 
                    AND '${ req.body['End_Date'] }' and 
                    de.depot_name='${ DEPOT_NAME_LIST[index] }' 
                    AND de.depot_code=outtable.depot_code AND comments!='NA' GROUP by de.depot_name;`;
            
                    //Outward Not correction Query  
                    var QUERY_4 = `SELECT COUNT(comments) as com,de.depot_name as name FROM outtable  
                    INNER JOIN depot as de  WHERE entryDate>'2020-06-07' AND
                    entryDate between '${ req.body['Start_Date'] }' 
                    AND '${ req.body['End_Date'] }' and 
                    de.depot_name='${ DEPOT_NAME_LIST[index] }' 
                    AND de.depot_code=outtable.depot_code AND comments='NA' GROUP by de.depot_name;`;

                     //Outward Not correction Query  
                     var QUERY_5 = `SELECT comments as com,de.depot_name as name FROM intable  
                     INNER JOIN depot as de  WHERE entryDate>'2020-06-07' AND
                     entryDate between '${ req.body['Start_Date'] }' 
                     AND '${ req.body['End_Date'] }' and 
                     de.depot_name='${ DEPOT_NAME_LIST[index] }' 
                     AND de.depot_code=intable.depot_code AND comments!='NA';`;
                    
                     //Outward Not correction Query  
                     var QUERY_6 = `SELECT comments as com,de.depot_name as name FROM outtable  
                     INNER JOIN depot as de  WHERE entryDate>'2020-06-07' AND
                     entryDate between '${ req.body['Start_Date'] }' 
                     AND '${ req.body['End_Date'] }' and 
                     de.depot_name='${ DEPOT_NAME_LIST[index] }' 
                     AND de.depot_code=outtable.depot_code AND comments!='NA';`;
            
                    connection.query(QUERY_1 + QUERY_2 + QUERY_3 + QUERY_4+QUERY_5+QUERY_6, [1, 2, 3, 4,5,6], (e, r) =>{
                        if (e)
                        {
                            resolve({ status: false, message: 'Somethings wrong...', error: e });
                            connection.release();
                        }
                        if (r[0] != '' && r[0] != undefined)
                        {
                            INWARD_DATA_PUSH[DEPOT_NAME_LIST[index]] = Object.assign({
                                Inward_Correction: r[0][0]!=null?r[0][0]['com']:'0'
                            }, INWARD_DATA_PUSH[DEPOT_NAME_LIST[index]]);
                        } else
                        {
                            INWARD_DATA_PUSH[DEPOT_NAME_LIST[index]] = Object.assign({
                                Inward_Correction: 0
                                }, INWARD_DATA_PUSH[DEPOT_NAME_LIST[index]]);
                        }
                        if (r[1] != '' && r[1] != undefined) {
                            INWARD_DATA_PUSH[DEPOT_NAME_LIST[index]] = Object.assign({
                                Inward_Not_Correction: r[1][0]!=null?r[1][0]['com']:'0'
                            }, INWARD_DATA_PUSH[DEPOT_NAME_LIST[index]]);
                        } else
                        {
                            INWARD_DATA_PUSH[DEPOT_NAME_LIST[index]] = Object.assign({
                            Inward_Not_Correction: 0
                            }, INWARD_DATA_PUSH[DEPOT_NAME_LIST[index]]);
                        }
                        if (r[2] != '' && r[2] != undefined) {
                            OUTWARD_DATA_PUSH[DEPOT_NAME_LIST[index]] = Object.assign({
                                Outward_Correction: r[2][0]!=null?r[2][0]['com']:'0'
                            }, OUTWARD_DATA_PUSH[DEPOT_NAME_LIST[index]]);
                        } else
                        {
                            OUTWARD_DATA_PUSH[DEPOT_NAME_LIST[index]] = Object.assign({
                            Outward_Correction: 0
                            }, OUTWARD_DATA_PUSH[DEPOT_NAME_LIST[index]]);
                        }
                        if (r[3] != '' && r[3] != undefined) {
                            OUTWARD_DATA_PUSH[DEPOT_NAME_LIST[index]] = Object.assign({
                               Outward_Not_Correction:r[3][0]!=null?r[3][0]['com']:'0'
                            }, OUTWARD_DATA_PUSH[DEPOT_NAME_LIST[index]]);
                        } else
                        {
                            OUTWARD_DATA_PUSH[DEPOT_NAME_LIST[index]] = Object.assign({
                            Outward_Not_Correction: 0
                            }, OUTWARD_DATA_PUSH[DEPOT_NAME_LIST[index]]);
                        }
                        INWARD_DATA_PUSH[DEPOT_NAME_LIST[index]] = Object.assign({
                            INWARD_COMMENTS: r[4]
                        }, INWARD_DATA_PUSH[DEPOT_NAME_LIST[index]]);
                        
                        OUTWARD_DATA_PUSH[DEPOT_NAME_LIST[index]] = Object.assign({
                            OUTWARD_COMMENTS: r[5]
                        }, OUTWARD_DATA_PUSH[DEPOT_NAME_LIST[index]]);

                        if ((index + 1) == DEPOT_NAME_LIST.length)
                        {
                            connection.release();
                            if (INWARD_DATA_PUSH.length != 0 && OUTWARD_DATA_PUSH.length!=0)
                            {
                                resolve({
                                    INDEX_LENGHT: OUTWARD_DATA_PUSH.length,
                                    INWARD_DATA: INWARD_DATA_PUSH,
                                    OUTWARD_DATA: OUTWARD_DATA_PUSH,
                                    DEPOT_NAME:DEPOT_NAME_LIST,
                                    status: true,
                                    message: 'Data found'
                                });
                            } else
                            {
                                resolve({ status: false,INWARD_DATA:INWARD_DATA_PUSH,OUTWARD_DATA:OUTWARD_DATA_PUSH, message: 'Data not found', data: null });
                            }
                        }
                    });
                }
            }
        });
    });
}