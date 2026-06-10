import "dotenv/config";
import { sendMail } from "./services/emailService.js";

try {
  const result = await sendMail({
    to: "kritarthsingh87@gmail.com",
    subject: "StudySwap SMTP Test",
    text: "SMTP is working successfully!"
  });

  console.log("Email Result:", result);
} catch (error) {
  console.error("Email Error:", error);
}