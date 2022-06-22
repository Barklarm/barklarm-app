import { State } from "../../types/State";
import { Observer } from "../../types/Observer";
import { CCTrayConfiguration } from "../../types/CCTrayConfiguration";
import { Status } from "../../types/Status";
import { XMLParser } from "fast-xml-parser"

export class CCTray implements Observer {
    private readonly url: string;
    private readonly alias: string;
    private readonly parser: XMLParser; 
    private readonly statusMap : any = {
        "Success": Status.SUCCESS,
        "Failure": Status.FAILURE,
        "Exception": Status.FAILURE,
        "Unknown": Status.NA,
    }

    constructor({ url, alias } : CCTrayConfiguration) {
        this.url = url;
        this.alias = alias;
        this.parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix : "",
            allowBooleanAttributes: true,
        });
    }

    public async getState(): Promise<State> {
        const response = await fetch(
            this.url,
            {
                method:'GET',
            })
        if(!response.ok)
            return {
                name: this.alias,
                status: Status.NA,
            };
        const projects = this.parser.parse(await response.text()).Projects;
        const project = projects.Project
        if(project.activity !== "Sleeping")
            return {
                name: this.alias,
                status: Status.CHECKING,
            };
        return {
            name: this.alias,
            status: this.statusMap[project.lastBuildStatus],
        };
    }
}