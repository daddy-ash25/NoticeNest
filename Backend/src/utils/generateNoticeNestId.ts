import crypto from "crypto";

const generateNoticeNestId = (): string => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let randomPart = "";

    for (let i = 0; i < 8; i++) {
        const randomIndex = crypto.randomInt(0, characters.length);
        randomPart += characters[randomIndex];
    }

    return `NN${randomPart}`;
};

export default generateNoticeNestId;