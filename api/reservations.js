const express = require('express');
const router = express.Router();

const knex = require('knex')(require('../knexfile'));


router
    .get('/', (req, res, next) => {
        knex
            .select()
            .table('reservation')
            .then(data => {
                res.status(200).json(data);
            }).catch(e => {
            console.error(e);
            res.status(404).json(e)
        });
    })

    .get('/:reservationId', (req, res, next) => {
        const {reservationId} = req.params;

        knex.select()
            .from('reservation')
            .where({id: reservationId})
            .first()
            .then(data => {
                res.status(200).json(data);
            }).catch(e => {
            console.error(e);
            res.status(404).json(e)
        });
    })

    .post('/', (req, res, next) => {
        const {startDate, endDate, guests} = req.body;

        // TODO: use some 3r party lib for validation or move to helpers
        if (!startDate || typeof startDate !== 'string'
            || !endDate || typeof endDate !== 'string'
            || !guests || typeof guests !== 'number'
            || isNaN(guests) || !isFinite(guests)
            || guests <= 0
        ) {
            res.status(422).json({error: 'Incorrect data'});
            return;
        }

        // TODO: move 16 to config file
        if (guests > 16) {
            res.status(500).json({error: `Oops, we can't serve ${guests} guests!`});
            return;
        }

        findFreeTable(startDate, endDate, guests)
            .first()
            .then(data => {
                if (data) {
                    const {number} = data;

                    knex('reservation')
                        .insert({
                            'reservation_start': startDate,
                            'reservation_end': endDate,
                            guests,
                            'table_id': number
                    })
                    .then(data => {
                        const reservationId = data[0];
                        console.log(reservationId);
                        res.status(201).json({status: `reservation with id ${reservationId} created`});
                    })
                } else {
                    res.status(404).json({error: "Oops! We don't have free tables"})
                }
            }).catch(e => {
            console.error(e);
            res.status(500).json(e);
        });
    })

    // TODO: DRY - partially repeats POST method
    .put('/:reservationId', (req, res, next) => {
        const {reservationId} = req.params;
        const {startDate, endDate, guests} = req.body;

        if (!startDate || typeof startDate !== 'string'
            || !endDate || typeof endDate !== 'string'
            || !guests || typeof guests !== 'number'
            || isNaN(guests) || !isFinite(guests)
            || guests <= 0
        ) {
            res.status(422).json({error: 'Incorrect data'});
            return;
        }

        if (guests > 16) {
            res.status(500).json({error: `Oops, we can't serve ${guests} guests!`});
            return;
        }

        findFreeTable(startDate, endDate, guests)
            .then(data => {
                const table = data[0];

                if(table) {
                    const {number} = table;

                    knex('reservation')
                        .where({id: reservationId})
                        .update({
                            "reservation_start": startDate,
                            "reservation_end": endDate,
                            guests,
                            table_id: number
                        })

                        .then(_ => {
                            res.status(200).json({status: `reservation with id ${reservationId} updated`});
                        })
                        .catch(e => {
                            console.error(e);
                            res.status(500).json(e)
                        });
                } else {
                    res.status(404).json({error: "Oops! We don't have a free tables"})
                }
        });
    })

    .delete('/:reservationId', (req, res, next) => {
        const {reservationId} = req.params;

        knex('reservation')
            .where('id', reservationId)
            .del()
            .then(_ => {
                console.error(`reservation with id ${reservationId} deleted`);
                res.status(200).json({status: `reservation with id ${reservationId} deleted`});
            })
            .catch(e => {
                console.error(e);
                res.status(500).json(e)
            });
    });

// TODO: move to helpers
const findFreeTable = (startDate, endDate, guests) => knex
    .select()
    .from('table')
    .leftJoin('reservation', 'table.id', 'reservation.table_id')

    .where('capacity', '>=', guests)
    .andWhere({reservation_start: null, reservation_end: null})
    .orWhereNot({reservation_start: startDate, reservation_end: endDate})
    .orWhereNotBetween('reservation_start', [startDate, endDate])
    .andWhereNotBetween('reservation_end', [startDate, endDate])

    .orderBy('capacity', 'asc')
    .limit(1);

module.exports = router;
