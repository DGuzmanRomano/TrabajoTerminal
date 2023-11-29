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

    // Run the Go code
    exec(`go run ${filePath}`, (error, stdout, stderr) => {
        // Delete the file after execution
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Failed to delete file ${filePath}`, err.message);
            }
        });
    
        if (stderr) {
            console.error("Compilation error:", stderr);
            return res.status(500).json({ error: 'Compilation failed', details: stderr });
        }
    
        if (error) {
            console.error("Server-side error:", error.message);
            return res.status(500).json({ error: 'Failed to run code', details: error.message });
        }
    
        res.status(200).json({ output: stdout });
    });
};
