module.exports = function (app, MYSQL_CON)
{
    app.post('/OutwardSheetData/Insert', (req,res) =>
    {
       InsertSheet(MYSQL_CON, req.body,res);
    });
}

function InsertSheet (CONNECTION, DATA,res)
{
    var comments = 'NA';
    var deleteflag = 0;
    var UNIQUE_ID="UNIQUE";
    var UNIQUE_KEY="";

  getId(CONNECTION).then((e) =>
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
      if(id_2!=null){
        UNIQUE_KEY=UNIQUE_ID+"_"+(parseInt(id_2)+1);
      }else{
        UNIQUE_KEY="UNIQUE_1"; 
      }
        var depot_data = getDepotData(CONNECTION, DATA).then((e) => { return e });
        // Column 33
        var INSERT_QUERY_OUTWARD_SHEET = `INSERT INTO outtable values('',
        '${ DATA['Dealer_Name'] }','${ DATA['Dealer_Code']}',
        '${DATA['InvoiceNumber']}','${DATA['InvoiceDate']}','${DATA['InvoiceQty']}',
        '${DATA['Grade']}','${DATA['Unloading']}',
        '${DATA['Transphipment'] }','${ DATA['Diversion'] }','NA',
        '${DATA['TruckArrangedBy']}','${ DATA['VehicleNumber']}',
        '${DATA['DriverName']}','${DATA['DriverMobileNumber']}','${DATA['InTimeOfTruck']}',
        '${DATA['OutTimeOfTruck']}','${DATA['Entry_Date']}','${DATA['Emp_Id']}',
        '${DATA['Depot_Code'] }','${ comments }','${ UNIQUE_KEY }','${ deleteflag }',
        '${ DATA['Month'] }','${ DATA['Year'] }','${ depot_data['data'][0] }',
        '${ depot_data['data'][1] }','${ depot_data['data'][2] }','${ depot_data['data'][3] }',
        '${ DATA['Today'] }');`;

      var calQTY = DATA['InvoiceQty']*-1;
      var INSERT_QUERY_NEWSTOCK_SHEET = `INSERT INTO newstock values('','${ DATA['Entry_Date'] }','${ DATA['Dealer_Name']}',
        '${DATA['InvoiceNumber']}','${DATA['InvoiceDate']}','${DATA['InvoiceQty']}','${DATA['Grade']}',
        '${DATA['VehicleNumber']}','sales','${DATA['Emp_Id']}','${DATA['Depot_Code']}','${UNIQUE_KEY}',
        '${comments}','${deleteflag}','${ DATA['Month'] }','${ DATA['Year'] }',
        '${depot_data['data'][0] }','${ depot_data['data'][1] }','${ depot_data['data'][2] }',
        '${ depot_data['data'][3] }','0','0','${ DATA['Today'] }','${ calQTY }',
        '${depot_data['data'][4] }','${ depot_data['data'][5] }','${ depot_data['data'][6] }',
        '${ depot_data['data'][7] }','0','0');`;

    CONNECTION.query(INSERT_QUERY_OUTWARD_SHEET+''+INSERT_QUERY_NEWSTOCK_SHEET, [1, 2], function(err, results) {
        if (err) throw err;
      if (results[0]['affectedRows']!=0 && results[1]['affectedRows']!=0) {
           res.json({ Status: true, Message: 'Insert Successfully',Result:[results[0],results[1]]});
      } else{
           res.json({ Status: true, Error:err,Result:[results[0],results[1]]});
      }
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
    var COST_NR_TPH = 0;
    var COST_DSP_TPH = 0;
    var QTY_NR = 0;
    var QTY_DSP = 0;
    var QTY_NR_TPH = 0;
    var QTY_DSP_TPH = 0;
    var QUERY = `Select * from depot where depot_code='${ data['Depot_Code'] }'`;
    CONNECTION.query(QUERY, (e, r) =>
     {
       if (r!='' && r!=undefined) {
         if (data['Grade'] != 'DSP')
         {
           COST_NR = ((parseFloat(r[0]['nr_Loading']) * parseFloat(data['Unloading'])) / 20);
           COST_NR_TPH = ((parseFloat(r[0]['nr_transhipment']) * parseFloat(data['Transphipment'])) / 20);
           QTY_NR = parseFloat(data['Unloading']);
           QTY_DSP = 0;
           QTY_NR_TPH = parseFloat(data['Transphipment']);
           QTY_DSP_TPH = 0;
         } else
         {
           COST_DSP = ((parseFloat(r[0]['dsp_loading']) * parseFloat(data['Unloading'])) / 20);
           COST_DSP_TPH = ((parseFloat(r[0]['dsp_transhipment']) * parseFloat(data['Transphipment'])) / 20);
           QTY_NR = 0;
           QTY_DSP = parseFloat(data['Unloading']);
           QTY_NR_TPH =0;
           QTY_DSP_TPH =  parseFloat(data['Transphipment']);
         }
         resolve({ data: [COST_NR, COST_DSP, COST_NR_TPH, COST_DSP_TPH,QTY_NR,QTY_DSP,QTY_NR_TPH ,QTY_DSP_TPH]});
       } else
       {
         resolve([{id:'0'}])
       }
     });
  });
}

function getId(CONNECTION)
{
  return new Promise((resolve, reject) =>
  {
    var a=new Array();
     var sql = "Select * from outtable";
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
    var a=new Array();
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