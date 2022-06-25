module.exports = function (app, MYSQL_CON)
{
    app.post('/OutwardSheetData/Update', (req,res) =>
    {
        UpdateOutwardSheet(MYSQL_CON, req.body,res);
    });
}

function UpdateOutwardSheet (CONNECTION, DATA,res)
{
    getDepotData(CONNECTION, DATA).then((reponse) =>
    {
        console.log(DATA,reponse);
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
        Year='${ DATA['Year'] }',
        nr_loading_cost='${reponse['data'][0] }',
        dsp_loading_cost='${ reponse['data'][1] }',
        nr_transhipment_cost='${reponse['data'][2] }',
        dsp_transhipment_cost='${reponse['data'][3] }'
        where Unique_Id='${ DATA['Unique_Id'] }';`;

        var UPDATE_QUERY_NEWSTOCK_SHEET = `UPDATE newstock SET entryDate='${ DATA['Entry_Date'] }',
        particulars='${ DATA['dealerName'] }',invoiceNumber='${ DATA['InvoiceNumber'] }',
        invoiceDate='${ DATA['InvoiceDate'] }',
        invoiceQty='${ DATA['InvoiceQty'] }',grade='${ DATA['Grade']}',
        vehicleNumber='${DATA['VehicleNumber'] }',
        Month='${ DATA['Month'] }',Year='${ DATA['Year'] }',
        calcQty='${ DATA['InvoiceQty'] * -1 }', 
        nr_loading_cost='${reponse['data'][0] }', dsp_loading_cost='${ reponse['data'][1] }',
        nr_transhipment_cost='${reponse['data'][2] }',
        dsp_transhipment_cost='${reponse['data'][3] }', 
        nr_unloading_cost='0',
        dsp_unloading_cost='0'
        where Unique_Id='${ DATA['Unique_Id'] }';`;

        CONNECTION.query(UPDATE_QUERY_INWARD_SHEET+UPDATE_QUERY_NEWSTOCK_SHEET, [1, 2], function(err, results) {
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
   });
}
function getDepotData (CONNECTION,data)
{
  return new Promise((resolve,reject) =>
  {
    var COST_NR = 0;
    var COST_DSP = 0;
    var COST_NR_TPH = 0;
    var COST_DSP_TPH = 0;
    var QUERY = `Select * from depot where depot_code='${ data['Depot_Code'] }'`;
    CONNECTION.query(QUERY, (e, r) =>
     {
       if (r!='' && r!=undefined) {
         if (data['Grade'] != 'DSP')
         {
           COST_NR = ((parseFloat(r[0]['nr_Loading']) * parseFloat(data['Unloading'])) / 20);
           COST_NR_TPH= ((parseFloat(r[0]['nr_transhipment']) * parseFloat(data['Transphipment'])) / 20);
         } else
         {
           COST_DSP = ((parseFloat(r[0]['dsp_loading']) * parseFloat(data['Unloading'])) / 20);
           COST_DSP_TPH=((parseFloat(r[0]['dsp_transhipment']) * parseFloat(data['Transphipment'])) / 20);;
         }
           resolve({ data: [COST_NR, COST_DSP, COST_NR_TPH, COST_DSP_TPH] });
           console.log({ data: [COST_NR, COST_DSP, COST_NR_TPH, COST_DSP_TPH] });
       } else
       {
         resolve([{id:'0'}])
       }
     });
  });
}