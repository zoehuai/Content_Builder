export class AlreadyExistsError {
    static message(message: string): void {
        internalSystem.error(`${message} already exists.`);
    }
}