export interface Subject {
    id: string;
    name: string;
    teacher: {
        id: string;
        name: string;
        email: string;
    };
    classroom: string;
    difficulty: number; // 1 a 5
}  