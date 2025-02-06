require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose'); // Use Mongoose for MongoDB
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // Serve static files from the current directory

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB Database'))
    .catch((err) => console.error('MongoDB connection error:', err));

// MongoDB user schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Login endpoint
app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.send(`
                <html>
                    <head>
                        <title>Login Failed</title>
                        <script>
                            alert('Invalid email or password');
                            window.location.href = 'index.html'; // Redirect to the login page
                        </script>
                    </head>
                    <body>
                        <p>If you are not redirected, <a href="index.html">click here</a>.</p>
                    </body>
                </html>
            `);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send(`
                <html>
                    <head>
                        <title>Login Failed</title>
                        <script>
                            alert('Invalid email or password');
                            window.location.href = 'index.html'; // Redirect to the login page
                        </script>
                    </head>
                    <body>
                        <p>If you are not redirected, <a href="index.html">click here</a>.</p>
                    </body>
                </html>
            `);
        }

        // Successful login
        res.send(`
            <html>
                <head>
                    <title>Login Successful</title>
                    <script>
                        
                        window.location.href = 'homepage.html'; // Redirect to homepage
                    </script>
                </head>
                <body>
                    <p>If you are not redirected, <a href="homepage.html">click here</a>.</p>
                </body>
            </html>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


// Serve logindex.html as the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve logindex.html
});

// Optional: Add an explicit route to access logindex.html directly
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve logindex.html
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
