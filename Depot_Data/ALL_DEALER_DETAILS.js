module.exports =  (app,CONNECTION,STATUS_CHECK)=>
{
    return new Promise((resolve, reject) =>
    {
        CONNECTION.query(`SELECT * from dealer_details ORDER BY DEALER_NAME ASC`, (e, r) => {
            if (e) {
                STATUS_CHECK = { "MESSAGE": 'Data not Found...', "ERROR_MESSAGE": e, "STATUS": false };
                resolve({ Data: r, STATUS: STATUS_CHECK });
                return;
            }
            if (r.length)
            {
                STATUS_CHECK = { "MESSAGE": 'Data Found...', "ERROR_MESSAGE": '', "STATUS": true };
               resolve({Data:r,STATUS:STATUS_CHECK});
              return;
            } else
            {
                STATUS_CHECK = { "MESSAGE": 'Data not Found...', "ERROR_MESSAGE": '', "STATUS": false };
                resolve({Data:r,STATUS:STATUS_CHECK});
            }
          });            
    });
}