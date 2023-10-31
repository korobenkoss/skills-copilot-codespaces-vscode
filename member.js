function skillsMember() {
    var member = require('express').Router();
    var mysql = require('mysql');
    var bodyParser = require('body-parser');
    var jsonParser = bodyParser.json();
    var urlencodedParser = bodyParser.urlencoded({ extended: false });
    var db = require('../lib/db')();
    var conn = db.init();

    member.get('/', function(req, res) {
        var id = req.session.passport.user.id;
        var sql = 'SELECT * FROM skill WHERE id = ?';
        conn.query(sql, [id], function(err, skills, fields) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.render('member', { skills: skills, id: id });
            }
        });
    });

    member.post('/', urlencodedParser, function(req, res) {
        var id = req.session.passport.user.id;
        var skill = req.body.skill;
        var sql = 'INSERT INTO skill (id, skill) VALUES (?, ?)';
        conn.query(sql, [id, skill], function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.redirect('/member');
            }
        });
    });

    member.delete('/', jsonParser, function(req, res) {
        var id = req.session.passport.user.id;
        var skill = req.body.skill;
        var sql = 'DELETE FROM skill WHERE id = ? AND skill = ?';
        conn.query(sql, [id, skill], function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.status(200).send('Success');
            }
        });
    });

    return member;
}