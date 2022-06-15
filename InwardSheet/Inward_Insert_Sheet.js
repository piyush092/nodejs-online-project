module.exports = function (app, MYSQL_CON)
{
    app.post('/InwardSheetData/Insert', (req,res) =>
    {
        InsertInwardSheet(MYSQL_CON, req.body,res);
    });
}

function  InsertInwardSheet (CONNECTION, DATA,res)
{
    var comments = 'NA';
    var deleteflag = 0;
    var UNIQUE_ID="UNIQUE";
    var UNIQUE_KEY="";
    var ID_UNIQUE = 0;

  getIdINTABLE(CONNECTION).then((e) =>
  {
    var idIncrement = 0;
    var id = e[e.length - 1]['id'];
    if(id!=null){
      idIncrement=(parseInt(id)+1);
    }else{
      idIncrement=1; 
    }
    getIdNewStock(CONNECTION).then((e) =>
    {
      var id_2=e[e.length - 1]['id'];
      ID_UNIQUE=0;
      if(id_2!=null){
        UNIQUE_KEY=UNIQUE_ID+"_"+(parseInt(id_2)+1);
        ID_UNIQUE=(parseInt(id_2)+1);
      }else{
        UNIQUE_KEY="UNIQUE_1"; 
        ID_UNIQUE=1; 
      }
      var depotdata = [];
    getDepotData(CONNECTION, DATA).then((e) =>
    { 
      depotdata = e;
      var INSERT_QUERY_INWARD_SHEET = `INSERT INTO intable values('','${ DATA['SourcePlant']}',
      '${DATA['InvoiceNumber']}','${DATA['InvoiceDate']}','${DATA['ArrivalDateOfTruck']}','${DATA['InvoiceQty']}',
      '${DATA['Grade']}','${DATA['Shortage']}','${DATA['CutAndTorn']}','${DATA['GoodStock']}','${DATA['Unloading']}',
      '${DATA['Transphipment']}','${DATA['Diversion']}','${DATA['TransporterCompany']}','${DATA['VehicleNumber']}',
      '${DATA['DriverName']}','${DATA['DriverMobileNumber']}','${DATA['reasonForDelay']}','${DATA['InTimeOfTruck']}',
      '${DATA['OutTimeOfTruck']}','${DATA['HaltHour']}','${DATA['Entry_Date']}','${DATA['Emp_Id']}',
      '${DATA['Depot_Code']}','${DATA['BillingTimeOfPlant']}','${DATA['ClearDateOfTruck']}',
      '${comments }','${ UNIQUE_KEY }','${ deleteflag }','${ DATA['Month'] }','${ DATA['Year'] }',
      '${depotdata['data'][0]}','${depotdata['data'][1]}','${DATA['Today']}');`;
  
      var calQTY = DATA['InvoiceQty'];
      var INSERT_QUERY_NEWSTOCK_SHEET=`INSERT INTO newstock values('','${DATA['Entry_Date']}','${DATA['SourcePlant']}',
      '${DATA['InvoiceNumber']}','${DATA['InvoiceDate']}','${DATA['InvoiceQty']}','${DATA['Grade']}',
      '${DATA['VehicleNumber']}','receipt','${DATA['Emp_Id']}','${DATA['Depot_Code']}','${UNIQUE_KEY}',
      '${comments}','${deleteflag}','${ DATA['Month'] }','${ DATA['Year'] }',
      '0','0','0','0','${depotdata['data'][0]}','${depotdata['data'][1]}','${DATA['Today']}','${calQTY}');`;
  
      CONNECTION.query(INSERT_QUERY_INWARD_SHEET+''+INSERT_QUERY_NEWSTOCK_SHEET, [1, 2], function(err, results) {
          if (err) throw err;
        if (results[0]['affectedRows']!=0 && results[1]['affectedRows']!=0) {
             res.json({ Status: true, Message: 'Insert Successfully',Result:[results[0],results[1]]});
        } else{
             res.json({ Status: true, Error:err,Result:[results[0],results[1]]});
        }
      });
      });   
  });
  });
}

function getDepotData (CONNECTION,data)
{
  return new Promise((resolve,reject) =>
  {
    var COST_NR = 0;
    var COST_DSP = 0;
    var QUERY = `Select nr_Unloading,DSP_Unloading from depot where depot_code='${ data['Depot_Code'] }'`;
    CONNECTION.query(QUERY, (e, r) =>
    {
       if (r!='' && r!=undefined) {
         if (data['Grade']!='DSP') {
           COST_NR = ((parseFloat(r[0]['nr_Unloading']) * parseFloat(data['GoodStock']))/20);
           resolve({ data: [COST_NR, COST_DSP] });
         } else
         {
           COST_DSP = ((parseFloat(r[0]['DSP_Unloading']) * parseFloat(data['GoodStock']))/20);
           resolve({ data: [COST_NR, COST_DSP] })
         }
       } else
       {
         resolve([{id:'0'}])
       }
     });
  });
}

function getIdINTABLE(CONNECTION)
{
  return new Promise((resolve, reject) =>
  {
     var sql = "Select * from intable";
     CONNECTION.query(sql, (e, r) =>
     {
       if (r!='' && r!=undefined) {
         resolve(r)
       } else
       {
         resolve([{id:'0'}])
       }
     });
  });
 }
 function getIdNewStock(CONNECTION)
 {
  return new Promise((resolve, reject) =>
  {
     var sql = "Select * from newstock";
     CONNECTION.query(sql, (e, r) =>
     {
       if (r!='' && r!=undefined) {
         resolve(r)
       } else
       {
        resolve([{id:'0'}])
       }
     });
  });
 }