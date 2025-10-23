export class AppsyncFailure extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AppsyncFailure";
    }
}
