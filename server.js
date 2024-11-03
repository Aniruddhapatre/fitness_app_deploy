const express = require('express');
const mysql = require('mysql2'); // Use mysql2 instead of mysql
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path'); // Import the path module

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // Serve static files from the current directory

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'Aniruddha',
    password: '1604',
    database: 'fitnessdb',
});

// Connect to the MySQL database
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// Login endpoint
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Query to find user by email
    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        const user = results[0];

        // Compare password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).send('Server error');
            }
            if (!isMatch) {
                return res.status(401).send('Invalid email or password');
            }

            // Successful login
            // Send an HTML response with a script for alert and redirection
            res.send(`
                <html>
                    <head>
                        <title>Login Successful</title>
                        <script>
                            alert('Login successful!');
                            window.location.href = 'homepage.html'; // Redirect to homepage
                        </script>
                    </head>
                    <body>
                        <p>If you are not redirected, <a href="homepage.html">click here</a>.</p>
                    </body>
                </html>
            `);
        });
    });
});


// Signup endpoint
app.post('/signup', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Check if the user already exists
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    connection.query(checkUserQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        if (results.length > 0) {
            return res.status(400).send('User already exists');
        }

        // Hash the password before saving
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).send('Error hashing password');
            }

            // Insert the new user into the database
            const insertUserQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
            connection.query(insertUserQuery, [email, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).send('Server error');
                }

                // Send an HTML response with a script for alert and redirection
                res.send(`
                    <html>
                        <head>
                            <title>Signup Successful</title>
                            <script>
                                alert('Signup successful! You can now log in.');
                                window.location.href = 'logindex.html'; // Redirect to the login page (logindex.html)
                            </script>
                        </head>
                        
                    </html>
                `);
            });
        });
    });
});


// Serve logindex.html as the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'logindex.html')); // Serve logindex.html
});

// Optional: Add an explicit route to access logindex.html directly
app.get('/logindex', (req, res) => {
    res.sendFile(path.join(__dirname, 'logindex.html')); // Serve logindex.html
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
