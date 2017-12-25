export class Alarm {
    
    constructor(
        public _id: string,
        public active : Boolean,
        public waketime: String,
        public duration : String,
        public color: string
    ){} 

    static CreateDefault(): Alarm {
        return new Alarm('', false, '', '', '');
    }
}
