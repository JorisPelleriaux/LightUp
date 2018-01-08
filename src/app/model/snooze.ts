export class Snooze {

    constructor(
        public _id: string,
        public snoozetime : String,
	public snooze : Boolean,
	public sensor : Boolean
    ){}

    static CreateDefault(): Snooze {
        return new Snooze('','', true, false);
    }
}

