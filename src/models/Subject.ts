export interface Subject {
    id: string;
    name: string;
    teacher: {
        id: string;
        name: string;
        email: string;
    };
    classroom: string;
    difficulty: number;
    userId: string;
    createdAt: Date;
    updatedAt?: Date;
}  