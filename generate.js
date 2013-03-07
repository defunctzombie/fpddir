var https = require('http');
var split = require('split');
var jsonstream = require('jsonstream');

var opt = {
    host: 'www.fededirectory.frb.org',
    path: '/fpddir.txt'
};

https.get(opt, function(res) {
    res.setEncoding('utf8');

    var stream = res.pipe(split(function(line) {
        var self = this;
        var info = {
            routing: line.slice(0, 9),
            tele_name: line.slice(9, 27).trim(),
            name: line.slice(27, 63).trim(),
            state: line.slice(63, 65).trim(),
            city: line.slice(65, 90).trim(),
            tx_status: line.slice(90, 91).trim(),
            settlement_only: line.slice(91, 92).trim(),
            book_entry_status: line.slice(92, 93).trim(),
            last_rev_date: line.slice(93, 101).trim()
        }

        if (!info.settlement_only) {
            delete info.settlement_only;
        }

        if (!info.last_rev_date) {
            delete info.last_rev_date;
        }

        return info;
    })).pipe(jsonstream.stringify('[\n', ',\n', '\n]\n')).pipe(process.stdout);
});

