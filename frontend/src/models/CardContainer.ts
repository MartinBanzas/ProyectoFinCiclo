import { nanoid } from "nanoid";


class CardContainer {
    id: String;
    cards: [];
   
   
    constructor() {
        this.id=nanoid();
        this.cards=[];
    }
}


export default CardContainer;