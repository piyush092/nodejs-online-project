module.exports =  function (app, CONNECTION,Grade_List)
{
    var GRADE_LIST = Grade_List;
    var RECIVED_TODAY_LIST_GRADE = {};
    var CLOSED_TODAY_LIST_GRADE = {};
    var OPENING_STOCK_LIST_GRADE = {};
    var CLOSED_STOCK_LIST_GRADE = {};

 app.post("/StockSheet/getData",  (req, res) =>
    {
        if (req.body['Depot_Code'] != '' && req.body['Depot_Code'] != null && req.body['Start_Date'] != '')
        {
           //RECIVED_TODAY LIST
            for (let index = 0; index < GRADE_LIST.length; index++)
            {  
            var RECIVED_TODAY_QUERY = `SELECT ROUND(SUM(invoiceQty),3) AS sum FROM newstock 
            WHERE entryDate='${ req.body['Start_Date'] }' AND depot_code='${ req.body['Depot_Code'] }'
            and grade='${GRADE_LIST[index] }' and invoiceNumber !='Balance123' and record='receipt' and deleteflag='0';`;
            
            var CLOSED_TODAY_QUERY = `SELECT ROUND(SUM(invoiceQty),3) AS sum FROM newstock 
            WHERE entryDate='${ req.body['Start_Date'] }' AND depot_code='${ req.body['Depot_Code'] }'
            and grade='${GRADE_LIST[index] }' and invoiceNumber !='Balance123' and record='sales' and deleteflag='0';`;
               
            //  OPENING STOCK  
             var OPENING_STOCK_QUERY = `SELECT ROUND(SUM(invoiceQty),3) as sum FROM newstock
             WHERE entryDate<'${req.body['Start_Date']}' AND 
             entryDate > '2020-06-07' AND depot_code='${req.body['Depot_Code'] }' and 
             grade='${GRADE_LIST[index] }' and record='receipt' and deleteflag='0';`;
              
            //   CLOSINNG STOCK 
             var CLOSED_STOCK_QUERY = `SELECT ROUND(SUM(invoiceQty),3) as sum FROM newstock
             WHERE entryDate<'${req.body['Start_Date']}' AND 
             entryDate > '2020-06-07' AND depot_code='${req.body['Depot_Code'] }' and 
             grade='${GRADE_LIST[index] }' and record='sales' and deleteflag='0';`;
                
         CONNECTION.query(RECIVED_TODAY_QUERY + '' + CLOSED_TODAY_QUERY +
                   '' + OPENING_STOCK_QUERY+''+CLOSED_STOCK_QUERY, [1, 2, 3,4], (e, r) =>
             {
                 var DATA_1 = r[0];
                 var DATA_2 = r[1];
                 var DATA_3 = r[2];
                 var DATA_4 = r[3];
                if (r != null && DATA_1[0]['sum']!=null)
                {
                    if (DATA_1.length != 0 && DATA_1 != null)
                    {
                        RECIVED_TODAY_LIST_GRADE[GRADE_LIST[index]]=(DATA_1[0]['sum']);
                    } else
                    {
                        RECIVED_TODAY_LIST_GRADE[GRADE_LIST[index]] = 0;
                    }
                } else
                {
                    RECIVED_TODAY_LIST_GRADE[GRADE_LIST[index]] = 0;
                 }

                // Sales Today Logic
                if (r != null && DATA_2[0]['sum']!=null)
                {
                    if (DATA_2.length != 0 && DATA_2 != null)
                    {
                        CLOSED_TODAY_LIST_GRADE[GRADE_LIST[index]]=(DATA_2[0]['sum']);
                    } else
                    {
                        CLOSED_TODAY_LIST_GRADE[GRADE_LIST[index]] = 0;
                    }
                } else
                {
                    CLOSED_TODAY_LIST_GRADE[GRADE_LIST[index]] = 0;
                 }

                 // OPENING_STOCK Logic
                if (r != null && DATA_3[0]['sum']!=null)
                {
                    if (DATA_3.length != 0 && DATA_3 != null)
                    {
                        OPENING_STOCK_LIST_GRADE[GRADE_LIST[index]]=(DATA_3[0]['sum'])-(DATA_4[0]['sum']);
                    } else
                    {
                        OPENING_STOCK_LIST_GRADE[GRADE_LIST[index]] = 0;
                    }
                } else
                {
                    OPENING_STOCK_LIST_GRADE[GRADE_LIST[index]] = 0;
                 }
                    // OPENING_STOCK Logic
                    if (r != null && DATA_4[0]['sum']!=null)
                    {
                        if (DATA_4.length != 0 && DATA_4 != null)
                        {
                            var OP_STOCK = (DATA_3[0]['sum']) - (DATA_4[0]['sum']);
                            OP_STOCK = OP_STOCK + (DATA_1[0]['sum']);
                            OP_STOCK=OP_STOCK-(DATA_2[0]['sum']);
                            CLOSED_STOCK_LIST_GRADE[GRADE_LIST[index]]=OP_STOCK;
                        } else
                        {
                            CLOSED_STOCK_LIST_GRADE[GRADE_LIST[index]] = 0;
                        }
                    } else
                    {
                        CLOSED_STOCK_LIST_GRADE[GRADE_LIST[index]] = 0;
                    }
                 if ((index + 1) == GRADE_LIST.length)
                 {     
                   res.json({
                       Status: true, Data: {
                           'RECIVED_TODAY_LIST_GRADE': RECIVED_TODAY_LIST_GRADE,
                           'CLOSED_TODAY_LIST_GRADE': CLOSED_TODAY_LIST_GRADE,
                           'OPENING_STOCK_LIST_GRADE': OPENING_STOCK_LIST_GRADE,
                           'CLOSED_STOCK_LIST_GRADE': CLOSED_STOCK_LIST_GRADE          
                       }, Message: 'Data found...'
                   });
                 }
               }); 
            }
        }
    });      
}