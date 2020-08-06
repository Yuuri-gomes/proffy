import { Request, Response } from 'express';
import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

interface scheduleItem {
    week_day: number;
    from: string;
    to: string;
}



export default class ClassesController {
    async index (req: Request, res: Response) {
        const filters = req.query;

        if(!filters.week_day || !filters.subject || !filters.time) {
            return res.status(400).json({
                error: 'Missing filters to search classes'
            });
        }

        const timeInMinutes = convertHourToMinutes(filters.time as string);

        const classes = await db('classes')
        .whereExists(function() {
            this.select('classes_schedule.*')
            .from('classes_schedule')
            .whereRaw('`classes_schedule`.`classe_id` = `classes`.`id`')
            .whereRaw('`classes_schedule`.`week_day` = ??', [Number(filters.week_day)])
            .whereRaw('`classes_schedule`.`from` <= ??', [timeInMinutes])
            .whereRaw('`classes_schedule`.`to` > ??', [timeInMinutes])
        })
        .where('classes.subject', '=', filters.subject as string)
        .join('users', 'classes.user_id', '=', 'users.id')
        .select(['classes.*', 'users.*']);



        return res.status(200).json(classes);

        res.send();
        
    }

    async create (req: Request, res: Response)  {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = req.body;
    
        const trx = await db.transaction();
    
        try {
            const insertedUsersIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio
            });
        
            const user_id = insertedUsersIds[0];
        
            const insertedClassesIds = await trx('classes').insert({
                subject,
                cost,
                user_id,
            });
        
            const classe_id = insertedClassesIds[0];
        
            const classeSchedule = schedule.map((scheduleItem : scheduleItem) => {
                return {
                    classe_id,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to)
                }
            }) 
        
            await trx('classes_schedule').insert(classeSchedule);
        
            await trx.commit();
        
            return res.status(201).json({message: "FÉ FÉ FÉ"});
    
        } catch (err) {
            trx.rollback();
            return res.status(400).json({message: 'Unexpected error while creating new class'});
        }
        
    }
}