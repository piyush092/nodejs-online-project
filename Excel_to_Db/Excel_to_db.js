var fs = require('fs');
module.exports = function (app,connection,server,STATUS_CHECK)
{
    app.post("/Excel_to_Db", (req, res) =>
    {
        console.log('helllo')
        var DATA = req.body;
        var TABLE_NAME = DATA['TABLE_NAME'];
        DATA = DATA['JSON_DATA'];
        var QUERY_CREATE = ``;
        try {
            if (!fs.existsSync(TABLE_NAME + ".sql")) {
                fs.createWriteStream(TABLE_NAME + ".sql");
            } 
          } catch(err) {
            console.error(err)
        }
        connection.timeOut = (1000 * DATA.length);
        connection.connectTimeout = (1000 * DATA.length);
        connection.acquireTimeout = (1000 * DATA.length);
        server.setTimeout(1000 * DATA.length);
        if (TABLE_NAME=='intable') {
            for (let index = 0; index < DATA.length; index++)
            {
                QUERY_CREATE += `INSERT INTO ${ TABLE_NAME } VALUES ("","${DATA[index]['sourcePlant']}",
                "${DATA[index]['invoiceNumber']}","${DATA[index]['invoiceDate']}","${DATA[index]['arrivalDateOfTruck']}","${DATA[index]['invoiceQty']}",
                "${DATA[index]['grade']}","${DATA[index]['shortage']}","${DATA[index]['cutAndTorn']}","${DATA[index]['goodStock']}","${DATA[index]['unloading']}",
                "${DATA[index]['transphipment']}","${DATA[index]['diversion']}","${DATA[index]['transporterCompany']}","${DATA[index]['vehicleNumber']}",
                "${DATA[index]['driverName']}","${DATA[index]['driverMobileNumber']}","${DATA[index]['reasonForDelay']}","${DATA[index]['inTimeOfTruck']}",
                "${DATA[index]['outTimeOfTruck']}","${DATA[index]['haltHour']}","${DATA[index]['entryDate']}","${DATA[index]['emp_id']}",
                "${DATA[index]['depot_code']}","${DATA[index]['billingtimeofplant']}","${DATA[index]['cleardateoftruck']}",
                "${DATA[index]['comments'] }","${DATA[index][index]['stampTime'] }","${DATA[index][index]['deleteflag'] }","${DATA[index][index]['Month'] }",
                "${DATA[index][index]['Year'] }",
                '10','10',"${DATA[index]['day']}");`;
                if ((index + 1) == DATA.length)
                {
                    fs.appendFile(TABLE_NAME+".sql",QUERY_CREATE, function (err) {
                        if (err) throw err;
                        res.status(200).send({
                            success: {
                            status: true,
                            message: 'Succesfully insert data..'
                            }, error: { message: '' }
                        });
                      });
                }
            }
        } else if(TABLE_NAME=='outtable')
        {
            for (let index = 0; index < DATA.length; index++)
            {
                QUERY_CREATE += `INSERT INTO ${ TABLE_NAME } VALUES ("",
                "${DATA[index]['dealerName'] }","${DATA[index]['dealercode']}",
                "${DATA[index]['invoiceNumber']}","${DATA[index]['invoiceDate']}","${DATA[index]['invoiceQty']}",
                "${DATA[index]['grade']}","${DATA[index]['unloading']}",
                "${DATA[index]['transphipment'] }","${DATA[index]['diversion'] }","${DATA[index]['transporterCompany'] }",
                "${DATA[index]['truckArrangedBy']}","${ DATA[index]['vehicleNumber']}",
                "${DATA[index]['driverName']}","${DATA[index]['driverMobileNumber']}","${DATA[index]['inTimeOfTruck']}",
                "${DATA[index]['outTimeOfTruck']}","${DATA[index]['entryDate']}","${DATA[index]['emp_id']}",
                "${DATA[index]['depot_code'] }","${DATA[index]['comments'] }","${DATA[index]['stampTime'] }","${DATA[index]['deleteflag'] }",
                "${DATA[index]['Month'] }","${DATA[index]['Year'] }",'10','10','10','10',"${DATA[index]['day']}");`;
                if ((index + 1) == DATA.length)
                {
                    fs.appendFile(TABLE_NAME+".sql",QUERY_CREATE, function (err) {
                        if (err) throw err;
                        res.status(200).send({
                            success: {
                            status: true,
                            message: 'Succesfully insert data..'
                            }, error: { message: '' }
                        });
                      });
                }
            }    
        }else if(TABLE_NAME=='newstock')
        {
            for (let index = 0; index < DATA.length; index++)
            {
                QUERY_CREATE += `INSERT INTO ${ TABLE_NAME } VALUES ("",
                "${DATA[index]['entryDate']}","${DATA[index]['particulars']}",
                "${DATA[index]['invoiceNumber']}","${DATA[index]['invoiceDate']}","${DATA[index]['invoiceQty']}","${DATA[index]['grade']}",
                "${DATA[index]['vehicleNumber'] }","${DATA[index]['record']}","${DATA[index]['emp_id'] }","${DATA[index]['depot_code'] }",
                "${DATA[index]['stampTime'] }","${DATA[index]['comments'] }","${DATA[index]['deleteflag'] }",
                "${DATA[index]['Month'] }","${DATA[index]['Year'] }",'10','10','10','10','10','10',"${DATA[index]['day']}");`;
                if ((index + 1) == DATA.length)
                {
                    fs.appendFile(TABLE_NAME+".sql",QUERY_CREATE, function (err) {
                        if (err) throw err;
                        res.status(200).send({
                            success: {
                            status: true,
                            message: 'Succesfully insert data..'
                            }, error: { message: '' }
                        });
                      });
                }
            }    
        }
        else if(TABLE_NAME=='Attendance')
        {
            console.log(DATA)
            for (let index = 0; index < DATA.length; index++)
            {
                QUERY_CREATE += `INSERT INTO ${ TABLE_NAME } VALUES (
                "${DATA[index]['DEPOT_CODE']}","${DATA[index]['DEPOT_NAME']}",
                "${DATA[index]['DATE'] }","${ DATA[index]['PURCHASE'] }","${ DATA[index]['SALES'] }",
                "${ DATA[index]['FINAL_AMOUNT']}",
                "${DATA[index]['ATTENDANCE_STATUS'] }","",
                "${DATA[index]['Month'] }","${DATA[index]['Year'] }","${DATA[index]['day']}");`;
                if ((index + 1) == DATA.length)
                {
                    fs.appendFile(TABLE_NAME+".sql",QUERY_CREATE, function (err) {
                        if (err) throw err;
                        res.status(200).send({
                            success: {
                            status: true,
                            message: 'Succesfully insert data..'
                            }, error: { message: '' }
                        });
                      });
                }
            }    
        }
   });
}

function removeLastComma(strng){        
    var n=strng.lastIndexOf(",");
    var a=strng.substring(0,n) 
    return a;
}