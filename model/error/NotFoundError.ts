export class NotFoundError {
    static message(message: string) {
        internalSystem.error(`${message} not found.`);
    }
}