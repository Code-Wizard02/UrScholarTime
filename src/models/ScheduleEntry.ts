export interface ScheduleClass {
    id: string;
    subjectId: string;
    day: string; // Monday, Tuesday, etc.
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
}  