module.exports = function (app, MYSQL_CON)
{
    app.post('/Admin/AttendanceInsert', (req,res) =>
    {
        Insert(MYSQL_CON, req.body,res);
    });
}

function  Insert (CONNECTION, DATA,res)
{
    
    if (DATA['Depot_Code'] != '' && DATA['Depot_Code'] != '')
    {

        Check_Condition().then((resp) =>
        {
            
            var INSERT_QUERY = ``;
            if (resp == true)
            {
                getFinal_Amount().then((resp2) =>
                {
                    INSERT_QUERY = `INSERT INTO attendance VALUES ('${DATA['Depot_Code']}','${DATA['Depot_Name']}');`;
                });
            } else
            {
                INSERT_QUERY = `INSERT INTO attendance VALUES ('${DATA['Depot_Code']}','${DATA['Depot_Name']}');`;   
            }
            CONNECTION.query(INSERT_QUERY, [1], function(err, results) {
                if (err) throw err;
              if (results['affectedRows']!=0) {
                   res.json({ Status: true, Message: 'Insert Successfully',Result:[results]});
              } else{
                   res.json({ Status: true, Error:err,Result:[results]});
              }
            });   
        })
    } else
    {
        res.json({ Status: true, Error:'Please Check any Input Empty',Result:[]});   
    }
}

function Check_Condition (mysql_conn, date, depot_code)
{
    return new Promise((resolve,reject) =>
    {
        var sql_query = `SELECT * from ATTENDANCE where DATE='${date}' and DEPOT_CODE='${depot_code}'`;
        mysql_conn.query(sql_query, [1], function (err, results)
        {
            if (err) throw err;
            if (results.length != 0)
            {
                resolve(true);
            } else
            {
                resolve(false);
            }
        }); 
    });   
}

function getFinal_Amount (mysql_con, date, depot_code)
{
    return new Promise((resolve,reject) =>
    {
        var sql_query = `SELECT * from ATTENDANCE where DATE='${date}' and DEPOT_CODE='${depot_code}'`;
        mysql_con.query(sql_query, [1], function(err, results) {
            if (err) throw err;
            if (results.length != 0)
            {
                resolve(results['FINAL_AMOUNT']);
            } else
            {
                resolve(0);
          }
        });    
    });    
}