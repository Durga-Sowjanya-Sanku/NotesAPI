//password -- 7vPbr6tNkbORGpSP
//username -- sowjanya

const url = 'mongodb+srv://snkdurgasowjanya:7vPbr6tNkbORGpSP@cluster0.diajc.mongodb.net/notes-db'

const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const validator = require('validator');

const app = express();
const PORT = 9090;

app.use(express.json());

const connectDb = async () => {
    try {
        await mongoose.connect(url);
        console.log('Connected to database successfully');
    } catch (error) {
        console.log(error);
    }
}

connectDb();

const NotesSchema = mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true]
        },
        title: {
            type: String,
            required: [true, 'Please enter the title of the notes'],
            maxLength: 50
        },
        content: {
            type: String,
            required: [true],
            maxLength: 500,
        },
        author: {
            type: String,
            required: [true]
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }
)

const notes = mongoose.model("note", NotesSchema);

const listAllNotes = async (body, response) => {
    try {
        await notes.find(body).then((list) => { response.json({ message: list }) });
    } catch (err) {
        response.json({
            error: err.message
        })
    }
}

const addNotes = async (body, response) => {
    try {
        await notes.create(body)
            .then((msg) => { response.json({ message: msg }) })
            .catch((err) => response.json({ message: err }));
    } catch (err) {
        response.json(
            { message: "Failed to add to Db" }
        )
    }
}

const deleteNotes = async (filter, response) => {
    try {
        await notes.deleteOne(filter)
            .then((msg) => { response.json({ message: msg }) })
            .catch((err) => response.json({ message: err }));
    } catch (err) {
        response.json(
            { message: "Failed to delete from Db" }
        )
    }
}

const updateNotes = async (filter, newOne, response) => {
    try {
        await notes.updateOne(filter, newOne)
            .then((msg) => { response.json({ message: msg }) })
            .catch((err) => response.json({ message: err }));
    } catch (err) {
        response.json(
            { message: "Failed to update in Db" }
        )
    }
}

app.get('/', (request, response) => {
    response.json({
        message: "/create, /update/<username>, /list/<username>, /delete/<username>"
    });
});

app.get('/list/:id', (request, response) => {
    const username = request.params.id;

    const filter = {
        username: username
    };

    try {
        listAllNotes(filter, response);
    } catch (error) {
        response.json({
            message: "Failed to retrieve",
            error: error.message
        });
    }
});

app.post('/create/', (request, response) => {
    const body = request.body;
    try {
        addNotes(body, response);
    } catch (error) {
        response.json(
            {
                message: "Failed to add",
                error: error.message
            }
        )
    }
})

app.delete('/delete/:id', (request, response) => {
    const { title } = request.body;
    const username = request.params.id;

    const filter = {
        title: title,
        username: username
    };

    try {
        deleteNotes(filter, response);
    } catch (error) {
        response.json({
            message: "Failed to delete",
            error: error.message
        });
    }
})

app.put('/update/:id', (request, response) => {
    const [oldData, newData] = request.body;

    const title = oldData.title;
    const username = request.params.id;

    const filter = {
        title: title,
        username: username
    };

    try {
        updateNotes(filter, newData, response);
    } catch (error) {
        response.json({
            message: "Failed to update",
            error: error.message
        });
    }
})

app.listen(PORT, () => {
    console.log(`The server is listening at PORT ${PORT}`);
});
