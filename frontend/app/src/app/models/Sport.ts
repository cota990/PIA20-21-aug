export class Sport {
    
    // name of the sport
    name: string;

    // name of the sport discpline
    discipline: string;

    // type of sport discpline: I - individual, T - team
    type: string;

    // maximum of allowed players for team sports
    maxPlayers: number;

    // minimum of allowed players for team sports
    minPlayers: number;

    // format of score
    scoreFormat: string;

    // list of allowed results
    allowedResults: Array<string>;

}