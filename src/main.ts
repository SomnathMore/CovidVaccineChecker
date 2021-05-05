import superagent = require('superagent');
import cron = require('node-cron');
import { DateTime } from "luxon";
import nodemailer = require('nodemailer');

function CheckForSlots()
{
   // Schedule tasks to be run on the server.
   // Five asterisks ('* * * * *') represents the crontab default of running every minute.

   // Schedule fot specific pin
   // cron.schedule('* * * * *', function() {
   //    const dates = getDates();
   //    dates.forEach( date => {
   //    superagent
   //    .get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin')
   //    .query({ pincode: '416405', date: date })
   //    .end((err, res) => {
   //       if(err == null && res != null)
   //       {
   //       const sessions = res?.body?.sessions;
   //       if(sessions != null)
   //       {
   //          const availableSlots = sessions.filter(slot => slot.min_age_limit >= 18 && slot.available_capacity > 0);
   //          if(availableSlots.length > 0)
   //             sendMail(availableSlots);
   //       }
   //       }
   //    });
   //  });
   // })

    // Schedule fot specific district
    let count = 0;
    cron.schedule('* * * * *', function() {
      const dates = getDates();
      dates.forEach( date => {
      superagent
      .get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict')
      .query({ district_id: '373', date: date })
      .end((err, res) => {
         if(err == null && res != null)
         {
         const sessions = res?.body?.sessions;
         if(sessions != null)
         {
            const availableSlots = sessions.filter(slot => slot.min_age_limit == 18 && slot.available_capacity > 0);
            if(availableSlots.length > 0)
            {
            //console.log("\nAvailable : " , ++count)
            sendMail(availableSlots);
            }
         }
         }
      });
    });
   })

   // cron.schedule('*/2 * * * * *', function() {
   //    console.log("In Second");
   //  });
}

function getDates()
{
   let dates =[] ;
   for(let i=0;i<7;i++)
      {
      const date = DateTime.local().plus({ days: i });
      dates.push(date.toFormat('dd-MM-yyyy'));
      }
   return dates;
}

function sendMail(availableSlots) {
   let transport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
         user: 'somnathmore0000@gmail.com',
         pass: 'bpkujkrjhfxwnxlp'
      }
  });

  let text;
  for(let i =0;i<availableSlots.length;i++)
  {
   text = text + "\n\n" + "name : " + availableSlots[i].name + "\navailable capacity : " + availableSlots[i].available_capacity + "\n Pincode : " + availableSlots[i].pincode;
  }
  const message = {
   from: 'somnathmore0000@gmail.com', // Sender address
   to: 'somnathmore0000@gmail.com',         // List of recipients
   subject: 'Heyy! Vaccine is available : ' + availableSlots[0].date, // Subject line
   text: text // Plain text body
};
transport.sendMail(message, function(err, info) {
   if (err) {
     console.log(err)
   } else {
     console.log(info);
   }
});
}

function start()
{
   //await getDates();
   CheckForSlots();
}

(async () => {
    start();
})().catch((error) => {
});

