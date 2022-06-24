const express = require("express");
const cors = require("cors");
const app = express();
const sql = require("./Connection.js");

const InwardInsertSheet = require('./InwardSheet/Inward_Insert_Sheet.js');
const InwardViewData = require('./InwardSheet/InwardSheetView.js');
const InwardDeleteData = require('./InwardSheet/InwardDelete.js');
const InwardUpdateSheet = require('./InwardSheet/InwardUpdate.js');

const OutWardInsertSheet= require('./OutwardSheet/OutwardInsert.js');
const OutwardViewData = require('./OutwardSheet/OutWarddisplayData.js');
const OutwardDeleteData = require('./OutwardSheet/OutwardDelete.js');
const OutwardUpdateSheet = require('./OutwardSheet/OutwardUpdate.js');

const LoginCredentional = require('./LoginDB/Logindb.js');
const ResetPassowrdCredentional = require('./LoginDB/ResetPassword.js');
const Depot_details = require('./Depot_Data/DepotList.js');
const ExcelTodb = require('./Excel_to_Db/Excel_to_db.js');
const Dealer_Details = require('./Depot_Data/DealerDetails.js');
const Dealer_DetailsALL = require('./Depot_Data/ALL_DEALER_DETAILS.js');
const Dealer_INSERT = require('./Depot_Data/DealerInsert.js');
const StockSheetViewData = require('./Sheet/StockSheet/StockSheetData.js');
const NewStockSheetViewData = require('./Sheet/NewStockSheet/newstock.js');
const NewStockSheetViewData2 = require('./Sheet/NewStockSheet/newstock2.js');
const CORRECTION_REPORT_DATA = require('./Sheet/Correction_Report/Correction_report.js');
const DSR_REPORT_DATA = require('./Sheet/DSR_Report/dsr_report.js');
const DSR_REPORT_DATA_2 = require('./Sheet/DSR_Report/drs_report_2.js');
const DSR_REPORT_DATA_3 = require('./Sheet/DSR_Report/dsr_report_3.js');
const LABOUR_DATA = require('./Sheet/Labour_Report/Labour_report.js');
const GradeInsert = require('./Sheet/Admin/GradeInsert.js');
const EmpInsert = require('./Sheet/Admin/EmplyoeesInsert.js');
const DepotInsert = require('./Sheet/Admin/DepotInsert.js');
const EmpList = require('./Depot_Data/EmpData.js');

var STATUS_CHECK = null;

var corsOptions = {
  origin: [
    'https://nodejs-online-project.vercel.app',
    'https://theforesite.com',
    'http://localhost:4200',
    'https://theforesite.in']
};

app.use(cors(corsOptions));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

var d = [];
sql.query(`Select Grade_Name from Grade_Con`, [1], (e, r) =>
{
  r.forEach(element => {
    d.push(element.Grade_Name);
  });
});

InwardInsertSheet(app, sql);
InwardViewData(app, sql);
InwardUpdateSheet(app, sql);
InwardDeleteData(app, sql);

OutwardViewData(app, sql);
OutWardInsertSheet(app, sql);
OutwardUpdateSheet(app, sql);
OutwardDeleteData(app, sql);
StockSheetViewData(app, sql,d);

EmpInsert(app, sql);
DepotInsert(app, sql);
GradeInsert(app, sql);
EmpList(app, sql);

app.post("/NewStockSheet/getData", (req, res) =>
{
  NewStockSheetViewData(sql,req).then((e) =>
  {
    res.json(e);
  });  
});
app.post("/NewStockSheet2/getData",(req, res) =>
{
  NewStockSheetViewData2(app, sql, d,req).then((e) =>
  {
    res.json(e);
  });  
});

LoginCredentional(app, sql, STATUS_CHECK);
ResetPassowrdCredentional(app, sql, STATUS_CHECK);
Depot_details(app, sql, STATUS_CHECK);
Dealer_Details(app, sql, STATUS_CHECK);
Dealer_INSERT(app, sql);
Dealer_DetailsALL(app, sql, STATUS_CHECK).then((e) =>
{
  app.get("/Dealer/data", (req, res) =>
  {
    res.json({e})
  });  
});

app.post("/Labour/data", (req, res) =>
{
  LABOUR_DATA(sql, req).then((e) =>
  {
    console.log(e);
    res.json({ e });
  });
});  

app.get('/Status', (req,res) =>
{
  res.json(STATUS_CHECK);
});

app.get('/Grade', (req, res) =>
{
  res.json({ Status: true, Grade_List: d });
});

app.post("/Correction_Report/data",  (req, res) =>
{
  CORRECTION_REPORT_DATA(sql, req)?.then((e) =>
  {
    res.json(e);
  });
});

app.post("/Dsr_Report/data",  (req, res) =>
{
  DSR_REPORT_DATA(app, sql,req).then((e) =>
  {
    res.json(e);
  });  
});
app.post("/Dsr_Report/data2",  (req, res) =>
{
  DSR_REPORT_DATA_2(app, sql,req).then((e) =>
  {
    res.json(e);
  });  
});
app.post("/Dsr_Report/data3",  (req, res) =>
{
  DSR_REPORT_DATA_3(app, sql,req).then((e) =>
  {
    res.json(e);
  });  
});
const PORT = process.env.PORT || 3000;
var server=app.listen(PORT, () => {
  console.log(`Server is running on port ${ PORT }.`);
});
server.setTimeout(30*10000);
ExcelTodb(app, sql, server, STATUS_CHECK);