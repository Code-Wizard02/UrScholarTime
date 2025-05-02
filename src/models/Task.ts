export interface Task {
    id: string;
    name: string;
    subjectId: string;
    difficulty: number; // 1 a 5
    deadline: Date;
    createdAt: Date;
    deliveryDate?: Date; 
    completed: boolean;
}