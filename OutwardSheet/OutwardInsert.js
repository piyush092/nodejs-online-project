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
        '${ DATA['Month'] }','${ DATA['Year'] }','${depot_data[0]}','${depot_data[1]}','${depot_data[2]}','${depot_data[3]}','${DATA['Today']}');`;

      var calQTY = DATA['InvoiceQty']*-1;
      var INSERT_QUERY_NEWSTOCK_SHEET = `INSERT INTO newstock values('','${ DATA['Entry_Date'] }','${ DATA['Dealer_Name']}',
        '${DATA['InvoiceNumber']}','${DATA['InvoiceDate']}','${DATA['InvoiceQty']}','${DATA['Grade']}',
        '${DATA['VehicleNumber']}','sales','${DATA['Emp_Id']}','${DATA['Depot_Code']}','${UNIQUE_KEY}',
        '${comments}','${deleteflag}','${ DATA['Month'] }','${ DATA['Year'] }',
        '${depot_data[0]}','${depot_data[1]}','${depot_data[2]}','${depot_data[3]}','0','0','${DATA['Today']}','${calQTY}');`;

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
    var QUERY = `Select nr_Loading,DSP_Loading,nr_Transshipment,DSP_Transshipment from depot where depot_code='${ data['Depot_Code'] }'`;
    CONNECTION.query(QUERY, (e, r) =>
     {
       if (r!='' && r!=undefined) {
         if (data['Grade'] != 'DSP')
         {
           COST_NR = ((parseFloat(r[0]['nr_Loading']) * parseFloat(data['Unloading'])) / 20);
           COST_NR_TPH= ((parseFloat(r[0]['nr_Transshipment']) * parseFloat(data['Transphipment'])) / 20);
         } else
         {
           COST_DSP = ((parseFloat(r[0]['DSP_Loading']) * parseFloat(data['Unloading'])) / 20);
           COST_DSP_TPH=((parseFloat(r[0]['DSP_Transshipment']) * parseFloat(data['Transphipment'])) / 20);;
         }
         resolve({ data: [COST_NR, COST_DSP, COST_NR_TPH, COST_DSP_TPH] });
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