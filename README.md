<div align="center">
<h2>HomeDrop Assignment</h2>
</div>

<div align="center">
  <h3>Description</h3>
  <p><b>/auth</b> : Authenticate a user with “phone” and return a JWT token.This JWT token will be further used to do the below API calls.</p>
  <p><b>/send-report</b> : This API will take JWT token in headers and phone/email in body and return success. It’s task is to dynamically generate a PDF with contents (Current Date and Time, and user phone number) and send it to the given phone/email</p>
  <p><b>/get-history</b> : Get all sent history of that particular user (identified by the JWT token)</p>
</div>

<div align="center">
  <h3>Tech Stack</h3>
  <p>Node.js | AWS Lambda | AWS API Gateway</p>
</div>

<div align="center">
  <h3>Packages</h3>
  <p>Nodemailer | PDFKit | Express | Mongoose | jsonwebtoken | dotenv | serverless | serverless-http | nodemon</p>
</div>
<br>
<hr>

<div align="center">
  <h3><b>Backend Deployed Link</b>: https://e5d5f6sggc.execute-api.us-east-1.amazonaws.com/dev/</h3>
</div>
