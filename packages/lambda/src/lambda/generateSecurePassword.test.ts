import { generateSecurePassword } from "./generateSecurePassword.js";

const UPPER = /[ABCDEFGHJKLMNPQRSTUVWXYZ]/;
const LOWER = /[abcdefghijkmnopqrstuvwxyz]/;
const DIGIT = /[23456789]/;
const SYMBOL = /[!@#$%^&*()\-_=+]/;
const ALLOWED =
    /^[ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()\-_=+]+$/;

describe("generateSecurePassword", () => {
    it("returns the default length of 16", () => {
        expect(generateSecurePassword()).toHaveLength(16);
    });

    it("respects a custom length", () => {
        expect(generateSecurePassword(24)).toHaveLength(24);
        expect(generateSecurePassword(8)).toHaveLength(8);
    });

    it("contains at least one of each character class", () => {
        // Run many times since a single pass could luck out even with a broken shuffle
        for (let i = 0; i < 200; i++) {
            const pw = generateSecurePassword();
            expect(pw).toMatch(UPPER);
            expect(pw).toMatch(LOWER);
            expect(pw).toMatch(DIGIT);
            expect(pw).toMatch(SYMBOL);
        }
    });

    it("only uses characters from the allowed alphabet", () => {
        for (let i = 0; i < 200; i++) {
            expect(generateSecurePassword()).toMatch(ALLOWED);
        }
    });

    it("excludes ambiguous characters", () => {
        for (let i = 0; i < 200; i++) {
            expect(generateSecurePassword()).not.toMatch(/[Il1O0]/);
        }
    });

    it("does not produce duplicate passwords", () => {
        const passwords = new Set(
            Array.from({ length: 1000 }, () => generateSecurePassword())
        );
        expect(passwords.size).toBe(1000);
    });

    it("does not always place character classes in the same positions", () => {
        // Catches a missing/broken shuffle: without it, index 0 is always uppercase
        const firstChars = new Set(
            Array.from({ length: 100 }, () => generateSecurePassword()[0])
        );
        const classes = [UPPER, LOWER, DIGIT, SYMBOL].filter((re) =>
            [...firstChars].some((c) => re.test(c))
        );
        expect(classes.length).toBeGreaterThan(1);
    });
});
