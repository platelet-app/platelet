import { randomInt } from "crypto";

export const generateSecurePassword = (length = 16) => {
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lower = "abcdefghijkmnopqrstuvwxyz";
    const digits = "23456789";
    const symbols = "!@#$%^&*()-_=+";
    const all = upper + lower + digits + symbols;

    // Guarantee at least one of each class (Cognito's default policy needs all four)
    const chars = [
        upper[randomInt(upper.length)],
        lower[randomInt(lower.length)],
        digits[randomInt(digits.length)],
        symbols[randomInt(symbols.length)],
    ];

    for (let i = chars.length; i < length; i++) {
        chars.push(all[randomInt(all.length)]);
    }

    // Shuffle so the guaranteed characters aren't always at the start
    for (let i = chars.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    return chars.join("");
};
