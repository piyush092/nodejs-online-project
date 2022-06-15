module.exports = function (app, MYSQL_CON)
{
    app.post('/InwardSheetData/Update', (req,res) =>
    {
        UpdateInwardSheet(MYSQL_CON, req.body,res);
    });
}

function UpdateInwardSheet (CONNECTION, DATA,res)
{
    var comments = 'NA';
   
    var UPDATE_QUERY_INWARD_SHEET=`UPDATE intable SET particulars='${DATA['SourcePlant']}',
    invoiceNumber='${DATA['InvoiceNumber'] }',invoiceDate='${ DATA['InvoiceDate'] }',
    arrivalDateOfTruck='${ DATA['ArrivalDateOfTruck'] }',invoiceQty='${ DATA['InvoiceQty']}',
    grade='${DATA['Grade'] }',shortage='${ DATA['Shortage'] }',cutAndTorn='${ DATA['CutAndTorn'] }',
    goodStock='${ DATA['GoodStock'] }',unloading='${ DATA['Unloading']}',
    transphipment='${DATA['Transphipment'] }',diversion='${ DATA['Diversion'] }',
    transporterCompany='${ DATA['TransporterCompany'] }',vehicleNumber='${ DATA['VehicleNumber']}',
    driverName='${DATA['DriverName'] }',driverMobileNumber='${ DATA['DriverMobileNumber'] }',
    reasonForDelay='${ DATA['reasonForDelay'] }',inTimeOfTruck='${ DATA['InTimeOfTruck']}',
    outTimeOfTruck='${DATA['OutTimeOfTruck'] }',haltHour='${ DATA['HaltHour'] }',
    entryDate='${ DATA['Entry_Date'] }',
    billingtimeofplant='${ DATA['BillingTimeOfPlant'] }',cleardateoftruck='${ DATA['ClearDateOfTruck']}',
    comments='${comments }',Month='${ DATA['Month'] }',
    Year='${ DATA['Year'] }' where Unique_Id='${ DATA['Unique_Id'] }';`;

    var UPDATE_QUERY_NEWSTOCK_SHEET = `UPDATE newstock SET entryDate='${ DATA['Entry_Date'] }',
    particulars='${ DATA['SourcePlant']}',invoiceNumber='${DATA['InvoiceNumber'] }',invoiceDate='${ DATA['InvoiceDate'] }',
    invoiceQty='${ DATA['InvoiceQty'] }',grade='${ DATA['Grade']}',
    vehicleNumber='${DATA['VehicleNumber']}',
    comments='${comments }',Month='${ DATA['Month'] }',
    Year='${ DATA['Year'] }',calcQty='${ DATA['InvoiceDate'] }' where Unique_Id='${ DATA['Unique_Id'] }';`;

    CONNECTION.query(UPDATE_QUERY_INWARD_SHEET+''+UPDATE_QUERY_NEWSTOCK_SHEET, [1, 2], function(err, results) {
        if (err) throw err;
      if (results[0]['affectedRows']!=0 && results[1]['affectedRows']!=0) {
           res.json({ Status: true, Message: 'Update Successfully',Result:[results[0],results[1]]});
      } else{
           res.json({ Status: true, Error:err,Result:[results[0],results[1]]});
      }
    });
}
