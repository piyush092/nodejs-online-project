const { response } = require("express");

module.exports = function (app, MYSQL_CON)
{
    app.post('/InwardSheetData/Update', (req,res) =>
    {
        UpdateInwardSheet(MYSQL_CON, req.body,res);
    });
}

function UpdateInwardSheet (CONNECTION, DATA,res)
{
    getDepotData(CONNECTION,DATA).then((reponse) =>
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
        Year='${ DATA['Year'] }', nr_unloading_cost='${reponse['data'][0]}',dsp_unloading_cost='${reponse['data'][1]}' where Unique_Id='${ DATA['Unique_Id'] }';`;
    
        var UPDATE_QUERY_NEWSTOCK_SHEET = `UPDATE newstock SET entryDate='${ DATA['Entry_Date'] }',
        particulars='${ DATA['SourcePlant'] }',invoiceNumber='${ DATA['InvoiceNumber'] }',
        invoiceDate='${ DATA['InvoiceDate'] }',
        invoiceQty='${ DATA['InvoiceQty'] }',grade='${ DATA['Grade']}',
        vehicleNumber='${DATA['VehicleNumber']}',
        comments='${comments }',Month='${ DATA['Month'] }',
        Year='${ DATA['Year'] }',calcQty='${ DATA['InvoiceQty'] }',
        nr_loading_cost='0', dsp_loading_cost='0', nr_transhipment_cost='0', 
        dsp_transhipment_cost='0', nr_unloading_cost='${reponse['data'][0] }',
        dsp_unloading_cost='${reponse['data'][1]}'
        where Unique_Id='${ DATA['Unique_Id'] }';`;
    
        CONNECTION.query(UPDATE_QUERY_INWARD_SHEET+''+UPDATE_QUERY_NEWSTOCK_SHEET, [1, 2], function(err, results) {
            if (err) throw err;
          if (results[0]['affectedRows']!=0 && results[1]['affectedRows']!=0) {
               res.json({ Status: true, Message: 'Update Successfully',Result:[results[0],results[1]]});
          } else{
               res.json({ Status: true, Error:err,Result:[results[0],results[1]]});
          }
        });
    });
   
}
function getDepotData (CONNECTION, data)
{
    return new Promise((resolve, reject) =>
    {
        var COST_NR = 0;
        var COST_DSP = 0;
        var QUERY = `Select * from depot where depot_code='${ data['Depot_Code'] }'`;
        CONNECTION.query(QUERY, (e, r) =>
        {
            if (r != '' && r != undefined)
            {
                if (data['Grade'] != 'DSP')
                {
                    COST_NR = ((parseFloat(r[0]['nr_unloading']) * parseFloat(data['Unloading'])) / 20);
                    resolve({ data: [COST_NR, COST_DSP] });
                } else
                {
                    COST_DSP = ((parseFloat(r[0]['dsp_unloading']) * parseFloat(data['Unloading'])) / 20);
                    resolve({ data: [COST_NR, COST_DSP] })
                }
            } else
            {
                resolve([{ id: '0' }])
            }
        });
    });
}