module.exports = function (app,CONNECTION,STATUS_CHECK)
{    
app.post("/ResetPassword", (req, res) =>
{
    CONNECTION.query(`SELECT * FROM employee_details where email_id='${req.body['Email_Id']}'`, (e, r) => {
        if (e) {
            STATUS_CHECK = { "MESSAGE": 'Data Not Found...', "ERROR_MESSAGE": e, "STATUS": false };
            res.json(e);
        }
        if (r!=null && r!=undefined)
        {
            if (r.length != 0)
            {
                CONNECTION.query(`UPDATE employee_details SET password = '${req.body['New_password']}' WHERE email_id='${req.body['Email_Id']}';`, (e, r) =>
                { 
                    STATUS_CHECK = { "MESSAGE": 'Successfully Reset Paasword..', "ERROR_MESSAGE": "", "STATUS": true };
                    res.json({status:true,Emp_Id:r['emp_id'],Login_Type:r['Role_Type'],data:r});  
                });
              
            } else
            {
                STATUS_CHECK = { "MESSAGE": 'Email Id not matched...', "ERROR_MESSAGE": "", "STATUS": false };
                res.json({status:false,Emp_Id:'',Login_Type:''});
            }
         
        } else
        {
            STATUS_CHECK = { "MESSAGE": 'Email Id not matched...', "ERROR_MESSAGE": "", "STATUS": false };
            res.json({status:false,Emp_Id:'',Login_Type:''});
        }
      });
});
app.post("/ResetPassword", (req, res) =>
{
    res.json({Hello:'Hy Abhi'})
});
}