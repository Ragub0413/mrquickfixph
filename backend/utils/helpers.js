import nodemailer from 'nodemailer';
import { v2 as cloudinary } from 'cloudinary';

// Function to generate a 6-digit OTP
export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString(); 
};

// Function to send emails
export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, 
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD 
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
    });

    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};


//Function for single upload
export const upload_JobQuotation_File_Single = async(buffer)=>{
  cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUD,
    api_secret: process.env.API_SECRET_CLOUD
  })
  try{
    const job_file = await new Promise((resolve,reject)=>{
      cloudinary.uploader.upload_stream((err,results)=>{
        if(err) throw err;

        const {url,public_id} = results;
        const datas= {
          url : url,
          public_id: public_id
        }
        resolve(results)
      })
      .end(buffer)
    })
    return job_file;
  }
  catch(error){
    console.error('Error sending email:', error);
    throw error;
  }
}