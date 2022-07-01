module.exports = async function  (app,CONNECTION,STATUS_CHECK)
{    
    app.post("/ResetPassword", async (req, res) =>
    {
        CONNECTION.getConnection(async function (err, connection)
        {
            await connection.query(`SELECT * FROM employee_details where email_id='${ req.body['Email_Id'] }'`, async (e, r) =>
            {
                if (e)
                {
                    STATUS_CHECK = { "MESSAGE": 'Data Not Found...', "ERROR_MESSAGE": e, "STATUS": false };
                    res.json(e);
                    connection.release();
                }
                if (r != null && r != undefined)
                {
                    if (r.length != 0)
                    {
                        await connection.query(`UPDATE employee_details SET password = '${ req.body['New_password'] }' WHERE email_id='${ req.body['Email_Id'] }';`, async (e, r2) =>
                        {
                            await connection.query(`SELECT * FROM employee_details where email_id='${ req.body['Email_Id'] }'`, (e, r3) =>
                            {
                                STATUS_CHECK = { "MESSAGE": 'Successfully Reset Paasword..', "ERROR_MESSAGE": "", "STATUS": true };
                                res.json({ status: true, Emp_Id: r3['emp_id'], Login_Type: r3['Role_Type'], data: r3, STATUS_CHECK: STATUS_CHECK });
                            });
                        });
                        connection.release();
                    } else
                    {
                        STATUS_CHECK = { "MESSAGE": 'Email Id not matched...', "ERROR_MESSAGE": "", "STATUS": false };
                        res.json({ status: false, Emp_Id: '', Login_Type: '' });
                    }
                    connection.release();
                } else
                {
                    STATUS_CHECK = { "MESSAGE": 'Email Id not matched...', "ERROR_MESSAGE": "", "STATUS": false };
                    res.json({ status: false, Emp_Id: '', Login_Type: '' });
                    connection.release();
                }
            });
        });
    });
}