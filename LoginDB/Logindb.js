module.exports = function (app,CONNECTION,STATUS_CHECK)
{    
app.post("/Login", (req, res) =>
{
    CONNECTION.query(`SELECT * FROM employee_details where email_id='${req.body['Email_Id']}' and password='${req.body['Password']}'`, (e, r) => {
        if (e) {
            STATUS_CHECK = { "MESSAGE": 'Data Not Found...', "ERROR_MESSAGE": e, "STATUS": false };
            res.json(e);
        }
        if (r!=null && r!=undefined)
        {
            if (r.length!=0) {
                STATUS_CHECK = { "MESSAGE": 'Successfully Login..', "ERROR_MESSAGE": "", "STATUS": true };
                res.json({status:true,Emp_Id:r['emp_id'],Login_Type:r['Role_Type'],data:r});
            } else
            {
                STATUS_CHECK = { "MESSAGE": 'Email Id & Password not matched...', "ERROR_MESSAGE": "", "STATUS": false };
                res.json({status:false,Emp_Id:'',Login_Type:''});
            }
         
        } else
        {
            STATUS_CHECK = { "MESSAGE": 'Email Id & Password not matched...', "ERROR_MESSAGE": "", "STATUS": false };
            res.json({status:false,Emp_Id:'',Login_Type:''});
        }
      });
});
}