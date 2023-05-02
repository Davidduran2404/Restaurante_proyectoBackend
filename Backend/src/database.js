import { connect } from 'mongoose';

// luego de ejecutar el codigo continua a la siguiente instruccion
(async () => {
    try {
        const db = await connect("mongodb+srv://dcardenasj:vdIrktNPReimuFwE@cluster0.onw5caa.mongodb.net/?retryWrites=true&w=majority");
        console.log("DB connected to", db.connection.name);
    } catch (error) {
        console.error(error);
    }
})();