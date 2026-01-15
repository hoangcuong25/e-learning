export { };

declare global {
    type UserType = {
        id: number;
        fullname: string;
        email: string;
        avatar: string;
        age: number;
        gender: string;
        dob: string;
        address: string;
        phone: string;
        isVerified: boolean;
        role: string;
        createdAt?: string;
        updatedAt?: string;
        createdBy?: string;
        updatedBy?: string;
    }

    type UserUpdateResponseType = {
        id: string;
        fullname: string;
        avatar: string;
        age: string;
        gender: genderEnum;
        dob: string;
        address: string;
        phone: string;
    }

    enum genderEnum {
        MALE = 'MALE',
        FEMALE = 'FEMALE',
        OTHER = 'OTHER'
    }

}