module.exports = function (app, MYSQL_CON)
{
    app.post('/OutwardSheetData/Update', (req,res) =>
    {
        UpdateOutwardSheet(MYSQL_CON, req.body,res);
    });
}

function UpdateOutwardSheet (CONNECTION, DATA,res)
{
    console.log(DATA);
    var UPDATE_QUERY_INWARD_SHEET = `UPDATE outtable SET 
    dealerName='${ DATA['Dealer_Name'] }',
    dealercode='${ DATA['Dealer_Code']}',
    invoiceNumber='${DATA['InvoiceNumber']}',
    invoiceDate='${DATA['InvoiceDate']}',
    truckArrangedBy='${DATA['TruckArrangedBy']}',
    invoiceQt='${DATA['InvoiceQty']}',
    grade='${DATA['Grade']}',
    loading='${DATA['Unloading']}',
    transphipment='${DATA['Transphipment']}',
    vehicleNumber='${DATA['VehicleNumber']}',
    diversion='${DATA['Diversion']}',
    driverMobileNumber='${DATA['DriverMobileNumber']}',
    driverName='${DATA['DriverName']}',
    inTimeOfTruck='${DATA['InTimeOfTruck']}',
    outTimeOfTruck='${DATA['OutTimeOfTruck'] }',
    Month='${ DATA['Month'] }',
    Year='${ DATA['Year'] }' where Unique_Id='${DATA['Unique_Id']}';`;

    var UPDATE_QUERY_NEWSTOCK_SHEET = `UPDATE newstock SET entryDate='${ DATA['Entry_Date'] }',
    particulars='${ DATA['dealerName']}',invoiceNumber='${DATA['InvoiceNumber'] }',invoiceDate='${ DATA['InvoiceDate'] }',
    invoiceQty='${ DATA['InvoiceQty'] }',grade='${ DATA['Grade']}',
    vehicleNumber='${DATA['VehicleNumber'] }',
    Month='${ DATA['Month'] }',Year='${ DATA['Year'] }',calcQty='${ DATA['InvoiceDate']*-1 }' where Unique_Id='${DATA['Unique_Id']}';`;

    CONNECTION.query(UPDATE_QUERY_INWARD_SHEET+''+UPDATE_QUERY_NEWSTOCK_SHEET, [1, 2], function(err, results) {
        if (err)
        {
            res.json({ Status: false, Error:err,Result:[]});
            throw err;  
        } 
      if (results[0]['affectedRows']!=0 && results[1]['affectedRows']!=0) {
           res.json({ Status: true, Message: 'Update Successfully',Result:[results[0],results[1]]});
      } else{
           res.json({ Status: false, Error:err,Result:[results[0],results[1]]});
      }
    });
}
