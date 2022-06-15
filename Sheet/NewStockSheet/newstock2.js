module.exports =  (app,CONNECTION,GRADE_LIST_2,req)=>
{
    return  new Promise( (resolve, reject) =>
    {
        if (req.body['Depot_Code'] != '' && req.body['Depot_Code'] != null && req.body['Start_Date'] != '')
        {
            var QUERY_1 = ``;
            var GRADE_LIST = GRADE_LIST_2;
            var DEPOT_LIST = req.body['Depot_Code_List'];
            var DATA_STORE = {};
            var MAX_LENGTH = DEPOT_LIST.length;
            var DEPOT_NAME = req.body['Depot_Name_List'];;
            DEPOT_LIST.sort();
            DATA_STORE = {};
            var SPACE_QTY = [];
            if (req.body['Select_View_Type'] == 'All'){
                MAX_LENGTH = DEPOT_LIST.length;
                DEPOT_LIST = req.body['Depot_Code_List'];
            } else
            {
                MAX_LENGTH = 1;
                DEPOT_LIST = [req.body['Depot_Code']];
            }
            for (let depot_Index = 0; depot_Index < MAX_LENGTH; depot_Index++)
            {
                     // Today Opening Stock
                     var q_1 = `SELECT ROUND(SUM(invoiceQty),3) AS sum,grade,
                           depot_code FROM newstock WHERE entryDate='${ req.body['Start_Date'] }' and 
                           deleteflag='0' AND entryDate > '2020-06-07' and record="receipt" and depot_code='${ DEPOT_LIST[depot_Index] }' 
                           group by depot_code, grade order by depot_code,grade;`;
                
                    // Opening Stock
                    var q_2 = `SELECT ROUND(SUM(invoiceQty),3) AS sum,ROUND(SUM(calcQty),3) as calc, grade,
                           depot_code FROM newstock WHERE entryDate <'${ req.body['Start_Date'] }' and 
                           deleteflag='0' AND entryDate > '2020-06-07' and depot_code='${ DEPOT_LIST[depot_Index] }' 
                           group by depot_code, grade order by depot_code,grade;`;
                    
                    // Today Closing Stock
                    var q_3 = `SELECT ROUND(SUM(invoiceQty),3) AS sum,grade,
                    depot_code FROM newstock WHERE entryDate='${ req.body['Start_Date'] }' and 
                    deleteflag='0' AND entryDate > '2020-06-07' and record="sales" and depot_code='${ DEPOT_LIST[depot_Index] }' 
                    group by depot_code, grade order by depot_code,grade;`;
                      
                    // Closing Stock
                     var q_4 = `SELECT ROUND(SUM(invoiceQty),3) AS sum,ROUND(SUM(calcQty),3) as calc, grade,
                     depot_code FROM newstock WHERE entryDate <='${ req.body['Start_Date'] }' and 
                     deleteflag='0' AND entryDate > '2020-06-07' and depot_code='${ DEPOT_LIST[depot_Index] }' 
                     group by depot_code, grade order by depot_code,grade;`
                    
                    // CAPACITY_MT,SPACE_IN_SFT Query
                    QUERY_1 = `SELECT  depot_name as name,
                            SPACE_IN_SFT as space,CAPACITY_MT as capacity FROM depot where depot_code='${ DEPOT_LIST[depot_Index] }';`;
                     CONNECTION.query(q_1 + q_2+q_3+q_4+QUERY_1, [1, 2,3,4,5],  (e, r) =>
                    {
                        var GRADE_CREATE_OPENING_STOCK = {};
                        var GRADE_CREATE_RECEIVED_STOCK = {};
                        var GRADE_CREATE_CLOSING_TODAY_STOCK = {};
                        var GRADE_CREATE_CLOSING_STOCK = {};

                        SPACE_QTY = r[4];

                        var dump = [];
                        for (let k= 0; k< r[1].length; k++) {
                            dump.push(r[1][k]['grade']);
                            GRADE_CREATE_OPENING_STOCK[r[1][k]['grade']] = r[1][k]['calc'];
                        }
                        var result = GRADE_LIST.filter(x => !dump.includes(x)) 
                        for (let result_index = 0; result_index < result.length; result_index++) {
                            GRADE_CREATE_OPENING_STOCK[result[result_index]] = 0;
                        }

                        var dump2 = [];
                        for (let j = 0; j < r[0].length; j++) {
                            dump2.push(r[0][j]['grade']);
                            GRADE_CREATE_RECEIVED_STOCK[r[0][j]['grade']] = r[0][j]['sum'];
                        }
                        var result_2 = GRADE_LIST.filter(x => !dump2.includes(x)) 
                        for (let result_index = 0; result_index < result_2.length; result_index++) {
                            GRADE_CREATE_RECEIVED_STOCK[result_2[result_index]] = 0;
                        }

                        var dump3 = [];
                        for (let j = 0; j < r[2].length; j++) {
                            dump3.push(r[2][j]['grade']);
                            GRADE_CREATE_CLOSING_TODAY_STOCK[r[2][j]['grade']] = r[2][j]['sum'];
                        }
                        var result_3 = GRADE_LIST.filter(x => !dump3.includes(x)) 
                        for (let result_index = 0; result_index < result_3.length; result_index++) {
                            GRADE_CREATE_CLOSING_TODAY_STOCK[result_3[result_index]] = 0;
                        }

                        var dump4 = [];
                        for (let j = 0; j < r[3].length; j++) {
                            dump4.push(r[3][j]['grade']);
                            GRADE_CREATE_CLOSING_STOCK[r[3][j]['grade']] = r[3][j]['calc'];
                        }
                        var result_4 = GRADE_LIST.filter(x => !dump4.includes(x)) 
                        for (let result_index = 0; result_index < result_4.length; result_index++) {
                            GRADE_CREATE_CLOSING_STOCK[result_4[result_index]] = 0;
                        }
                        var TOTAL_SUM_OF_GRADE = 0;
                        for (let index = 0; index < GRADE_LIST.length; index++) {
                            TOTAL_SUM_OF_GRADE += GRADE_CREATE_CLOSING_STOCK[GRADE_LIST[index]];
                        }
                        var TOTAL_GODOWN_PERCENTAGE = ((TOTAL_SUM_OF_GRADE / parseFloat(SPACE_QTY[0]['capacity'])) * 100);
                        DATA_STORE[DEPOT_NAME[DEPOT_LIST[depot_Index]]] = {
                            OPENING_STOCK: {
                                GRADE_LIST: GRADE_CREATE_OPENING_STOCK,
                                DB_DATA: r[1]
                            },
                            TODAY_RECEIVED_STOCK: {
                                GRADE_LIST: GRADE_CREATE_RECEIVED_STOCK,
                                DB_DATA: r[0]
                            },
                            TODAY_CLOSING_STOCK: {
                                GRADE_LIST: GRADE_CREATE_CLOSING_TODAY_STOCK,
                                DB_DATA: r[2]
                            },
                            CLOSING_STOCK: {
                                GRADE_LIST: GRADE_CREATE_CLOSING_STOCK,
                                DB_DATA: r[3]
                            },
                            SPACE_CAPACITY: SPACE_QTY,
                            TOTAL_GODOWN_PERCENTAGE:TOTAL_SUM_OF_GRADE
                        };
                        setTimeout(() =>
                        {
                            if ((depot_Index + 1) == MAX_LENGTH)
                            {
                                resolve({
                                    Status: true, Data: DATA_STORE, Message: 'Data found...'
                                });
                            }
                        }, 2000);
                    });
                }
            }
    });    
}