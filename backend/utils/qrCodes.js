const mongoose = require("mongoose");

const QR_DATABASE_NAME = process.env.QR_DATABASE_NAME || "ellehacks";
const QR_COUNTER_ID = "27";
const LEGACY_QR_COUNTER_ID = "qr-h-27";
const MAX_QR_SEQUENCE = 999;

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getQrDatabase = async () => {
    await mongoose.connection.asPromise();
    return mongoose.connection.useDb(QR_DATABASE_NAME, { useCache: true }).db;
};

const nextQrCodeId = async () => {
    const counters = (await getQrDatabase()).collection("qrcounters");
    const legacyCounter = await counters.findOne({ _id: LEGACY_QR_COUNTER_ID });

    if (legacyCounter) {
        if (!Number.isSafeInteger(legacyCounter.sequence) || legacyCounter.sequence < 0) {
            throw new Error("The legacy QR counter has an invalid sequence value.");
        }

        const migrationUpdate = {
            $max: { sequence: legacyCounter.sequence }
        };
        if (legacyCounter.v !== undefined) {
            migrationUpdate.$setOnInsert = { v: legacyCounter.v };
        }
        await counters.updateOne(
            { _id: QR_COUNTER_ID },
            migrationUpdate,
            { upsert: true }
        );
        await counters.deleteOne({
            _id: LEGACY_QR_COUNTER_ID,
            sequence: legacyCounter.sequence
        });
    }

    const currentCounter = await counters.findOne({ _id: QR_COUNTER_ID });
    if (currentCounter && (!Number.isSafeInteger(currentCounter.sequence) || currentCounter.sequence < 0)) {
        throw new Error("The QR counter has an invalid sequence value.");
    }
    if (currentCounter?.sequence >= MAX_QR_SEQUENCE) {
        throw new Error("The three-digit QR ID sequence is exhausted.");
    }

    let result;
    try {
        result = await counters.findOneAndUpdate(
            { _id: QR_COUNTER_ID, sequence: { $lt: MAX_QR_SEQUENCE } },
            { $inc: { sequence: 1 } },
            { upsert: true, returnDocument: "after" }
        );
    } catch (error) {
        if (error.code === 11000) {
            throw new Error("The three-digit QR ID sequence is exhausted.");
        }
        throw error;
    }

    const counter = result?.value || result;
    if (!Number.isSafeInteger(counter?.sequence) || counter.sequence < 1) {
        throw new Error("Unable to allocate a QR ID from the database counter.");
    }

    return `${QR_COUNTER_ID}${String(counter.sequence).padStart(3, "0")}`;
};

const upsertScannerAttendee = async (application) => {
    const email = (application.user?.email || application.email || "").trim().toLowerCase();
    if (!email) {
        throw new Error("Cannot create a scanner attendee without an email address.");
    }

    const applicationId = application._id.toString();
    const attendees = (await getQrDatabase()).collection("attendees");
    const existingAttendee = await attendees.findOne({
        email: { $regex: `^${escapeRegex(email)}$`, $options: "i" }
    });
    const uuid = existingAttendee?.uuid || applicationId;
    const attendee = {
        uuid,
        qrCodeId: application.qrCodeId,
        email,
        firstName: application.firstName || "",
        lastName: application.lastName || "",
        preferredFirstName: application.preferredFirstName || "",
        pronouns: application.pronouns || "",
        school: application.school || "",
        dietaryRestrictions: application.dietaryRestrictions || [],
        otherDietary: application.otherDietary || "",
        tshirtSize: application.tshirtSize || "",
        overnightAccommodation: application.overnightAccommodation === "Yes"
    };

    await attendees.updateOne(
        existingAttendee ? { _id: existingAttendee._id } : { uuid },
        {
            $set: attendee,
            $setOnInsert: { attendance: {} }
        },
        { upsert: true }
    );
};

module.exports = { nextQrCodeId, upsertScannerAttendee };
