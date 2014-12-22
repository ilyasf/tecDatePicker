//date time picker for jquery mobile made by ilyas fasikhov ICL 2014
$(function() {
    "use strict";
    $("input[data-role='tec-date']").bind("tap", dateTimePickerInit);

    var langConstants = datePickerLangPack;
    var dialogueStack = {};
    var createUniqueId = function () {
        var ID_PREFIX = 'tec-dialogue-',
            i = 0;
        while (dialogueStack.hasOwnProperty(ID_PREFIX + i)) {
            i++;
        }
        return ID_PREFIX + i;
    };

    var tecDateTimePicker = function (el) {
        this.inputEl = el;
        this.dialogueInit = false;
        this.id = createUniqueId();
        this.defDateFormat = 'd.m.Y';
        dialogueStack[this.id] = this;
        this.getId = function () {
            return this.id;
        };

        this.show = function () {
            if (this.dialogueInit === false) {
                this.createDateDialog();
            }
            this.showDialogue();
            this.setDialogueValue();
        };

        this.createDateDialog = function () {
            var pageContent = $.mobile.activePage.find("div[data-role='content']:visible:visible");
            pageContent.append(this.getPopupTemplate());
            this.dateDialog = $('.tec-date-picker-dialogue').popup({
                corners: false
            });
            this.dialogueInit = true;
            this.initEvents();
        };

        this.initEvents = function () {
            $('div[data-picker-id=' + this.getId() + ']').bind( "tap", this.listenEvents.bind(this));
        };

        this.listenEvents = function (event) {
            var target = $(event.target);
            switch (target.attr('class')) {
                case 'data-picker-cancel-btn':
                    this.closeDialogue();
                    break;
                case 'data-picker-arrow-up':
                    this.upValue(target);
                    break;
                case 'data-picker-arrow-down':
                    this.downValue(target);
                    break;
                case 'data-picker-success-btn':
                    this.saveValue();
                    break;
                default:
                    break;
            }
        };

        this.upValue = function (el) {
            var td = el.parent();
            switch (td.index()) {
                case 0:
                    this.incrementDate();
                    break;
                case 1:
                    this.incrementMonth();
                    break;
                case 2:
                    this.incrementYear();
                    break;
                default:
                    break;
            }
        };

        this.downValue = function (el) {
            var td = el.parent();
            switch (td.index()) {
                case 0:
                    this.decrementDate();
                    break;
                case 1:
                    this.decrementMonth();
                    break;
                case 2:
                    this.decrementYear();
                    break;
                default:
                    break;
            }
        };

        this.maxDateCount = function (m, y) {
            if (m === 1) {
                if (y % 4 == 0) {
                    if (y % 100 == 0) {
                        if (y % 400 == 0) {
                            return 29;
                        } else {
                            return 28;
                        }
                    } else {
                        return 29;
                    }
                } else {
                    return 28;
                }
            } else if ([0, 2, 4, 6, 7, 9, 11].indexOf(m) !== -1) {
                return 31;
            } else {
                return 30;
            }
        };

        this.incrementDate = function () {
            var date = this.getDate(),
                month = this.getMonth(),
                year = this.getYear();

            if (date < this.maxDateCount(month, year)) {
                date++;
            } else {
                date = 1;
            }
            this.setDate(date);
        };

        this.decrementDate = function () {
            var date = this.getDate(),
                month = this.getMonth(),
                year = this.getYear();
            if (date <= 1) {
                date = this.maxDateCount(month, year);
            } else {
                date--;
            }
            this.setDate(date);
        };

        this.incrementMonth = function () {
            var date = this.getDate(),
                month = this.getMonth(),
                year = this.getYear();
            if (month < 11) {
                month ++;
            } else {
                month = 0;
            }
            if (date > this.maxDateCount(month, year)) {
                this.setDate(this.maxDateCount(month, year));
            }
            this.setMonth(month);
        };

        this.decrementMonth = function () {
            var date = this.getDate(),
                month = this.getMonth(),
                year = this.getYear();
            if (month <= 0 ) {
                month = 11;
            } else {
                month--;
            }
            if (date > this.maxDateCount(month, year)) {
                this.setDate(this.maxDateCount(month, year));
            }
            this.setMonth(month);
        };

        this.incrementYear = function () {
            var year = this.getYear();
            this.setYear(++year);
        };

        this.decrementYear = function () {
            var year = this.getYear();
            year--;
            if (year < 0) {
                year = 0;
            }
            this.setYear(year);
        };

        this.getDate = function () {
            return Number($($('div[data-picker-id=' + this.getId() + '] .data-picker-value-row td')[0]).text());
        };

        this.setDate = function (val) {
            $($('div[data-picker-id=' + this.getId() + '] .data-picker-value-row td')[0]).text(val);
            return this;
        };

        this.getMonth = function () {
            var monthText = $($('div[data-picker-id=' + this.getId() + '] .data-picker-value-row td')[1]).text();
            return langConstants.months.indexOf(monthText);
        };

        this.setMonth = function (val) {
            $($('div[data-picker-id=' + this.getId() + '] .data-picker-value-row td')[1]).text(langConstants.months[val]);
            return this;
        };

        this.getYear = function () {
            return Number($($('div[data-picker-id=' + this.getId() + '] .data-picker-value-row td')[2]).text());
        };

        this.setYear = function (val) {
            $($('div[data-picker-id=' + this.getId() + '] .data-picker-value-row td')[2]).text(val);
        };

        this.closeDialogue = function () {
            this.dateDialog.popup("close");
        };

        this.saveValue = function () {
            var date = this.getDate(),
                month = this.getMonth(),
                year = this.getYear();
            this.inputEl.val(this.toFormatDate(date, month, year));
            this.closeDialogue();
        };

        this.setDialogueValue = function () {
            var val = this.inputEl.val(),
                values;
            if (val) {
                values = this.parseDate(val, this.inputEl.attr('date-format') || this.defDateFormat);
                this.setDate(values.date);
                this.setMonth(values.month);
                this.setYear(values.year);
            }
        };

        this.parseDate = function (date, format) {
            var result = {},
                dPos = format.indexOf('d'),
                mPos = format.indexOf('m'),
                yPos = format.indexOf('Y'),
                getWrapper = function (pos, f) {
                    var res = '';
                    if (pos === -1) {
                        return false;
                    } else {
                        if (pos === 0) {
                            res = '^([^\\' + f[pos + 1] +']+)\\' + f[pos + 1];
                        } else if (f[pos + 1] === undefined) {
                            res = '\\' + f[pos - 1] + '([^\\' + f[pos - 1] + ']+)$';
                        } else {
                            res = '\\' + f[pos - 1] + '([^\\' + f[pos - 1] + ']+)\\' + f[pos + 1];
                        }
                    }
                    return res;
                },
                dWrapper = getWrapper(dPos, format),
                mWrapper = getWrapper(mPos, format),
                yWrapper = getWrapper(yPos, format),
                tmpDate = new Date();
            if (dWrapper == false) {
                result.date = tmpDate.getDate();
            } else {
                result.date = Number(date.match(dWrapper)[1]);
            }
            if (mWrapper == false) {
                result.month = tmpDate.getMonth();
            } else {
                result.month = (Number(date.match(mWrapper)[1]) - 1);
            }
            if (yWrapper == false) {
                result.year = tmpDate.getFullYear();
            } else {
                result.year = Number(date.match(yWrapper)[1]);
            }
            return result;
        };

        this.toFormatDate = function (d, m, y) {
            var format = this.inputEl.attr('date-format') || this.defDateFormat,
                date;
            m++;
            if (m < 10) {
                m = '0' + m;
            }
            date = format.replace('d', d);
            date = date.replace('m', m);
            date = date.replace('Y', y);
            return date;
        };

        this.showDialogue = function () {
            this.dateDialog.popup("open", {
                transition: 'slideup'
            });
        };

        this.getPopupTemplate = function () {
            var date = new Date();
            return '<div data-role="popup" class="tec-date-picker-dialogue ui-popup" data-shadow="false" style="width: ' + this.getWidth() + 'px;" data-picker-id="' + this.getId() + '">' +
                        '<div class="data-picker-body">' + langConstants.headerText + '</div>' +
                        '<div class="data-picker-content">' +
                            '<table data-role="table" class="ui-responsive">' +
                                '<thead><tr>' +
                                    '<th data-priority="1"></th><th></th><th data-priority="1"></th>' +
                                '</tr></thead>' +
                                '<tbody>' +
                                    '<tr>' +
                                        '<td><div class="data-picker-arrow-up"></div></td>' +
                                        '<td><div class="data-picker-arrow-up"></div></td>' +
                                        '<td><div class="data-picker-arrow-up"></div></td>' +
                                    '</tr>' +
                                    '<tr class="data-picker-value-row">' +
                                        '<td>' + date.getDate() + '</td>' +
                                        '<td>' + langConstants.months[date.getMonth()] + '</td>' +
                                        '<td>' + date.getFullYear() + '</td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<td><div class="data-picker-arrow-down"></div></td>' +
                                        '<td><div class="data-picker-arrow-down"></div></td>' +
                                        '<td><div class="data-picker-arrow-down"></div></td>' +
                                    '</tr>' +
                                '</tbody>' +
                            '</table>' +
                        '</div>' +
                        '<div class="data-picker-footer">' +
                            '<div class="data-picker-cancel-btn">' + langConstants.cancel + '</div>' +
                            '<div class="data-picker-success-btn">' + langConstants.ok + '</div>' +
                        '</div>' +
                    '</div>';
        };

        this.getWidth = function () {
            return $.mobile.activePage.find("div[data-role='content']:visible:visible").width() - 10;
        };
    };

    function dateTimePickerInit (event) {
        event.preventDefault();
        var inputEl = $(this);//converted jQuery object
        if (!inputEl.attr('date-dialogue-id')) {
            inputEl.attr('date-dialogue-id', function () {
                var dialogue = new tecDateTimePicker(inputEl);
                return dialogue.getId();
            });
        }
        dialogueStack[inputEl.attr('date-dialogue-id')].show();
        return false;
    }
});