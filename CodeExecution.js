const fs = require('fs');
const { exec } = require('child_process');

exports.executeCode = (req, res) => {
    console.log(req.body); // Log the entire body to check if the 'content' field is present
    const userCode = req.body.content;

    if (!userCode) {
        return res.status(400).send('No code content provided');
    }
    // Save the code to a file
    const filePath = `userCode-${Date.now()}.go`;
    fs.writeFileSync(filePath, userCode);

    // Run the Go code directly
    exec(`go run ${filePath}`, (error, stdout, stderr) => {
        // Use fs.unlink to delete the file asynchronously after code execution
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Failed to delete file ${filePath}`, err.message);
                // Decide how you want to handle this error. It might be benign, but could indicate permissions issues
            }
        });

        if (error) {
            console.error("Server-side error:", error.message); // Log the error server-side
            return res.status(500).json({ error: 'Failed to run code', details: error.message });
        }

        if (stderr) {
            res.status(500).json({ error: stderr });
        } else {
            res.status(200).json({ output: stdout });
        }
    });
};
