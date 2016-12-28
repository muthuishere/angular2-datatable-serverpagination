import {Component, OnInit} from "@angular/core";
import {Http} from "@angular/http";


@Component({
    selector: 'app',
    templateUrl: 'app/app.component.html'
})
export class AppComponent implements OnInit {

    public pseudoServer = [];
    public data = [];
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "email";
    public sortOrder = "asc";
    public amountOfRows = 0;

    constructor(private http: Http) {
    }

    ngOnInit(): void {
        this.http.get("/app/data.json")
            .subscribe((data) => {
                setTimeout(() => {
                    this.pseudoServer = data.json();
                    this.load(1);
                }, 2000);
            });
    }

    public load(page: number) {
        this.data = [];
        this.amountOfRows = this.pseudoServer.length;
        let start = page * this.rowsOnPage;
        this.data = this.pseudoServer.slice(start, start + this.rowsOnPage);

    }

    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    };

    public remove(item) {
        let index = this.data.indexOf(item);
        if (index > -1) {
            this.data.splice(index, 1);
        }
    }

    public onPageChange(event) {
        this.rowsOnPage = event.rowsOnPage;
        this.load(event.activePage);
    }

}