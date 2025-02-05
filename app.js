const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to log user visits (IP and time)
app.use((req, res, next) => {
  const ip = req.ip; // User's IP address
  const timestamp = new Date().toISOString(); // Timestamp of visit

  const logData = `IP: ${ip}, Time: ${timestamp}\n`;

  // Append log data to visits.log
  fs.appendFile(path.join(__dirname, 'logs', 'visits.log'), logData, (err) => {
    if (err) {
      console.error('Failed to log visit:', err);
    }
  });

  next(); // Continue to the next middleware or route
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to retrieve log data as JSON
app.get('/logs', (req, res) => {
  fs.readFile(path.join(__dirname, 'logs', 'visits.log'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read log file' });
    }

    // Split the log data into lines and send it as JSON
    const logs = data.split('\n').filter(line => line).map(line => {
      const [ip, time] = line.split(', ');
      return { ip: ip.split(': ')[1], time: time.split(': ')[1] };
    });

    res.json(logs);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
