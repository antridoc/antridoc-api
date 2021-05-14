export enum QueueStatus {
    INIT = 'init',
    OPEN = 'open',
    CLOSE = 'close',
    PAUSED = 'paused',
    CANCELLED = 'cancelled', 
}

export enum PatientQueueStatus {
    WAITING = 'waiting',
    SKIPPED = 'skipped',
    PROCESSING = 'processing',
    SUCCESS = 'success',
    CANCELLED = 'cancelled',
}

export enum QueuePlatform {
    MOBILE = 'mobile',
    WEBSITE = 'website',
}

export function getAllQueueStatus(): string [] {
    var values = []
    for(let value in QueueStatus) {
        values.push(value);
    }

    return values
}