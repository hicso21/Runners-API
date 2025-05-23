import LogsServices from '../../../services/v1/Logs/logs.services.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import crypto from 'crypto';
import encrypt from '../../../utils/functions/encrypt.js';
import decrypt from '../../../utils/functions/decrypt.js';
import GroupsServices from '../../../services/v1/Groups/groups.services.js';
import fetchBrevo from '../../../utils/fetches/fetchBrevo.js';
import divideName from '../../../utils/functions/divideName.js';
import axios from 'axios';
import brevoConfig from '../../../config/brevo.config.js';
import toStringWithSpecialChars from '../../../utils/functions/toStringWithSpecialChars.js';
import creatingProcess from '../../../utils/functions/creatingProcess.js';

export default class RunnersControllers {
    static async getAll(req, res) {
        try {
            const runners = await RunnersServices.getAll();
            res.status(200).send({ error: false, data: runners });
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const runner = await RunnersServices.getById(id);
            res.status(200).send({ error: false, data: runner });
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async getByEmail(req, res) {
        try {
            const { email } = req.params;
            const runner = await RunnersServices.getByEmail(email);
            res.status(200).send({ error: false, data: runner });
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async getByBrandId(req, res) {
        try {
            const { brand_id } = req.params;
            const runner = await RunnersServices.getByBrandId(brand_id);
            res.status(200).send({ error: false, data: runner });
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async getRunnerByEmailAndPassword(req, res) {
        try {
            const { email, password } = req.body;
            const runner = await RunnersServices.getByEmail(email);
            if (runner == null)
                return res.send({
                    error: true,
                    data: "This email doesn't exist",
                });
            const passwordDecrypted = decrypt(
                runner.password.cipherText,
                runner.password.key,
                runner.password.iv
            );
            if (passwordDecrypted == password)
                return res.send({ error: false, data: runner });
            else
                return res.send({
                    error: true,
                    data: "The password isn't correct",
                });
        } catch (error) {
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async register(req, res) {
        try {
            const body = req.body;
            console.log(body);
            const anotherRunner = await RunnersServices.getByEmail(body?.email);
            if (anotherRunner != null)
                return res.send({
                    error: true,
                    data: 'Another runner is registered with this email',
                });
            const { firstname, lastname } = divideName(body.name);
            const options = {
                method: 'POST',
                url: 'https://api.brevo.com/v3/contacts',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    'api-key': process.env.brevo_api_key,
                },
                data: {
                    email: body?.email,
                    attributes: {
                        FIRSTNAME: toStringWithSpecialChars(firstname),
                        LASTNAME: toStringWithSpecialChars(lastname),
                    },
                },
            };
            const { data } = await axios.request(options);
            const runnerData = {
                ...body,
                password: encrypt(body.password),
                brevo_id: `${data.id}`,
                brand_id: '',
                refresh_token: '',
                access_token: '',
            };
            const runner = await RunnersServices.create(runnerData);
            await creatingProcess(runner._id);
            console.log(runner);
            res.status(201).send({ error: false, data: runner });
        } catch (error) {
            console.log(error);
            await LogsServices.create(
                'newRunner error',
                'Error when trying to create user',
                error
            );
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const runner = await RunnersServices.getByEmail(email);
            if (runner == null)
                return res.status(200).send({
                    error: true,
                    data: 'There is no runner with that email address.',
                    exist: false,
                });
            const passwordDecrypted = decrypt(
                runner.password.cipherText,
                runner.password.key,
                runner.password.iv
            );
            if (passwordDecrypted !== password) {
                return res.send({
                    error: true,
                    data: 'Incorrect Password.',
                    exist: false,
                });
            }
            res.send({
                error: false,
                data: runner,
                exist: true,
            });
        } catch (error) {
            await LogsServices.create(
                'login error',
                'Error when trying to login',
                error
            );
            console.log(error);
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async resetPassword(req, res) {
        try {
            const data = req.body;
            const { email, password: newPassword } = data;
            const runner = await RunnersServices.getByEmail(email);
            if (runner == null)
                return res.status(200).send({
                    error: true,
                    data: 'There is no runner with that email address.',
                    exist: false,
                });
            const updatedRunner = await RunnersServices.changePassword(
                runner._id,
                encrypt(newPassword)
            );
            if (
                decrypt(
                    updatedRunner.password.cipherText,
                    updatedRunner.password.key,
                    updatedRunner.password.iv
                ) != newPassword
            )
                return res.status(400).send({
                    error: true,
                    data: "An error has ocurred, the password wasn't changed.",
                });
            res.status(200).send({
                error: false,
                data: updatedRunner,
            });
        } catch (error) {
            await LogsServices.create(
                'resetPassword error',
                'Error when trying to update user data',
                error
            );
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async updateRunnerGroup(req, res) {
        const { id } = req.params;
        const { group } = req.body;
        try {
            const runner = await RunnersServices.getById(id);
            const oldGroupId = runner?.group;
            await GroupsServices.deleteUserFromGroup(oldGroupId, id);
            await GroupsServices.addUserFromGroup(group, id);
            const updatedRunner = await RunnersServices.updateGroup(id, {
                group,
            });
            res.status(200).send({ error: false, data: updatedRunner });
        } catch (error) {
            await LogsServices.create(
                'updateRunnerGroup error',
                'Error when trying to update user data',
                error
            );
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async updateRunner(req, res) {
        const { id } = req.params;
        const body = req.body;
        try {
            const updatedRunner = await RunnersServices.update(id, body);
            res.send({ error: false, data: updatedRunner });
        } catch (error) {
            await LogsServices.create(
                'updateRunner error',
                'Error when trying to update user data',
                error
            );
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async update(req, res) {
        try {
        } catch (error) {
            await LogsServices.create(
                'updateRunner error',
                'Error when trying to update user data',
                error
            );
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async deleteRunner(req, res) {
        try {
            const { id } = req.params;
            const runner = await RunnersServices.delete(id);
            res.status(200).send({ error: false, data: runner });
        } catch (error) {
            await LogsServices.create(
                'deleteRunner error',
                'Error when trying to delete user data',
                error
            );
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async updateRoutine(req, res) {
        try {
            const { id } = req.params;
            const { date, routine } = req.body;
            const runner = await RunnersServices.getById(id);
            const newRoutine = { date, routine };
            if (runner.calendar.some((item) => item.date == date)) {
                const filteredCalendar = runner.calendar.filter(
                    (item) => item.date != date
                );
                const updatedCalendar = filteredCalendar.push(newRoutine);
                runner.calendar = updatedCalendar;
            } else {
                const updatedCalendar = runner.calendar.push(newRoutine);
                runner.calendar = updatedCalendar;
            }
            const updatedRunner = await RunnersServices.update(id, runner);
            res.send({ error: false, data: updatedRunner });
        } catch (error) {
            await LogsServices.create(
                'updateRoutine error',
                'Error when trying to find or update user',
                error
            );
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async updateCalendar(req, res) {
        try {
            const { id } = req.params;
            const runner = req.body;
            const updatedRunner = await RunnersServices.update(id, runner);
            res.send({
                error: false,
                data: updatedRunner,
            });
        } catch (error) {
            await LogsServices.create(
                'updateCalendar error',
                'Error when trying to find or update user',
                error
            );
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    static async routineCompleted(req, res) {
        try {
            const { routine_id, user_id, startDate } = req.body;
            console.log('body => ', { routine_id, user_id, startDate });
            const runner = await RunnersServices.getById(user_id);
            const index = runner.calendar.routines.findIndex(
                (item) => item.start == startDate && item._id == routine_id
            );
            console.log('index: ', index);
            runner.calendar.routines[index].completed = true;
            const updatedRunner = await RunnersServices.update(user_id, runner);
            console.log('updatedRunner: ', updatedRunner);
            res.send({
                data: updatedRunner,
                error: false,
            });
        } catch (error) {
            await LogsServices.create(
                'routineCompleted error',
                'Error when trying to update calendar of user',
                error
            );
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }
}
