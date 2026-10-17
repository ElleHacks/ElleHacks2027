// Usage: npm run make-admin -- someone@example.com
// The person must create an account through the sign up page first.
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../models/userModel");

dotenv.config();

const main = async () => {
    const email = process.argv[2]?.trim().toLowerCase();
    if (!email) {
        console.error("Usage: npm run make-admin -- <email>");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOneAndUpdate(
        { email },
        { role: "admin" },
        { returnDocument: "after" }
    );
    await mongoose.disconnect();

    if (!user) {
        console.error(`No account found for ${email}. Sign up first, then rerun this.`);
        process.exit(1);
    }
    console.log(`✅ ${email} is now an admin.`);
};

main();
