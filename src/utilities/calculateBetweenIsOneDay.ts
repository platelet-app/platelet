// Parameters may be declared in a variety of syntactic forms
/**
 * @param timePrimary - the time in HH:mm format.
 * @param timeSecondary - the time in HH:mm format.
 */

export const calculateBetweenIsOneDay = (
    timePrimary?: string | null,
    timeSecondary?: string | null
) => {
    if (!timePrimary || !timeSecondary) {
        return false;
    }
    const hourPrimary = timePrimary.split(":")[0];
    const hourSecondary = timeSecondary.split(":")[0];

    if (hourPrimary === hourSecondary) {
        const minutePrimary = timePrimary.split(":")[1];
        const minuteSecondary = timeSecondary.split(":")[1];
        if (minutePrimary > minuteSecondary) {
            return true;
        }
    }

    return hourPrimary > hourSecondary;
};
