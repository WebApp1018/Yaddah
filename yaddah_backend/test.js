const a = {
  AWS_BUCKET_REGION: 'us-east-2',
  AWS_ACCESS_KEY: 'DO00V94424T838Q6UGZ3',
  AWS_SECRET_KEY: 'MDOZQTJBcLkMR2QJlteR4FmH/Y+797F9PHhBAIQ8iFk',
  AWS_VIDEO_BUCKET_LINK: 'https://yaddah-bucket.s3.us-east-2.amazonaws.com/',
  AWS_USERNAME: 'yaddah-user',
  AWS_IMAGE_BUCKET_NAME: 'yaddah-bucket',
};
//  import fs
const fs = require('fs');
const config = {
  email: 'mailConfig1.json',
  payment: 'paymentConfig1.json',
  s3: 'awsConfig1.json',
};

// write json object to file name abcCOnfig.json
fs.writeFileSync(
  config['email'],
  JSON.stringify({
    //   a[a.key]
    SERVICE: 'POSTMARK',
    EMAIL_FROM: 'pr@yaddah.net',
    POSTMARK_KEY: '0f60fb5c-5ea1-4941-a54d-3515123bc',
  }),
  (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('Config file saved!');
  }
);

/**
 * {
  "SERVICE": "SENDGRID",
  "EMAIL_FROM": "pr@yaddah.net",
  "SENDGRID_USERNAME": "apikey",
  "SENDGRID_PASSWORD": "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"
},
 
{
"SERVICE": "POSTMARK",
"EMAIL_FROM": "pr@yaddah.net",
"POSTMARK_KEY": "0f60fb5c-5ea1-4941-a54d-3515123bc"
},

{
"SERVICE": "AWSSES",
"EMAIL_FROM": "adrian@neptunecloud.io",
"AWS_SES_REGION": "us-east-1",
"API_VERSION": "2010-12-01"
},

{"SERVICE": "GMAIL",
"HOST": "smtp.gmail.com",
"PORT": 587,
"USER": "",
"PASSWORD": ""
}


 */
