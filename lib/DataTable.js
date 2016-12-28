"use strict";
var core_1 = require("@angular/core");
var _ = require("lodash");
var Rx_1 = require("rxjs/Rx");
var DataTable = (function () {
    function DataTable(differs) {
        this.differs = differs;
        this.inputData = [];
        this.sortBy = "";
        this.sortOrder = "asc";
        this.rowsOnPage = 1000;
        this.activePage = 1;
        this.amountOfRows = 0;
        this.sortByChange = new core_1.EventEmitter();
        this.sortOrderChange = new core_1.EventEmitter();
        this.onPageChange = new core_1.EventEmitter();
        this.mustRecalculateData = false;
        this.onSortChange = new Rx_1.ReplaySubject(1);
        this.diff = differs.find([]).create(null);
    }
    DataTable.prototype.getSort = function () {
        return { sortBy: this.sortBy, sortOrder: this.sortOrder };
    };
    DataTable.prototype.setSort = function (sortBy, sortOrder) {
        if (this.sortBy !== sortBy || this.sortOrder !== sortOrder) {
            this.sortBy = sortBy;
            this.sortOrder = _.includes(["asc", "desc"], sortOrder) ? sortOrder : "asc";
            this.mustRecalculateData = true;
            this.onSortChange.next({ sortBy: sortBy, sortOrder: sortOrder });
            this.sortByChange.emit(this.sortBy);
            this.sortOrderChange.emit(this.sortOrder);
        }
    };
    DataTable.prototype.getPage = function () {
        return { activePage: this.activePage, rowsOnPage: this.rowsOnPage, dataLength: this.amountOfRows };
    };
    DataTable.prototype.setPage = function (activePage, rowsOnPage) {
        if (this.rowsOnPage !== rowsOnPage || this.activePage !== activePage) {
            this.activePage = this.activePage !== activePage ? activePage : this.calculateNewActivePage(this.rowsOnPage, rowsOnPage);
            this.rowsOnPage = rowsOnPage;
            this.mustRecalculateData = true;
            this.onPageChange.emit({
                activePage: this.activePage,
                rowsOnPage: this.rowsOnPage,
                dataLength: this.amountOfRows
            });
        }
    };
    DataTable.prototype.calculateNewActivePage = function (previousRowsOnPage, currentRowsOnPage) {
        var firstRowOnPage = (this.activePage - 1) * previousRowsOnPage + 1;
        var newActivePage = Math.ceil(firstRowOnPage / currentRowsOnPage);
        return newActivePage;
    };
    DataTable.prototype.recalculatePage = function () {
        var lastPage = Math.ceil(this.amountOfRows / this.rowsOnPage);
        this.activePage = lastPage < this.activePage ? lastPage : this.activePage;
        this.activePage = this.activePage || 1;
        this.onPageChange.emit({
            activePage: this.activePage,
            rowsOnPage: this.rowsOnPage,
            dataLength: this.amountOfRows
        });
    };
    DataTable.prototype.ngOnChanges = function (changes) {
        if (changes["rowsOnPage"]) {
            this.rowsOnPage = changes["rowsOnPage"].previousValue;
            this.setPage(this.activePage, changes["rowsOnPage"].currentValue);
            this.mustRecalculateData = true;
        }
        if (changes["sortBy"] || changes["sortOrder"]) {
            if (!_.includes(["asc", "desc"], this.sortOrder)) {
                console.warn("angular2-datatable: value for input mfSortOrder must be one of ['asc', 'desc'], but is:", this.sortOrder);
                this.sortOrder = "asc";
            }
            if (this.sortBy) {
                this.onSortChange.next({ sortBy: this.sortBy, sortOrder: this.sortOrder });
            }
            this.mustRecalculateData = true;
        }
        if (changes["inputData"]) {
            this.inputData = changes["inputData"].currentValue || [];
            this.recalculatePage();
            this.mustRecalculateData = true;
        }
    };
    DataTable.prototype.ngDoCheck = function () {
        var changes = this.diff.diff(this.inputData);
        if (changes) {
            this.recalculatePage();
            this.mustRecalculateData = true;
        }
        if (this.mustRecalculateData) {
            this.fillData();
            this.mustRecalculateData = false;
        }
    };
    DataTable.prototype.fillData = function () {
        var data = this.inputData;
        var sortBy = this.sortBy;
        if (typeof sortBy === 'string' || sortBy instanceof String) {
            data = _.orderBy(data, this.caseInsensitiveIteratee(sortBy), [this.sortOrder]);
        }
        else {
            data = _.orderBy(data, sortBy, [this.sortOrder]);
        }
        this.data = data;
    };
    DataTable.prototype.caseInsensitiveIteratee = function (sortBy) {
        return function (row) {
            var value = row;
            for (var _i = 0, _a = sortBy.split('.'); _i < _a.length; _i++) {
                var sortByProperty = _a[_i];
                value = value[sortByProperty];
            }
            if (value && typeof value === 'string' || value instanceof String) {
                return value.toLowerCase();
            }
            return value;
        };
    };
    DataTable.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'table[mfData]',
                    exportAs: 'mfDataTable'
                },] },
    ];
    DataTable.ctorParameters = function () { return [
        { type: core_1.IterableDiffers, },
    ]; };
    DataTable.propDecorators = {
        'inputData': [{ type: core_1.Input, args: ["mfData",] },],
        'sortBy': [{ type: core_1.Input, args: ["mfSortBy",] },],
        'sortOrder': [{ type: core_1.Input, args: ["mfSortOrder",] },],
        'rowsOnPage': [{ type: core_1.Input, args: ["mfRowsOnPage",] },],
        'activePage': [{ type: core_1.Input, args: ["mfActivePage",] },],
        'amountOfRows': [{ type: core_1.Input, args: ["mfAmountOfRows",] },],
        'sortByChange': [{ type: core_1.Output, args: ["mfSortByChange",] },],
        'sortOrderChange': [{ type: core_1.Output, args: ["mfSortOrderChange",] },],
        'onPageChange': [{ type: core_1.Output, args: ["mfOnPageChange",] },],
    };
    return DataTable;
}());
exports.DataTable = DataTable;
//# sourceMappingURL=DataTable.js.map