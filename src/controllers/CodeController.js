const fs = require('fs');
const { exec } = require('child_process');

exports.executeCode = (req, res) => {
    const userCode = req.body.content;
    
    // Save the code to a file

    const filePath = `userCode-${Date.now()}.go`;
    fs.writeFileSync(filePath, userCode);
    
    // Run the Go code directly
    exec(`go run ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error("Server-side error:", error.message); // Log the error server-side
            return res.status(500).json({ error: 'Failed to run code', details: error.message });
        }
        
        if (stderr) {
            res.status(500).json({ error: stderr });
        }
        else {
            res.status(200).json({ output: stdout });
        }
    });
};
