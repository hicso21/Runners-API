import Runners from "../../../db/models/Runners.js";

export default class RunnersServices {

    static async getAll() {
        try {
            const runners = await Runners.find({});
            return runners;
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async getById(id) {
        try {
            const runner = await Runners.findById(id);
            return runner;
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async create(runner) {
        try {
            const newRunner = await new Runners(runner);
            await newRunner.save();
            return newRunner;
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async update(name, runner) {
        try {
            const res = await Runners.updateOne({ name: name }, runner);
            return {
                error: false,
                runner: res
            };
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

    static async delete(name) {
        try {
            await Runners.deleteOne({ name: name });
            return {
                error: false
            };
        } catch (error) {
            return {
                error: true,
                data: error
            };
        }
    }

}