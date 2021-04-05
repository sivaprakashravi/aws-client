export class User {
    LAST_NAME: string;
    FIRST_NAME: string;
    EMAIL_ID: string;
    PHONE: number;
    ROLE: string;
    constructor(obj?: User) {
            this.LAST_NAME = obj.LAST_NAME;
            this.FIRST_NAME = obj.FIRST_NAME;
            this.EMAIL_ID = obj.EMAIL_ID;
            this.PHONE = obj.PHONE;
            this.ROLE = obj.ROLE;
        }
    }
